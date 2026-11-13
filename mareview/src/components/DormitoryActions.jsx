
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  addToWishlist,
  removeFromWishlist,
} from '../api/backend';

function DormitoryActions({ dormitoryId }) {
  const { isLoggedIn, token } = useAuth();

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
              เข้าสู่ระบบเพื่อบันทึกหอพัก
            </p>

            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              <Link
                to="/login"
                className="font-bold text-violet-700 transition hover:text-violet-900 hover:underline"
              >
                เข้าสู่ระบบ
              </Link>{' '}
              เพื่อเพิ่มหอพักเข้ารายการที่สนใจ
            </p>
          </div>
        </div>
      </div>
    );
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
      {/* Wishlist */}
      <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              รายการหอพักที่สนใจ
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              บันทึกหอพักไว้เพื่อกลับมาดูภายหลัง
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleWishlist}
            aria-pressed={inWishlist}
            className={
              'inline-flex items-center justify-center gap-3 rounded-xl px-6 py-4 text-base font-bold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ' +
              (inWishlist
                ? 'border border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100'
                : 'bg-violet-600 text-white shadow-md shadow-violet-200 hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg')
            }
          >
            {loading ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                กำลังบันทึก...
              </>
            ) : inWishlist ? (
              <>
                <span className="text-xl">♥</span>
                บันทึกหอพักนี้แล้ว
              </>
            ) : (
              <>
                <span className="text-xl">♡</span>
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
