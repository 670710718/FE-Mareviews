
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../auth/AuthContext';
import AdminMembers from './AdminMembers';
import { getAdminMembers, setMemberRole } from '../../api/backend';

jest.mock('../../api/backend');

const ME = {
  id: 2,
  displayName: 'Admin',
  role: 'admin'
};

const MEMBERS = [
  {
    id: 1,
    email: 'demo@mareview.test',
    displayName: 'Demo',
    role: 'member',
    createdAt: '2026-09-01T09:00:00.000Z'
  },
  {
    id: 2,
    email: 'admin@mareview.test',
    displayName: 'Admin',
    role: 'admin',
    createdAt: '2026-09-01T09:00:00.000Z'
  }
];

function renderPage() {
  localStorage.setItem('mareview.token', 'mock.2.abc');
  localStorage.setItem('mareview.member', JSON.stringify(ME));

  return render(
    <AuthProvider>
      <MemoryRouter>
        <AdminMembers />
      </MemoryRouter>
    </AuthProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('โหลดรายชื่อแล้วต้องเห็นทุกคน และปุ่มของตัวเองกดไม่ได้', async () => {
  getAdminMembers.mockResolvedValue(MEMBERS);

  renderPage();

  expect(
    await screen.findByText('demo@mareview.test')
  ).toBeInTheDocument();

  expect(
    screen.getByText('admin@mareview.test')
  ).toBeInTheDocument();

  expect(getAdminMembers).toHaveBeenCalledWith('mock.2.abc');

  const myRow = screen
    .getByText('admin@mareview.test')
    .closest('tr');

  expect(
    within(myRow).getByRole('button', { name: 'ลดเป็น member' })
  ).toBeDisabled();
});

test('เลื่อน member เป็น admin ต้องถามยืนยันก่อน แล้วค่อยเรียก backend และอัปเดตแถว', async () => {
  const user = userEvent.setup();

  getAdminMembers.mockResolvedValue(MEMBERS);

  setMemberRole.mockResolvedValue({
    ...MEMBERS[0],
    role: 'admin'
  });

  renderPage();

  await screen.findByText('demo@mareview.test');

  await user.click(
    screen.getByRole('button', { name: 'เลื่อนเป็น admin' })
  );

  // กดปุ่มเปลี่ยนบทบาทอย่างเดียว ยังไม่เรียก Backend
  expect(setMemberRole).not.toHaveBeenCalled();

  await user.click(
    screen.getByRole('button', { name: 'ยืนยัน' })
  );

  expect(setMemberRole).toHaveBeenCalledWith(
    1,
    'admin',
    'mock.2.abc'
  );

  const demoRow = screen
    .getByText('demo@mareview.test')
    .closest('tr');

  expect(
    within(demoRow).getByText('admin')
  ).toBeInTheDocument();

  expect(
    within(demoRow).getByRole('button', { name: 'ลดเป็น member' })
  ).toBeInTheDocument();
});

test('backend ตอบ Error ต้องเห็นข้อความ error และบทบาทไม่เปลี่ยน', async () => {
  const user = userEvent.setup();

  getAdminMembers.mockResolvedValue(MEMBERS);

  setMemberRole.mockRejectedValue(
    new Error('เปลี่ยนบทบาทของตัวเองไม่ได้ ให้ admin คนอื่นทำแทน')
  );

  renderPage();

  await screen.findByText('demo@mareview.test');

  await user.click(
    screen.getByRole('button', { name: 'เลื่อนเป็น admin' })
  );

  await user.click(
    screen.getByRole('button', { name: 'ยืนยัน' })
  );

  expect(
    await screen.findByText(/เปลี่ยนบทบาทของตัวเองไม่ได้/)
  ).toBeInTheDocument();

  const demoRow = screen
    .getByText('demo@mareview.test')
    .closest('tr');

  expect(
    within(demoRow).getByText('member')
  ).toBeInTheDocument();
});
