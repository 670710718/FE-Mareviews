
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Register() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  const { register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      await register(email, password, displayName);
      navigate('/');
    } catch (err) {
      setError(err.message || 'สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่');
      setStatus('typing');
    }
  }

  const inputClass =
    'w-full rounded-xl border border-violet-100 bg-violet-50/30 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-violet-200 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:bg-slate-50';

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Register Card */}
        <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-xl shadow-violet-100/60">

          {/* Card Header */}
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-purple-600 px-8 py-9 text-center">
            <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-white/10" />

            <div className="relative">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-4xl shadow-lg backdrop-blur-sm">
                💜
              </div>

              <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-white">
                เข้าร่วม Mareview
              </h1>

              <p className="mt-2 text-sm leading-6 text-violet-100">
                สร้างบัญชีเพื่อค้นหา รีวิว และแบ่งปันประสบการณ์เกี่ยวกับหอพัก
              </p>
            </div>
          </div>

          {/* Register Form */}
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                สมัครสมาชิก
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                กรอกข้อมูลด้านล่างเพื่อสร้างบัญชีของคุณ
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Display Name */}
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  ชื่อที่แสดง
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-violet-400">
                    👤
                  </span>

                  <input
                    id="register-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="ชื่อที่ต้องการให้แสดง"
                    autoComplete="name"
                    required
                    disabled={status === 'submitting'}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  อีเมล
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-violet-400">
                    ✉
                  </span>

                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    autoComplete="email"
                    required
                    disabled={status === 'submitting'}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  รหัสผ่าน
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-violet-400">
                    🔒
                  </span>

                  <input
                    id="register-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="รหัสผ่าน (8 ตัวขึ้นไป)"
                    autoComplete="new-password"
                    required
                    minLength={4}
                    disabled={status === 'submitting'}
                    className={inputClass}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600"
                >
                  <span className="mr-2">⚠</span>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-200 transition duration-200 hover:-translate-y-0.5 hover:from-violet-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    กำลังสมัครสมาชิก...
                  </>
                ) : (
                  <>
                    สร้างบัญชี Mareview
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-7 border-t border-violet-50 pt-6 text-center">
              <p className="text-sm text-slate-500">
                มีบัญชี Mareview อยู่แล้ว?
              </p>

              <Link
                to="/login"
                className="mt-2 inline-flex items-center gap-1 font-semibold text-violet-600 transition hover:text-violet-800 hover:underline"
              >
                เข้าสู่ระบบ
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Mareview — ค้นหาหอพักที่ใช่ และแบ่งปันประสบการณ์ร่วมกัน
        </p>
      </div>
    </div>
  );
}

export default Register;
