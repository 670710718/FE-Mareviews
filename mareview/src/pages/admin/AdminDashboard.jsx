
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { getAdminStats } from '../../api/backend';
import { ErrorBox, Loading } from '../../pages/admin/AdminStates';

// ค่าเริ่มต้นของ Dashboard
const DEFAULT_STATS = {
  dormitories: 0,
  members: 0,
  admins: 0,
  ratings: 0,
  wishlistItems: 0,
  topRated: [],
  newestMembers: [],
};

// แปลงข้อมูลจาก Backend ให้เป็นรูปแบบที่ Frontend ใช้งานได้
function normalizeStats(data) {
  const source = data?.stats ?? data ?? {};

  return {
    ...DEFAULT_STATS,
    ...source,
    dormitories: source.dormitories ?? 0,
    members: source.members ?? 0,
    admins: source.admins ?? 0,
    ratings: source.ratings ?? 0,
    wishlistItems: source.wishlistItems ?? 0,
    topRated: Array.isArray(source.topRated)
      ? source.topRated
      : [],
    newestMembers: Array.isArray(source.newestMembers)
      ? source.newestMembers
      : [],
  };
}

// การ์ดตัวเลขสถิติ
function StatCard({ label, value, to, icon, description }) {
  const body = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
          {value ?? 0}
        </p>

        {description && (
          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        )}
      </div>

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xl">
        {icon}
      </div>
    </div>
  );

  const cls =
    'rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition duration-200';

  return to ? (
    <Link
      to={to}
      className={`${cls} block hover:-translate-y-1 hover:border-violet-300 hover:shadow-md`}
    >
      {body}
    </Link>
  ) : (
    <div className={cls}>
      {body}
    </div>
  );
}

const dateTH = (iso) => {
  if (!iso) return '-';

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

function AdminDashboard() {
  const { token } = useAuth();

  const [stats, setStats] = useState(DEFAULT_STATS);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setStatus('loading');
      setError(null);

      try {
        const data = await getAdminStats(token);

        if (!ignore) {
          setStats(normalizeStats(data));
          setStatus('success');
        }
      } catch (err) {
        if (!ignore) {
          setError(err);
          setStatus('error');
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [token, reloadKey]);

  if (status === 'loading') return <Loading />;

  if (status === 'error') {
    return (
      <ErrorBox
        error={error}
        onRetry={() => setReloadKey((k) => k + 1)}
      />
    );
  }

  return (
    <div className="space-y-8">

      {/* Dashboard Heading */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-purple-600 p-6 text-white shadow-lg shadow-violet-200 md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-48 w-48 rounded-full bg-purple-300/20 blur-2xl" />

        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
            Mareview Administration
          </p>

          <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100">
            ภาพรวมข้อมูลและสถิติของเว็บไซต์ Mareview
            สำหรับผู้ดูแลระบบ
          </p>
        </div>
      </section>

      {/* Overview Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            สถิติภาพรวม
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            ข้อมูลสรุปการใช้งานภายในเว็บไซต์
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard
            label="หอพักทั้งหมด"
            value={stats.dormitories}
            to="/admin/dormitories"
            icon="🏠"
            description="จัดการข้อมูลหอพัก"
          />

          <StatCard
            label="สมาชิกทั้งหมด"
            value={stats.members}
            to="/admin/members"
            icon="👥"
            description="จัดการสมาชิก"
          />

          <StatCard
            label="ผู้ดูแลระบบ"
            value={stats.admins}
            icon="🛡️"
            description="Admin"
          />

          <StatCard
            label="รีวิวหอพัก"
            value={stats.ratings}
            icon="⭐"
            description="รีวิวจากสมาชิก"
          />

          <StatCard
            label="รายการบันทึก"
            value={stats.wishlistItems}
            icon="❤️"
            description="Wishlist ทั้งหมด"
          />
        </div>
      </section>

      {/* Dashboard Lists */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* Top Rated Dormitories */}
        <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
          <div className="border-b border-violet-100 bg-violet-50/60 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-xl">
                🏆
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  หอพักที่ได้คะแนนสูงสุด
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  คะแนนจากสมาชิก Mareview (เต็ม 10 คะแนน)
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {stats.topRated.length === 0 ? (
              <div className="py-10 text-center">
                <div className="text-3xl">⭐</div>

                <p className="mt-3 text-sm text-slate-400">
                  ยังไม่มีสมาชิกให้คะแนนหอพัก
                </p>
              </div>
            ) : (
              <ol className="divide-y divide-violet-50">
                {stats.topRated.map((dormitory, i) => (
                  <li
                    key={dormitory.id ?? i}
                    className="flex items-center gap-3 py-3"
                  >
                    {dormitory.images?.[0] ? (
                      <img
                        src={dormitory.images[0]}
                        alt=""
                        className="h-12 w-12 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-violet-50 text-xl">
                        🏠
                      </div>
                    )}

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700">
                      {i + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/dormitories/${dormitory.id}`}
                        className="block truncate text-sm font-semibold text-slate-800 transition hover:text-violet-700"
                      >
                        {dormitory.name || 'ไม่ระบุชื่อหอพัก'}
                      </Link>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {dormitory.dormType || 'หอพัก'}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-violet-700">
                        ⭐ {dormitory.ratingAverage ?? 0}
                      </p>

                      <p className="text-xs text-slate-400">
                        {dormitory.ratingCount ?? 0} คะแนน
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        {/* Newest Members */}
        <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
          <div className="border-b border-violet-100 bg-violet-50/60 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-xl">
                👥
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  สมาชิกใหม่ล่าสุด
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  รายชื่อสมาชิกที่สมัครเข้ามาล่าสุด
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {stats.newestMembers.length === 0 ? (
              <div className="py-10 text-center">
                <div className="text-3xl">👤</div>

                <p className="mt-3 text-sm text-slate-400">
                  ยังไม่มีข้อมูลสมาชิก
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-violet-50">
                {stats.newestMembers.map((member, i) => (
                  <li
                    key={member.id ?? i}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-500 text-sm font-bold text-white">
                        {member.displayName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {member.displayName || 'ไม่ระบุชื่อ'}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {member.email || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      {member.role === 'admin' && (
                        <span className="inline-block rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
                          Admin
                        </span>
                      )}

                      {member.createdAt && (
                        <p className="mt-1 text-xs text-slate-400">
                          {dateTH(member.createdAt)}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-violet-100 bg-violet-50/40 px-5 py-4">
            <Link
              to="/admin/members"
              className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900"
            >
              ดูสมาชิกทั้งหมด
              <span>→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
