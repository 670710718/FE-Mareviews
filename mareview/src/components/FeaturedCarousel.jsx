
import { useEffect, useState } from 'react';
import DormitoryCard from './DormitoryCard';

const PER_PAGE = 4;

// แถบหอพักแนะนำแบบเลื่อนซ้ายขวา
// รับ dormitories ที่สลับลำดับมาแล้วจากแม่
function FeaturedCarousel({ dormitories }) {
  const [page, setPage] = useState(0);
  const total = Math.ceil(dormitories.length / PER_PAGE);

  // ป้องกันหน้า Carousel เกินจำนวนหน้าหลังข้อมูลเปลี่ยน
  useEffect(() => {
    setPage((current) => Math.min(current, Math.max(total - 1, 0)));
  }, [total]);

  if (dormitories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 py-12 text-center">
        <div className="text-4xl">🏡</div>
        <p className="mt-3 text-sm font-medium text-slate-500">
          ยังไม่มีหอพักแนะนำ
        </p>
      </div>
    );
  }

  const shown = dormitories.slice(
    page * PER_PAGE,
    page * PER_PAGE + PER_PAGE
  );

  const prev = () => setPage((p) => (p - 1 + total) % total);
  const next = () => setPage((p) => (p + 1) % total);

  const canNavigate = total > 1;

  return (
    <div>
      {/* Dormitory Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {shown.map((d) => (
          <DormitoryCard key={d.id} dormitory={d} />
        ))}
      </div>

      {/* Carousel Controls */}
      <div className="mt-8 flex items-center justify-center gap-5">

        <button
          type="button"
          onClick={prev}
          disabled={!canNavigate}
          aria-label="หอพักชุดก่อนหน้า"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-200 bg-white text-lg font-semibold text-violet-700 shadow-sm transition duration-200 hover:border-violet-500 hover:bg-violet-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30"
        >
          ←
        </button>

        <div className="min-w-24 text-center">
          <p className="text-sm font-semibold text-slate-700">
            ชุดที่ <span className="text-violet-700">{page + 1}</span>
            {' '}จาก {total}
          </p>

          {/* Page Indicators */}
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {Array.from({ length: total }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setPage(index)}
                aria-label={`ไปยังชุดที่ ${index + 1}`}
                aria-current={page === index ? 'page' : undefined}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  page === index
                    ? 'w-6 bg-violet-600'
                    : 'w-1.5 bg-violet-200 hover:bg-violet-400'
                }`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          disabled={!canNavigate}
          aria-label="หอพักชุดถัดไป"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-200 bg-white text-lg font-semibold text-violet-700 shadow-sm transition duration-200 hover:border-violet-500 hover:bg-violet-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30"
        >
          →
        </button>

      </div>
    </div>
  );
}

export default FeaturedCarousel;
