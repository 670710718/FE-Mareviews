
import { useCallback, useEffect, useState } from 'react';
import {
  getAdminReviews,
  deleteAdminReview,
} from '../../api/backend';
import { useAuth } from '../../auth/AuthContext';

function normalizeReviews(data) {
  const list = Array.isArray(data)
    ? data
    : data?.items ?? data?.reviews ?? [];

  return list.map((review) => ({
    ...review,
    id: review.id ?? review.reviewId ?? review.review_id,
    text: review.text ?? review.comment ?? '',
    rating: Number(review.rating ?? 0),
    member: review.member ?? {
      displayName:
        review.displayName ??
        review.memberName ??
        review.member_name ??
        'สมาชิก Mareview',
    },
    dormitory: review.dormitory ?? {
      name:
        review.dormitoryName ??
        review.dormitory_name ??
        review.dormName ??
        `หอพัก ID ${review.dormId ?? review.dorm_id ?? '-'}`,
    },
    createdAt: review.createdAt ?? review.created_at ?? null,
  }));
}

function formatDate(value) {
  if (!value) return 'ไม่ระบุวันที่';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'ไม่ระบุวันที่';
  }

  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function AdminReviews() {
  const { token } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadReviews = useCallback(async () => {
    if (!token) {
      setError('กรุณาเข้าสู่ระบบในฐานะแอดมิน');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const data = await getAdminReviews(token);
      setReviews(normalizeReviews(data));
    } catch (err) {
      console.error('Load admin reviews error:', err);
      setError(err.message || 'ไม่สามารถโหลดรายการรีวิวได้');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  async function handleDelete(reviewId) {
    if (deletingId !== null) return;

    const confirmed = window.confirm(
      'คุณต้องการลบรีวิวนี้ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้'
    );

    if (!confirmed) return;

    try {
      setDeletingId(reviewId);
      setMessage('');
      setError('');

      await deleteAdminReview(reviewId, token);

      setReviews((current) =>
        current.filter((review) => review.id !== reviewId)
      );

      setMessage('ลบรีวิวเรียบร้อยแล้ว');
    } catch (err) {
      console.error('Delete admin review error:', err);
      setError(err.message || 'ไม่สามารถลบรีวิวได้');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
            Review Management
          </span>

          <h1 className="mt-2 text-2xl font-extrabold text-slate-900">
            จัดการรีวิว
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            ตรวจสอบรีวิวจากสมาชิกและลบรีวิวที่ไม่เหมาะสม
          </p>
        </div>

        <button
          type="button"
          onClick={loadReviews}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-50"
        >
          <span>↻</span>
          {loading ? 'กำลังโหลด...' : 'รีเฟรชข้อมูล'}
        </button>
      </div>

      {/* Summary */}
      <div className="rounded-2xl border border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 p-5">
        <p className="text-sm font-medium text-violet-600">
          รีวิวทั้งหมด
        </p>

        <p className="mt-1 text-3xl font-extrabold text-violet-800">
          {reviews.length.toLocaleString('th-TH')}
        </p>

        <p className="mt-1 text-xs text-violet-500">
          จำนวนรีวิวในระบบ Mareview
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          role="status"
          className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm text-rose-700"
        >
          {error}
          <button
            type="button"
            onClick={loadReviews}
            className="ml-3 font-bold underline"
          >
            ลองอีกครั้ง
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-violet-100 bg-white p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
          <p className="mt-3 text-sm text-slate-500">
            กำลังโหลดรีวิว...
          </p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && reviews.length === 0 && (
        <div className="rounded-2xl border border-dashed border-violet-200 bg-white px-5 py-16 text-center">
          <div className="text-5xl">💬</div>

          <h2 className="mt-4 font-bold text-slate-800">
            ยังไม่มีรีวิวในระบบ
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            เมื่อสมาชิกส่งรีวิว รายการจะแสดงที่หน้านี้
          </p>
        </div>
      )}

      {/* Review List */}
      {!loading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm"
            >
              {/* Reviewer */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-bold text-slate-800">
                    {review.member?.displayName || 'สมาชิก Mareview'}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    หอพัก: {review.dormitory?.name || `ID ${review.dormId ?? '-'}`}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(review.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                    คะแนน {review.rating}/5
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
                    รีวิว #{review.id}
                  </span>
                </div>
              </div>

              {/* Review Content */}
              <div className="mt-5 rounded-xl bg-violet-50/60 p-4">
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                  {review.text || 'ไม่มีข้อความรีวิว'}
                </p>
              </div>

              {/* Delete */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDelete(review.id)}
                  disabled={deletingId !== null}
                  className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === review.id
                    ? 'กำลังลบ...'
                    : 'ลบรีวิว'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReviews;
