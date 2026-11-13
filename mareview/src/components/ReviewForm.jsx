
import { useState } from 'react';

// รับ onSubmit(text, rating) จาก Component แม่
function ReviewForm({ dormitoryName, onSubmit }) {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(10);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-purple-50 p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-3xl">
          💜
        </div>

        <h3 className="mt-4 text-lg font-bold text-violet-800">
          ขอบคุณสำหรับรีวิว!
        </h3>

        <p className="mt-2 text-sm text-slate-600">
          ขอบคุณที่แบ่งปันประสบการณ์เกี่ยวกับ {dormitoryName}
        </p>

        <p className="mt-3 text-xs font-medium text-violet-500">
          รีวิวของคุณจะช่วยให้สมาชิกคนอื่นตัดสินใจได้ง่ายขึ้น
        </p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (review.trim().length < 10) {
      setError(new Error('รีวิวต้องมีความยาวอย่างน้อย 10 ตัวอักษร'));
      return;
    }

    if (rating < 1 || rating > 10) {
      setError(new Error('คะแนนต้องอยู่ระหว่าง 1-10'));
      return;
    }

    setStatus('submitting');
    setError(null);

    try {
      await onSubmit(review.trim(), rating);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
          Share Your Experience
        </span>

        <h3 className="mt-2 text-lg font-bold text-slate-800">
          เขียนรีวิว {dormitoryName}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          คะแนนและความคิดเห็นของคุณมีส่วนช่วยให้ชุมชน Mareview ดีขึ้น
        </p>
      </div>

      {/* Rating */}
      <div className="rounded-2xl bg-violet-50/70 p-5">
        <p className="mb-3 text-sm font-semibold text-slate-700">
          ให้คะแนนหอพัก
        </p>

        <div
          className="grid grid-cols-5 gap-2 sm:grid-cols-10"
          role="group"
          aria-label="เลือกคะแนนรีวิว 1 ถึง 10 คะแนน"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              disabled={status === 'submitting'}
              onClick={() => setRating(n)}
              aria-label={`ให้คะแนน ${n} คะแนน`}
              aria-pressed={rating === n}
              className={
                'flex h-11 items-center justify-center rounded-xl border text-sm font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ' +
                (rating === n
                  ? 'border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200'
                  : 'border-violet-100 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-100 hover:text-violet-700')
              }
            >
              {n}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            คะแนนที่คุณเลือก
          </span>

          <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-violet-700 shadow-sm">
            {rating} / 10 คะแนน
          </span>
        </div>

        <div className="mt-2 flex justify-between text-xs text-slate-400">
          <span>ควรปรับปรุง</span>
          <span>ยอดเยี่ยม</span>
        </div>
      </div>

      {/* Review Text */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <label
            htmlFor="review-content"
            className="text-sm font-semibold text-slate-700"
          >
            ความคิดเห็นของคุณ
          </label>

          <span
            className={
              'text-xs ' +
              (review.trim().length >= 10
                ? 'font-medium text-violet-600'
                : 'text-slate-400')
            }
          >
            {review.trim().length} ตัวอักษร
          </span>
        </div>

        <textarea
          id="review-content"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          disabled={status === 'submitting'}
          rows={5}
          placeholder="แชร์ประสบการณ์เกี่ยวกับหอพัก เช่น บรรยากาศ ความสะอาด ความปลอดภัย หรือการเดินทาง..."
          className="w-full resize-y rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-violet-200 focus:border-violet-400 focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50"
        />

        <p className="mt-2 text-xs text-slate-400">
          กรุณาเขียนรีวิวอย่างน้อย 10 ตัวอักษร
        </p>
      </div>

      {/* Submit */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={review.trim().length < 10 || status === 'submitting'}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition duration-200 hover:-translate-y-0.5 hover:from-violet-700 hover:to-purple-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
        >
          {status === 'submitting' ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              กำลังส่งรีวิว...
            </>
          ) : (
            <>
              <span>✦</span>
              ส่งรีวิว
            </>
          )}
        </button>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-rose-600"
          >
            {error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'}
          </p>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;
