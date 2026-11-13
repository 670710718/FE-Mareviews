
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Dormitories from './Dormitories';
import { getDormitories } from '../api/backend';

// Mock backend
jest.mock('../api/backend');

const FAKE_DORMITORIES = [
  {
    id: 1,
    name: 'หอพักบ้านสุขใจ',
    dormType: 'หอใน',
    genderType: 'ชาย',
    minPrice: 3500,
    maxPrice: 4500,
    ratingAverage: 8.5,
    ratingCount: 20,
    images: [],
  },
  {
    id: 2,
    name: 'หอพักศิลป์สบาย',
    dormType: 'หอนอก',
    genderType: 'หญิง',
    minPrice: 4000,
    maxPrice: 5500,
    ratingAverage: 8.4,
    ratingCount: 15,
    images: [],
  },
  {
    id: 3,
    name: 'หอพักบ้านสวน',
    dormType: 'หอใน',
    genderType: 'รวม',
    minPrice: 3000,
    maxPrice: 4000,
    ratingAverage: 9.0,
    ratingCount: 10,
    images: [],
  },
];

function renderDormitories() {
  return render(
    <MemoryRouter>
      <Dormitories />
    </MemoryRouter>
  );
}

test('โหลดสำเร็จ ต้องเห็นการ์ดครบและปุ่มประเภทหอพักที่สร้างจากข้อมูล', async () => {
  getDormitories.mockResolvedValue({
    items: FAKE_DORMITORIES,
  });

  renderDormitories();

  expect(await screen.findByText('หอพักบ้านสุขใจ')).toBeInTheDocument();

  expect(screen.getAllByRole('link')).toHaveLength(3);

  expect(
    screen.getByRole('button', { name: 'หอใน' })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: 'หอนอก' })
  ).toBeInTheDocument();
});

test('พิมพ์ค้นหา ต้องกรองข้อมูลในเครื่องโดยไม่เรียก Backend ซ้ำ', async () => {
  const user = userEvent.setup();

  getDormitories.mockResolvedValue({
    items: FAKE_DORMITORIES,
  });

  renderDormitories();

  await screen.findByText('หอพักบ้านสุขใจ');

  await user.type(
    screen.getByPlaceholderText(/ค้นหาชื่อหรือประเภทหอพัก/),
    'ศิลป์สบาย'
  );

  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(screen.getByText('หอพักศิลป์สบาย')).toBeInTheDocument();

  expect(getDormitories).toHaveBeenCalledTimes(1);
});

test('เลือกประเภทหอพัก ต้องแสดงเฉพาะหอพักประเภทที่เลือก', async () => {
  const user = userEvent.setup();

  getDormitories.mockResolvedValue({
    items: FAKE_DORMITORIES,
  });

  renderDormitories();

  await screen.findByText('หอพักบ้านสุขใจ');

  await user.click(
    screen.getByRole('button', { name: 'หอนอก' })
  );

  expect(screen.getAllByRole('link')).toHaveLength(1);
  expect(screen.getByText('หอพักศิลป์สบาย')).toBeInTheDocument();
  expect(screen.queryByText('หอพักบ้านสุขใจ')).not.toBeInTheDocument();

  expect(getDormitories).toHaveBeenCalledTimes(1);
});

test('Backend ล่ม ต้องเห็นข้อความ Error และกดลองใหม่เพื่อโหลดอีกครั้งได้', async () => {
  const user = userEvent.setup();

  getDormitories
    .mockRejectedValueOnce(new Error('server ไม่ได้ตอบเป็น JSON'))
    .mockResolvedValueOnce({
      items: FAKE_DORMITORIES,
    });

  renderDormitories();

  expect(
    await screen.findByText('โหลดข้อมูลไม่สำเร็จ')
  ).toBeInTheDocument();

  expect(
    screen.getByText('server ไม่ได้ตอบเป็น JSON')
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole('button', { name: 'ลองใหม่' })
  );

  expect(
    await screen.findByText('หอพักบ้านสุขใจ')
  ).toBeInTheDocument();

  expect(getDormitories).toHaveBeenCalledTimes(2);
});
