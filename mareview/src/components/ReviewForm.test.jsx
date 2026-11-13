
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewForm from './ReviewForm';

test('ยังไม่พิมพ์อะไร ปุ่มส่งต้องกดไม่ได้', () => {
  render(
    <ReviewForm
      dormitoryName="หอพักสุขใจ"
      onSubmit={jest.fn()}
    />
  );

  expect(
    screen.getByRole('button', { name: 'ส่งรีวิว' })
  ).toBeDisabled();
});

test('พิมพ์รีวิวแล้วกดส่ง ต้องเรียก onSubmit ด้วยข้อความและคะแนน แล้วขึ้นข้อความขอบคุณ', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn().mockResolvedValue();

  render(
    <ReviewForm
      dormitoryName="หอพักสุขใจ"
      onSubmit={onSubmit}
    />
  );

  await user.type(
    screen.getByPlaceholderText(/แชร์ประสบการณ์เกี่ยวกับหอพัก/),
    'ห้องพักสะอาด เดินทางสะดวก'
  );

  await user.click(
    screen.getByRole('button', { name: 'ส่งรีวิว' })
  );

  expect(onSubmit).toHaveBeenCalledWith(
    'ห้องพักสะอาด เดินทางสะดวก',
    5
  );

  expect(
    await screen.findByText(/ขอบคุณสำหรับรีวิว หอพักสุขใจ/)
  ).toBeInTheDocument();
});

test('ถ้า onSubmit โยน Error ต้องโชว์ข้อความนั้น และฟอร์มยังอยู่ให้แก้ต่อ', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn().mockRejectedValue(
    new Error('คุณรีวิวหอพักนี้ไปแล้ว')
  );

  render(
    <ReviewForm
      dormitoryName="หอพักสุขใจ"
      onSubmit={onSubmit}
    />
  );

  await user.type(
    screen.getByPlaceholderText(/แชร์ประสบการณ์เกี่ยวกับหอพัก/),
    'ห้องพักสะอาด เดินทางสะดวก'
  );

  await user.click(
    screen.getByRole('button', { name: 'ส่งรีวิว' })
  );

  expect(
    await screen.findByText('คุณรีวิวหอพักนี้ไปแล้ว')
  ).toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: 'ส่งรีวิว' })
  ).toBeInTheDocument();

  expect(
    screen.queryByText(/ขอบคุณสำหรับรีวิว/)
  ).not.toBeInTheDocument();
});

test('สามารถเปลี่ยนคะแนนรีวิวก่อนส่งได้', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn().mockResolvedValue();

  render(
    <ReviewForm
      dormitoryName="หอพักสุขใจ"
      onSubmit={onSubmit}
    />
  );

  await user.type(
    screen.getByPlaceholderText(/แชร์ประสบการณ์เกี่ยวกับหอพัก/),
    'ห้องพักสะอาด เดินทางสะดวก'
  );

  await user.click(
    screen.getByRole('button', { name: 'ให้คะแนน 3 ดาว' })
  );

  await user.click(
    screen.getByRole('button', { name: 'ส่งรีวิว' })
  );

  expect(onSubmit).toHaveBeenCalledWith(
    'ห้องพักสะอาด เดินทางสะดวก',
    3
  );
});
