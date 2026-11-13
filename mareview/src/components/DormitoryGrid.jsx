
import DormitoryCard from './DormitoryCard';

// วาดรายการหอพักตามสถานะ 3 แบบ: loading | error | success
// (สำเร็จแต่ว่างเปล่าก็เป็น success)
function DormitoryGrid({ dormitories, status, error, onRetry }) {
  // Loading State
  if (status === 'loading') {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm"
          >
            <div className="aspect-[2/3] bg-gradient-to-br from-violet-100 to-purple-50" />

            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 rounded-full bg-violet-100" />
              <div className="h-3 w-1/2 rounded-full bg-violet-50" />
              <div className="mt-4 h-12 rounded-xl bg-violet-50" />
              <div className="h-3 w-2/3 rounded-full bg-violet-50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (status === 'error') {
    return (
      <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white px-6 py-14 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-3xl">
          !
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-800">
          โหลดข้อมูลไม่สำเร็จ
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          {error?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง'}
        </p>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-lg"
          >
            ↻ ลองโหลดข้อมูลอีกครั้ง
          </button>
        )}
      </div>
    );
  }

  // Empty State
  if (!dormitories || dormitories.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-violet-200 bg-gradient-to-br from-violet-50/70 to-white px-6 py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-4xl">
          🏡
        </div>

        <h3 className="mt-5 text-lg font-bold text-slate-800">
          ไม่พบหอพักที่ค้นหา
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          ลองเปลี่ยนคำค้นหาหรือเลือกประเภทหอพักอื่นดูนะครับ
        </p>
      </div>
    );
  }

  // Success State
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {dormitories.map((d) => (
        <DormitoryCard key={d.id} dormitory={d} />
      ))}
    </div>
  );
}

export default DormitoryGrid;
  