
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDormitories } from '../../api/backend';
import {
  ErrorBox,
  Loading,
  btnPrimary,
  inputClass
} from './AdminStates';

// แปลงข้อมูลจาก Backend ให้เป็น Array
function extractDormitories(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.dormitories)) {
    return response.dormitories;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.items)) {
    return response.data.items;
  }

  if (Array.isArray(response?.data?.dormitories)) {
    return response.data.dormitories;
  }

  return [];
}

// แปลงข้อมูลหอพักให้ใช้ชื่อ Field สม่ำเสมอ
function normalizeDormitory(dormitory) {
  return {
    ...dormitory,
    id: dormitory.id ?? dormitory.ID,
    name: dormitory.name ?? dormitory.Name ?? '',
    minPrice: dormitory.minPrice ?? dormitory.MinPrice,
    maxPrice: dormitory.maxPrice ?? dormitory.MaxPrice,
    dormType: dormitory.dormType ?? dormitory.DormType ?? '',
    genderType: dormitory.genderType ?? dormitory.GenderType ?? '',
    ratingAverage:
      dormitory.ratingAverage ?? dormitory.RatingAverage ?? 0,
    ratingCount:
      dormitory.ratingCount ?? dormitory.RatingCount ?? 0,
    images: Array.isArray(dormitory.images)
      ? dormitory.images
      : Array.isArray(dormitory.Images)
        ? dormitory.Images
        : []
  };
}

// ตารางหอพักทั้งหมด
function AdminDormitories() {
  const [dormitories, setDormitories] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setStatus('loading');
      setError(null);

      try {
        const response = await getDormitories();

        console.log('Dormitories API response:', response);

        const list = extractDormitories(response)
          .map(normalizeDormitory);

        if (!ignore) {
          setDormitories(list);
          setStatus('success');
        }
      } catch (err) {
        console.error('Load dormitories error:', err);

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
  }, [reloadKey]);

  // ค้นหาหอพัก
  const q = query.trim().toLowerCase();

  const shown = dormitories.filter(d => {
    const name = String(d.name ?? '').toLowerCase();
    const dormType = String(d.dormType ?? '').toLowerCase();
    const genderType = String(d.genderType ?? '').toLowerCase();
    const id = String(d.id ?? '');

    return (
      q === '' ||
      name.includes(q) ||
      dormType.includes(q) ||
      genderType.includes(q) ||
      id === q
    );
  });

  // จัดรูปแบบราคา
  function formatPrice(price) {
    if (price == null || price === '') return '-';

    const number = Number(price);

    if (!Number.isFinite(number)) return '-';

    return number.toLocaleString('th-TH');
  }

  function formatPriceRange(dormitory) {
    const min = dormitory.minPrice;
    const max = dormitory.maxPrice;

    if (min == null && max == null) return '-';

    if (min != null && max != null) {
      if (Number(min) === Number(max)) {
        return `${formatPrice(min)} บาท`;
      }

      return `${formatPrice(min)} - ${formatPrice(max)} บาท`;
    }

    if (min != null) {
      return `เริ่ม ${formatPrice(min)} บาท`;
    }

    return `สูงสุด ${formatPrice(max)} บาท`;
  }

  // นับประเภทหอพัก
  const dormTypeCount = new Set(
    dormitories
      .map(d => d.dormType)
      .filter(Boolean)
  ).size;

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-purple-600 p-6 text-white shadow-lg shadow-violet-200 md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200">
              Mareview Administration
            </p>

            <h2 className="mt-2 text-2xl font-extrabold">
              จัดการหอพัก
            </h2>

            <p className="mt-2 text-sm text-violet-100">
              เพิ่ม แก้ไข และตรวจสอบข้อมูลหอพักทั้งหมดในระบบ
            </p>
          </div>

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur-sm">
            🏠
          </div>
        </div>
      </section>

      {/* Statistics */}
      {status === 'success' && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              หอพักทั้งหมด
            </p>

            <p className="mt-2 text-3xl font-extrabold text-violet-700">
              {dormitories.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              รายการหอพักในระบบ
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              หอพักที่ค้นพบ
            </p>

            <p className="mt-2 text-3xl font-extrabold text-purple-700">
              {shown.length}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              ตามคำค้นหาปัจจุบัน
            </p>
          </div>

          <div className="col-span-2 flex items-center justify-between rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:col-span-1">
            <div>
              <p className="text-sm text-slate-500">
                ประเภทหอพัก
              </p>

              <p className="mt-2 text-3xl font-extrabold text-slate-800">
                {dormTypeCount}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                ประเภทที่มีในระบบ
              </p>
            </div>

            <span className="text-3xl">📋</span>
          </div>
        </section>
      )}

      {/* Search and Actions */}
      <section className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-bold text-slate-800">
              รายการหอพัก
            </h3>

            {status === 'success' && (
              <p className="mt-1 text-xs text-slate-500">
                แสดง {shown.length} จาก {dormitories.length} หอพัก
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative sm:w-72">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </span>

              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="ค้นชื่อหอพัก หรือพิมพ์เลข ID"
                className={
                  inputClass +
                  ' w-full rounded-xl border-violet-100 bg-violet-50/40 pl-10 focus:border-violet-500 focus:ring-violet-500'
                }
              />
            </div>

            <button
              type="button"
              onClick={() => setReloadKey(key => key + 1)}
              className="rounded-xl border border-violet-200 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              ↻ รีเฟรช
            </button>

            <Link
              to="/admin/dormitories/new"
              className={
                btnPrimary +
                ' inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-violet-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700'
              }
            >
              <span className="mr-2">＋</span>
              เพิ่มหอพัก
            </Link>
          </div>
        </div>
      </section>

      {/* Loading */}
      {status === 'loading' && <Loading />}

      {/* Error */}
      {status === 'error' && (
        <ErrorBox
          error={error}
          onRetry={() => setReloadKey(key => key + 1)}
        />
      )}

      {/* Dormitories Table */}
      {status === 'success' && (
        <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-sm">
              <thead className="bg-violet-50/80 text-left text-xs font-bold uppercase tracking-wide text-violet-700">
                <tr>
                  <th className="px-5 py-4">หอพัก</th>
                  <th className="px-5 py-4">ประเภท</th>
                  <th className="px-5 py-4">ผู้พัก</th>
                  <th className="px-5 py-4">ราคา/เดือน</th>
                  <th className="px-5 py-4">คะแนน</th>
                  <th className="px-5 py-4 text-right">จัดการ</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-violet-50">
                {shown.map((d, index) => {
                  const image = d.images?.[0];

                  return (
                    <tr
                      key={d.id ?? index}
                      className="transition hover:bg-violet-50/40"
                    >
                      {/* Dormitory */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {image ? (
                            <img
                              src={image}
                              alt={d.name || 'รูปหอพัก'}
                              className="h-12 w-16 shrink-0 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="grid h-12 w-16 shrink-0 place-items-center rounded-xl bg-violet-50 text-xl">
                              🏠
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="truncate font-semibold text-slate-800">
                              {d.name || '(ไม่มีชื่อหอพัก)'}
                            </p>

                            <p className="mt-1 truncate text-xs text-slate-400">
                              ID: #{d.id ?? '-'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Dorm Type */}
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                          {d.dormType || '-'}
                        </span>
                      </td>

                      {/* Gender Type */}
                      <td className="px-5 py-4 text-slate-600">
                        {d.genderType || '-'}
                      </td>

                      {/* Price */}
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700">
                        {formatPriceRange(d)}
                      </td>

                      {/* Rating */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div>
                          <p className="font-semibold text-violet-700">
                            ⭐ {Number(d.ratingAverage || 0).toFixed(1)} / 10
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {d.ratingCount} คะแนน
                          </p>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin/dormitories/${d.id}`}
                          className="inline-flex items-center justify-center rounded-lg bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
                        >
                          ✏️ แก้ไข
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {shown.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center"
                    >
                      <div className="text-3xl">🔍</div>

                      <p className="mt-3 font-semibold text-slate-600">
                        {dormitories.length === 0
                          ? 'ยังไม่มีข้อมูลหอพักในระบบ'
                          : 'ไม่พบหอพักที่ค้นหา'}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        ลองเปลี่ยนคำค้นหาหรือค้นหาด้วย ID อีกครั้ง
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDormitories;
