
import { NavLink, Outlet } from 'react-router-dom';

const tabClass = ({ isActive }) =>
  'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ' +
  (isActive
    ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
    : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700');

function AdminLayout() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">

      {/* Admin Header */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-purple-600 p-6 text-white shadow-lg shadow-violet-200 md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
              Mareview Administration
            </p>

            <h1 className="mt-2 text-2xl font-extrabold md:text-3xl">
              หลังบ้าน Mareview
            </h1>

            <p className="mt-2 text-sm text-violet-100">
              จัดการข้อมูลหอพัก สมาชิก และภาพรวมของระบบ
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur-sm">
            ⚙️
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="mb-6 rounded-2xl border border-violet-100 bg-white p-3 shadow-sm">
        <nav className="flex flex-wrap gap-2">
          <NavLink to="/admin" end className={tabClass}>
            <span>📊</span>
            ภาพรวม
          </NavLink>

          <NavLink to="/admin/dormitories" className={tabClass}>
            <span>🏠</span>
            หอพัก
          </NavLink>

          <NavLink to="/admin/members" className={tabClass}>
            <span>👥</span>
            สมาชิก
          </NavLink>
          <NavLink to="/admin/reviews" className={tabClass}>
            <span>💬</span>
            รีวิว
          </NavLink>
        </nav>
      </div>

      {/* Page Content */}
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
