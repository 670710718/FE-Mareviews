
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const linkClass = ({ isActive }) =>
  'relative whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ' +
  (isActive
    ? 'bg-violet-50 text-violet-700'
    : 'text-slate-600 hover:bg-violet-50 hover:text-violet-700');

function Navbar() {
  const { isLoggedIn, isAdmin, member, logout } = useAuth();

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100/80 bg-white/95 shadow-sm shadow-violet-100/30 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 md:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-xl text-white shadow-md shadow-violet-200 transition-transform duration-200 group-hover:scale-105">
            🏠
          </span>

          <span className="text-xl font-extrabold tracking-tight text-violet-800">
            Mareview
          </span>
        </Link>

        {/* Main Menu */}
        <div className="flex flex-wrap items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            หน้าแรก
          </NavLink>

          <NavLink to="/dormitories" className={linkClass}>
            หอพัก
          </NavLink>

          {isLoggedIn && (
            <NavLink to="/me/wishlist" className={linkClass}>
              หอพักที่บันทึกไว้
            </NavLink>
          )}

          <NavLink to="/about" className={linkClass}>
            เกี่ยวกับ
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              หลังบ้าน
            </NavLink>
          )}
        </div>

        {/* Account Menu */}
        <div className="ml-auto flex items-center gap-3 text-sm">
          {isLoggedIn ? (
            <>
              <div className="hidden items-center gap-2 rounded-full bg-violet-50 py-1.5 pl-1.5 pr-3 sm:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                  {member?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                </span>

                <span className="max-w-36 truncate font-medium text-violet-800">
                  {member?.displayName || 'สมาชิก'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="whitespace-nowrap rounded-xl px-3 py-2 font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
              >
                ออกจากระบบ
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="whitespace-nowrap rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-violet-200 transition duration-200 hover:-translate-y-0.5 hover:from-violet-700 hover:to-purple-700 hover:shadow-lg"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>

      </nav>
    </header>
  );
}

export default Navbar;
