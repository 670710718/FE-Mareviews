
import { Link } from 'react-router-dom';

// การ์ดหอพัก 1 ใบ รับ object รูปร่างเดียวกับ API:
// { id, name, minPrice, maxPrice, dormType, genderType, ratingAverage, ratingCount, images }
function DormitoryCard({ dormitory }) {
  const image = dormitory.images?.[0];

  const formatPrice = (price) =>
    Number(price).toLocaleString('th-TH');

  return (
    <Link
      to={`/dormitories/${dormitory.id}`}
      className="group block overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100"
    >
      {/* Dormitory Image */}
      <div className="relative overflow-hidden bg-violet-50">
        {image ? (
          <img
            src={image}
            alt={`รูปภาพ ${dormitory.name}`}
            loading="lazy"
            className="aspect-[2/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid aspect-[2/3] w-full place-items-center bg-gradient-to-br from-violet-50 to-purple-100">
            <div className="text-center">
              <span className="text-5xl">🏠</span>
              <p className="mt-2 text-xs font-medium text-violet-400">
                No Image
              </p>
            </div>
          </div>
        )}

        {/* Image Overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Dormitory Type Badge */}
        {dormitory.dormType && (
          <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-white/90 px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur-sm">
            {dormitory.dormType}
          </span>
        )}
      </div>

      {/* Dormitory Information */}
      <div className="p-4">
        <h3
          className="truncate text-base font-bold text-slate-800 transition-colors group-hover:text-violet-700"
          title={dormitory.name}
        >
          {dormitory.name}
        </h3>

        {/* Gender Type */}
        {dormitory.genderType && (
          <p className="mt-1 truncate text-xs text-slate-500">
            <span className="mr-1">♙</span>
            {dormitory.genderType}
          </p>
        )}

        {/* Price */}
        <div className="mt-4 rounded-xl bg-violet-50/80 px-3 py-2.5">
          <p className="text-[11px] font-medium text-violet-500">
            ราคาเริ่มต้น
          </p>

          <p className="mt-0.5 text-sm font-bold text-violet-800">
            {formatPrice(dormitory.minPrice)}
            {' - '}
            {formatPrice(dormitory.maxPrice)}
            <span className="ml-1 text-xs font-medium text-violet-500">
              บาท
            </span>
          </p>
        </div>

        {/* Rating */}
        <div className="mt-3 flex min-h-5 items-center justify-between gap-2">
          <p className="text-xs text-slate-400">
            คะแนนจากผู้ใช้งาน
          </p>

          <p className="shrink-0 text-xs font-semibold text-amber-600">
            {dormitory.ratingAverage != null ? (
              <>
                ⭐ {dormitory.ratingAverage} / 10
              </>
            ) : (
              <span className="font-normal text-slate-400">
                ยังไม่มีคะแนน
              </span>
            )}
          </p>
        </div>

        {dormitory.ratingCount != null && (
          <p className="mt-1 text-right text-[11px] text-slate-400">
            {dormitory.ratingCount.toLocaleString('th-TH')} คะแนน
          </p>
        )}
      </div>
    </Link>
  );
}

export default DormitoryCard;
