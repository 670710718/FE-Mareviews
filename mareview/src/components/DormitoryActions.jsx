
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  putDormitoryRating,
  addToWishlist,
  removeFromWishlist
} from '../api/backend';

function DormitoryActions({ dormitoryId }) {
  const { isLoggedIn, token } = useAuth();

  const [myScore, setMyScore] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/70 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
            🔒
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              เข้าสู่ระบบเพื่อใช้งานเพิ่มเติม
            </p>

            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              <Link
                to="/login"
                className="font-bold text-violet-700 transition hover:text-violet-900 hover:underline"
              >
                เข้าสู่ระบบ
              </Link>{' '}
              เพื่อให้คะแนนและเพิ่มหอพักเข้ารายการที่บันทึกไว้
            </p>
          </div>
        </div>
      </div>
    );
  }

  async function handleVote(score) {
    if (loading) return;

    try {
      setLoading(true);
      setMessage(null);

      await putDormitoryRating(dormitoryId, score, token);

      setMyScore(score);
      setMessage('บันทึกคะแนนเรียบร้อยแล้ว');
    } catch (err) {
      setMessage(err.message || 'ไม่สามารถบันทึกคะแนนได้');
    } finally {
      setLoading(false);
    }
  }

  async function handleWishlist() {
    if (loading) return;

    try {
      setLoading(true);
      setMessage(null);

      if (inWishlist) {
        await removeFromWishlist(dormitoryId, token);
        setInWishlist(false);
        setMessage('นำหอพักออกจากรายการที่บันทึกไว้แล้ว');
      } else {
        await addToWishlist(dormitoryId, token);
        setInWishlist(true);
        setMessage('เพิ่มหอพักเข้ารายการที่บันทึกไว้แล้ว');
      }
    } catch (err) {
      setMessage(err.message || 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 space-y-4">

      {/* Rating */}
      <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              ให้คะแนนหอพัก
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              เลือกคะแนนตั้งแต่ 1–10 คะแนน
            </p>
          </div>

          <span className="rounded-lg bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            {myScore ? `${myScore} / 10 คะแนน` : 'ยังไม่ได้ให้คะแนน'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              type="button"
              disabled={loading}
              onClick={() => handleVote(n)}
              aria-label={`ให้คะแนน ${n} จาก 10`}
              aria-pressed={myScore === n}
              className={
                'flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ' +
                (myScore === n
                  ? 'border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200'
                  : 'border-violet-100 bg-violet-50/50 text-slate-600 hover:border-violet-300 hover:bg-violet-100 hover:text-violet-700')
              }
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Wishlist */}
      <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              รายการหอพักที่สนใจ
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              บันทึกหอพักไว้เพื่อกลับมาดูภายหลัง
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleWishlist}
            aria-pressed={inWishlist}
            className={
              'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ' +
              (inWishlist
                ? 'border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100'
                : 'border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200 hover:-translate-y-0.5 hover:bg-violet-700')
            }
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                กำลังบันทึก...
              </>
            ) : inWishlist ? (
              <>
                <span>♥</span>
                บันทึกหอพักนี้แล้ว
              </>
            ) : (
              <>
                <span>♡</span>
                บันทึกหอพักนี้
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className="flex items-start gap-2 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-800"
          role="status"
        >
          <span className="mt-0.5">ⓘ</span>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default DormitoryActions;
