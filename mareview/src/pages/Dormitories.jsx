
import { useEffect, useState } from 'react';
import DormitoryGrid from '../components/DormitoryGrid';
import { getDormitories } from '../api/backend';

function Dormitories() {
  const [query, setQuery] = useState('');
  const [dormType, setDormType] = useState('all');
  const [genderType, setGenderType] = useState('all');

  const [dormitories, setDormitories] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setStatus('loading');
      setError(null);

      try {
        const response = await getDormitories();

        const list = Array.isArray(response)
          ? response
          : response?.items ?? [];

        if (!ignore) {
          setDormitories(list);
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
  }, [reloadKey]);

  // รองรับ genderType ทั้ง String และ Object
  const getGenderValue = (dormitory) => {
    const value =
      dormitory.genderType ??
      dormitory.gender_type ??
      dormitory.gender?.name ??
      dormitory.gender?.typeName ??
      dormitory.gender?.type_name ??
      '';

    if (typeof value === 'object' && value !== null) {
      return (
        value.name ??
        value.typeName ??
        value.type_name ??
        value.label ??
        ''
      );
    }

    return String(value).trim();
  };

  // แปลงประเภทหอพักให้เป็นค่ามาตรฐาน
  const normalizeGender = (value) => {
    const gender = String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '');

    if (
      ['ชาย', 'หอชาย', 'male', 'men', 'man', 'm', '1'].includes(gender)
    ) {
      return 'male';
    }

    if (
      ['หญิง', 'หอหญิง', 'female', 'women', 'woman', 'f', '2'].includes(gender)
    ) {
      return 'female';
    }

    if (
      [
        'รวม',
        'หอรวม',
        'ชาย-หญิง',
        'หญิง-ชาย',
        'ชายหญิง',
        'หญิงชาย',
        'mixed',
        'co-ed',
        'coed',
        '3',
      ].includes(gender)
    ) {
      return 'mixed';
    }

    return '';
  };

  // สร้างตัวเลือกประเภทหอพักจากข้อมูลจริง
  const dormTypes = [
    ...new Set(
      dormitories
        .map((dormitory) => dormitory.dormType)
        .filter(Boolean)
    ),
  ];

  const q = query.trim().toLowerCase();

  // กรองรายการหอพัก
  const shown = dormitories.filter((dormitory) => {
    const name = String(dormitory.name ?? '').toLowerCase();
    const type = String(dormitory.dormType ?? '').toLowerCase();
    const genderValue = getGenderValue(dormitory);
    const gender = genderValue.toLowerCase();

    const matchesQuery =
      q === '' ||
      name.includes(q) ||
      type.includes(q) ||
      gender.includes(q);

    const matchesType =
      dormType === 'all' || dormitory.dormType === dormType;

    const normalizedGender = normalizeGender(genderValue);

    const matchesGender =
      genderType === 'all' || normalizedGender === genderType;

    return matchesQuery && matchesType && matchesGender;
  });

  const chipClass = (active) =>
    'rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ' +
    (active
      ? 'border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-200'
      : 'border-violet-100 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700');

  return (
    <div className="min-h-screen bg-violet-50/20">

      {/* Page Header */}
      <section className="border-b border-violet-100 bg-gradient-to-br from-violet-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                Explore Dormitories
              </span>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                ค้นหาหอพักที่ใช่
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500 md:text-base">
                เลือกชมข้อมูลหอพัก เปรียบเทียบราคา
                และค้นหาที่พักที่เหมาะกับความต้องการของคุณ
              </p>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-violet-100 bg-white px-5 py-3 shadow-sm md:self-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-xl">
                🏠
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  หอพักที่พบ
                </p>

                <p className="text-lg font-extrabold text-violet-700">
                  {status === 'success' ? shown.length : '—'}
                  <span className="ml-1 text-xs font-medium text-slate-400">
                    รายการ
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">

        <section className="mb-8 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm md:p-6">

          {/* Search */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-bold text-slate-800">
                ค้นหาหอพัก
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                ค้นหาจากชื่อ ประเภท หรือประเภทหอพัก
              </p>
            </div>

            <div className="relative w-full md:max-w-md">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-violet-400">
                ⌕
              </span>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาชื่อหรือประเภทหอพัก..."
                className="w-full rounded-xl border border-violet-100 bg-violet-50/40 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="ล้างคำค้นหา"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-violet-100 hover:text-violet-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Dormitory Gender Category Filter */}
          <div className="mt-6 border-t border-violet-50 pt-5">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-slate-700">
                ประเภทหอพัก
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                เลือกประเภทหอพักตามเพศที่เปิดรับ
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'ทั้งหมด' },
                { value: 'male', label: 'หอชาย' },
                { value: 'female', label: 'หอหญิง' },
                { value: 'mixed', label: 'หอรวม' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setGenderType(item.value)}
                  aria-pressed={genderType === item.value}
                  className={chipClass(genderType === item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dormitory Type Filter */}
          <div className="mt-6 border-t border-violet-50 pt-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700">
                ลักษณะหอพัก
              </span>

              <span className="text-xs text-slate-400">
                เลือกประเภทที่ต้องการ
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDormType('all')}
                className={chipClass(dormType === 'all')}
              >
                ทุกประเภท
              </button>

              {dormTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setDormType(type)}
                  className={chipClass(dormType === type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Active Search Summary */}
          {(query || dormType !== 'all' || genderType !== 'all') && (
            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-violet-50 pt-4">
              <span className="text-xs text-slate-400">
                กำลังกรอง:
              </span>

              {query && (
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
                  คำค้น: {query}
                </span>
              )}

              {genderType !== 'all' && (
                <span className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700">
                  ประเภท: {
                    genderType === 'male'
                      ? 'หอชาย'
                      : genderType === 'female'
                        ? 'หอหญิง'
                        : 'หอรวม'
                  }
                </span>
              )}

              {dormType !== 'all' && (
                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                  {dormType}
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setDormType('all');
                  setGenderType('all');
                }}
                className="ml-auto text-xs font-semibold text-rose-500 transition hover:text-rose-700"
              >
                ล้างตัวกรอง
              </button>
            </div>
          )}
        </section>

        {/* Results */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              รายการหอพัก
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              {status === 'success' &&
                `แสดง ${shown.length} จาก ${dormitories.length} หอพัก`}
              {status === 'loading' && 'กำลังโหลดข้อมูลหอพัก...'}
              {status === 'error' && 'ไม่สามารถโหลดข้อมูลหอพักได้'}
            </p>
          </div>
        </div>

        <DormitoryGrid
          dormitories={shown}
          status={status}
          error={error}
          onRetry={() => setReloadKey((key) => key + 1)}
        />

      </main>
    </div>
  );
}

export default Dormitories;
