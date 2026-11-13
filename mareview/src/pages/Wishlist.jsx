
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { getWishlist } from '../api/backend';
import DormitoryGrid from '../components/DormitoryGrid';

function Wishlist() {
  const { member, token } = useAuth();

  const [dormitories, setDormitories] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    const loadWishlist = async () => {
      try {
        setStatus('loading');
        setError(null);

        const response = await getWishlist(token);
        const items = Array.isArray(response)
          ? response
          : response?.items ?? [];

        if (!ignore) {
          setDormitories(items);
          setStatus('success');
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
          setStatus('error');
        }
      }
    };

    if (token) {
      loadWishlist();
    }

    return () => {
      ignore = true;
    };
  }, [token, reloadKey]);

  return (
    <div className="min-h-screen bg-violet-50/30">

      {/* Page Header */}
      <section className="border-b border-violet-100 bg-gradient-to-br from-violet-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                My Collection
              </span>

              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                หอพักที่บันทึกไว้
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                รวมรายการหอพักที่คุณสนใจไว้ในที่เดียว
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 text-3xl text-white shadow-lg shadow-violet-200">
              ♡
            </div>
          </div>

          {/* Member Info */}
          <div className="mt-7 flex items-center gap-3 rounded-2xl border border-violet-100 bg-white/80 p-4 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
              {member?.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            <div className="min-w-0">
              <p className="text-xs text-slate-400">
                รายการที่บันทึกโดย
              </p>

              <p className="truncate text-sm font-bold text-violet-800">
                {member?.displayName || 'สมาชิก Mareview'}
              </p>
            </div>

            <div className="ml-auto hidden text-right sm:block">
              <p className="text-xs text-slate-400">
                หอพักที่บันทึกไว้
              </p>

              <p className="text-lg font-extrabold text-violet-700">
                {status === 'success' ? dormitories.length : '—'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">

        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              รายการของฉัน
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              สามารถเลือกดูรายละเอียดหอพักที่คุณสนใจได้
            </p>
          </div>

          <Link
            to="/dormitories"
            className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition hover:border-violet-400 hover:bg-violet-50"
          >
            <span>＋</span>
            ค้นหาหอพักเพิ่มเติม
          </Link>
        </div>

        <DormitoryGrid
          dormitories={dormitories}
          status={status}
          error={error}
          onRetry={() => setReloadKey((prev) => prev + 1)}
        />

        {/* Empty Wishlist */}
        {status === 'success' && dormitories.length === 0 && (
          <div className="mt-6 rounded-3xl border border-dashed border-violet-200 bg-white px-6 py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-3xl">
              ♡
            </div>

            <h3 className="mt-4 font-bold text-slate-800">
              ยังไม่มีหอพักที่บันทึกไว้
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              ลองค้นหาหอพักที่สนใจ แล้วกดบันทึกเพื่อกลับมาดูภายหลัง
            </p>

            <Link
              to="/dormitories"
              className="mt-5 inline-flex rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              เริ่มค้นหาหอพัก
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Wishlist;
