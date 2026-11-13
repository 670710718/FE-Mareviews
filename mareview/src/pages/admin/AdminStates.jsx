
 // ชิ้นส่วน UI ที่ทุกหน้าหลังบ้านใช้ซ้ำ: ErrorBox, Loading, Buttons และ ConfirmBox

export function ErrorBox({ error, onRetry }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
        ⚠️
      </div>

      <p className="mt-4 font-bold text-slate-800">
        โหลดข้อมูลไม่สำเร็จ
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {error?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
        >
          ลองใหม่อีกครั้ง
        </button>
      )}
    </div>
  );
}

export function Loading({ text = 'กำลังโหลด...' }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-violet-100 bg-white px-6 py-12 shadow-sm">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />

      <p className="mt-4 text-sm font-medium text-violet-600">
        {text}
      </p>
    </div>
  );
}

export const btnPrimary =
  'inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none';

export const btnGhost =
  'inline-flex items-center justify-center rounded-xl border border-violet-100 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:text-slate-300';

export const btnDanger =
  'inline-flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-300';

export const inputClass =
  'w-full rounded-xl border border-violet-100 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:bg-slate-50';

// กล่องยืนยันก่อนทำสิ่งที่ย้อนกลับไม่ได้ เช่น ลบข้อมูลหรือเปลี่ยนสิทธิ์
export function ConfirmBox({
  open,
  title,
  children,
  confirmText = 'ยืนยัน',
  busy,
  onConfirm,
  onCancel
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-confirm-title"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-2xl shadow-violet-950/20">

        {/* Modal Header */}
        <div className="border-b border-violet-50 bg-violet-50/70 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-xl">
              ⚠️
            </div>

            <div className="min-w-0">
              <h2
                id="admin-confirm-title"
                className="font-bold text-slate-800"
              >
                {title}
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                กรุณาตรวจสอบก่อนยืนยันการดำเนินการ
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-5 text-sm leading-relaxed text-slate-600">
          {children}
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col-reverse gap-2 border-t border-violet-50 bg-slate-50/70 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className={btnGhost}
          >
            ยกเลิก
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={btnDanger}
          >
            {busy ? 'กำลังทำ...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
