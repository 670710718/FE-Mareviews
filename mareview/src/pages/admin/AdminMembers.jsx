
import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getAdminMembers, setMemberRole } from '../../api/backend';
import {
  ErrorBox,
  Loading,
  ConfirmBox,
  inputClass
} from '../../pages/admin/AdminStates';

const dateTH = iso =>
  new Date(iso).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

// รายชื่อสมาชิก + ปุ่มเลื่อน/ลดบทบาท
// ป้องกันไม่ให้ Admin เปลี่ยนบทบาทของบัญชีตัวเอง
function AdminMembers() {
  const { token, member: me } = useAuth();

  const [members, setMembers] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setStatus('loading');
      setError(null);

      try {
        const list = await getAdminMembers(token);

        if (!ignore) {
          setMembers(list);
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

  async function confirmRole() {
    if (!target) return;

    const nextRole = target.role === 'admin' ? 'member' : 'admin';

    setBusy(true);
    setActionError(null);

    try {
      const updated = await setMemberRole(target.id, nextRole, token);

      setMembers(current =>
        current.map(m => (m.id === updated.id ? updated : m))
      );

      setTarget(null);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const q = query.trim().toLowerCase();

  const shown = members.filter(m =>
    q === '' ||
    (m.displayName || '').toLowerCase().includes(q) ||
    (m.email || '').toLowerCase().includes(q)
  );

  const adminCount = members.filter(m => m.role === 'admin').length;

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-purple-600 p-6 text-white shadow-lg shadow-violet-200 md:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
              Mareview Administration
            </p>

            <h2 className="mt-2 text-2xl font-extrabold">
              จัดการสมาชิก
            </h2>

            <p className="mt-2 text-sm text-violet-100">
              ตรวจสอบข้อมูลสมาชิกและจัดการสิทธิ์การใช้งาน
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur-sm">
            👥
          </div>
        </div>
      </section>

      {/* Statistics */}
      {status === 'success' && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              สมาชิกทั้งหมด
            </p>

            <p className="mt-2 text-3xl font-extrabold text-violet-700">
              {members.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              บัญชีผู้ใช้งานทั้งหมด
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              ผู้ดูแลระบบ
            </p>

            <p className="mt-2 text-3xl font-extrabold text-purple-700">
              {adminCount}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Admin
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:col-span-1">
            <p className="text-sm text-slate-500">
              สมาชิกทั่วไป
            </p>

            <p className="mt-2 text-3xl font-extrabold text-slate-700">
              {members.length - adminCount}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Member
            </p>
          </div>
        </section>
      )}

      {/* Search */}
      <section className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-bold text-slate-800">
              รายชื่อสมาชิก
            </h3>

            {status === 'success' && (
              <p className="mt-1 text-xs text-slate-500">
                แสดง {shown.length} จากทั้งหมด {members.length} คน
              </p>
            )}
          </div>

          <div className="relative w-full md:w-80">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="ค้นหาชื่อหรืออีเมล..."
              className={
                inputClass +
                ' w-full rounded-xl border-violet-100 bg-violet-50/40 pl-10 focus:border-violet-500 focus:ring-violet-500'
              }
            />
          </div>
        </div>
      </section>

      {/* Action Error */}
      {actionError && (
        <div
          className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
          <span className="mr-2">⚠️</span>
          {actionError}
        </div>
      )}

      {/* Loading */}
      {status === 'loading' && <Loading />}

      {/* Error */}
      {status === 'error' && (
        <ErrorBox
          error={error}
          onRetry={() => setReloadKey(k => k + 1)}
        />
      )}

      {/* Members Table */}
      {status === 'success' && (
        <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
              <thead className="bg-violet-50/80 text-left text-xs font-bold uppercase tracking-wide text-violet-700">
                <tr>
                  <th className="px-5 py-4">
                    สมาชิก
                  </th>

                  <th className="px-5 py-4">
                    บทบาท
                  </th>

                  <th className="px-5 py-4">
                    สมัครเมื่อ
                  </th>

                  <th className="px-5 py-4 text-right">
                    จัดการ
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-violet-50">
                {shown.map(m => {
                  const isMe = m.id === me?.id;

                  return (
                    <tr
                      key={m.id}
                      className="transition hover:bg-violet-50/40"
                    >
                      {/* Member Info */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-500 text-sm font-bold text-white shadow-sm">
                            {m.displayName?.charAt(0)?.toUpperCase() || 'U'}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">
                              {m.displayName || 'ไม่ระบุชื่อ'}

                              {isMe && (
                                <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
                                  คุณ
                                </span>
                              )}
                            </p>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {m.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span
                          className={
                            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ' +
                            (m.role === 'admin'
                              ? 'bg-violet-100 text-violet-700'
                              : 'bg-slate-100 text-slate-600')
                          }
                        >
                          <span className={
                            'h-1.5 w-1.5 rounded-full ' +
                            (m.role === 'admin'
                              ? 'bg-violet-500'
                              : 'bg-slate-400')
                          } />

                          {m.role === 'admin' ? 'Admin' : 'Member'}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-5 py-4 text-slate-500">
                        {m.createdAt ? dateTH(m.createdAt) : '-'}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setActionError(null);
                            setTarget(m);
                          }}
                          disabled={isMe}
                          className={
                            'rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300 ' +
                            (m.role === 'admin'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              : 'bg-violet-50 text-violet-700 hover:bg-violet-100')
                          }
                        >
                          {m.role === 'admin'
                            ? 'ลดเป็น Member'
                            : 'เลื่อนเป็น Admin'}
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {shown.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-14 text-center"
                    >
                      <div className="text-3xl">🔍</div>

                      <p className="mt-3 font-semibold text-slate-600">
                        ไม่พบสมาชิก
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        ลองตรวจสอบชื่อหรืออีเมลที่ค้นหาอีกครั้ง
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirm Role Change */}
      <ConfirmBox
        open={Boolean(target)}
        busy={busy}
        title={
          target?.role === 'admin'
            ? `ลด ${target?.displayName} เป็น member ?`
            : `เลื่อน ${target?.displayName} เป็น admin ?`
        }
        confirmText="ยืนยัน"
        onConfirm={confirmRole}
        onCancel={() => {
          if (!busy) setTarget(null);
        }}
      >
        <p className="leading-7 text-slate-600">
          {target?.role === 'admin'
            ? 'สมาชิกคนนี้จะไม่สามารถเข้าถึงหน้าจัดการ Mareview ได้อีกหลังจากสิทธิ์ถูกเปลี่ยน'
            : 'สมาชิกคนนี้จะสามารถเข้าถึงหน้าจัดการ Mareview และจัดการข้อมูลสมาชิกได้'}
        </p>
      </ConfirmBox>
    </div>
  );
}

export default AdminMembers;
