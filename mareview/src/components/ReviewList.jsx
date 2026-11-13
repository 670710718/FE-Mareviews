
 // รายการรีวิวหอพัก รับ items ตามสัญญา GET /api/dormitories/{id}/reviews
function ReviewList({ items = [] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 px-5 py-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-3xl">
          💬
        </div>

        <h3 className="mt-4 font-bold text-slate-700">
          ยังไม่มีรีวิว
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          เป็นคนแรกที่แบ่งปันประสบการณ์เกี่ยวกับหอพักนี้เลย
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((r) => (
        <li
          key={r.id}
          className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition duration-200 hover:border-violet-200 hover:shadow-md"
        >
          {/* Reviewer Information */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-500 text-lg font-bold text-white shadow-sm shadow-violet-200">
                {r.member?.displayName?.charAt(0)?.toUpperCase() || 'M'}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">
                  {r.member?.displayName || 'สมาชิก Mareview'}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  สมาชิก Mareview
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {r.rating != null && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                  <span className="text-violet-500">คะแนน</span>
                  <span>{r.rating}/10</span>
                </span>
              )}

              <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-500">
                {r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'ไม่ระบุวันที่'}
              </span>
            </div>
          </div>

          {/* Review Content */}
          <div className="mt-4 border-t border-violet-50 pt-4">
            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
              {r.text}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ReviewList;
