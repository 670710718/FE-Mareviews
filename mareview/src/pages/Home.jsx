
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FeaturedCarousel from '../components/FeaturedCarousel';
import { getDormitories } from '../api/backend';

// ขั้นตอนการพัฒนาโปรเจกต์ Mareview
const STEPS = [
  {
    n: 1,
    file: 'src/api/backend.js',
    what: 'เชื่อมต่อ API กับ Mareview Backend ด้วย fetch',
  },
  {
    n: 2,
    file: 'src/pages/Dormitories.jsx',
    what: 'โหลดรายการหอพักและค้นหาหอพักจาก API',
  },
  {
    n: 3,
    file: 'src/pages/DormitoryDetail.jsx',
    what: 'โหลดรายละเอียดหอพักและรูปภาพตาม ID',
  },
  {
    n: 4,
    file: 'src/components/ReviewForm.jsx',
    what: 'ส่งรีวิวและคะแนนหอพักผ่าน API',
  },
  {
    n: 5,
    file: 'src/components/DormitoryActions.jsx',
    what: 'จัดการคะแนนและรายการหอพักที่บันทึกไว้',
  },
  {
    n: 6,
    file: 'src/pages/admin/',
    what: 'จัดการข้อมูลหอพักและสมาชิกผ่านหน้าผู้ดูแลระบบ',
  },
];

// สลับลำดับแบบสุ่มบนสำเนา ไม่แก้ไข array ต้นฉบับ
function shuffle(list) {
  const copy = [...list];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function Home() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  // โหลดรายการหอพักจาก Backend แล้วสุ่มหอพักแนะนำ
  useEffect(() => {
    let ignore = false;

    async function loadDormitories() {
      try {
        setLoading(true);

        const response = await getDormitories();

        // รองรับทั้ง Array และ Response รูปแบบ { items: [...] }
        const list = Array.isArray(response)
          ? response
          : response?.items ?? [];

        if (!ignore) {
          setPicks(shuffle(list));
        }
      } catch (error) {
        console.error('Failed to load featured dormitories:', error);

        if (!ignore) {
          setPicks([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDormitories();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="overflow-hidden">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-purple-100">

        {/* Decorative Background */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-2 lg:px-8">

          {/* Hero Text */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              <span className="text-xs font-semibold tracking-wide text-violet-700">
                MAREVIEW · DORMITORY REVIEW
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              หาหอพักที่ใช่
              <br />
              <span className="bg-gradient-to-r from-violet-700 to-purple-500 bg-clip-text text-transparent">
                ใช้ชีวิตในแบบคุณ
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 md:text-lg">
              ค้นพบหอพักที่เหมาะกับคุณ พร้อมข้อมูลราคา
              รายละเอียดที่พัก รีวิว และคะแนนจากผู้ใช้งานจริง
              ช่วยให้การเลือกที่พักเป็นเรื่องง่ายขึ้น
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/dormitories"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                ค้นหาหอพัก
                <span>→</span>
              </Link>

              <Link
                to="/about"
                className="rounded-xl border border-violet-200 bg-white px-6 py-3.5 text-sm font-semibold text-violet-700 transition hover:border-violet-400 hover:bg-violet-50"
              >
                เกี่ยวกับ Mareview
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 border-t border-violet-100 pt-6">
              <div>
                <p className="text-xl font-extrabold text-violet-800">
                  Review
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  รีวิวจากผู้ใช้งาน
                </p>
              </div>

              <div>
                <p className="text-xl font-extrabold text-violet-800">
                  Rating
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  คะแนนประกอบการตัดสินใจ
                </p>
              </div>

              <div>
                <p className="text-xl font-extrabold text-violet-800">
                  Dormitory
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  ข้อมูลหอพักในที่เดียว
                </p>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-5 rounded-[2.5rem] bg-gradient-to-br from-violet-300 to-purple-400 opacity-30 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white bg-white/80 p-4 shadow-2xl shadow-violet-200/60 backdrop-blur-sm md:p-6">

              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 p-8 text-white md:p-10">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                    FIND YOUR PLACE
                  </span>
                  <span className="text-2xl">✦</span>
                </div>

                <div className="py-10 text-center">
                  <div className="text-7xl md:text-8xl">
                    🏡
                  </div>

                  <h2 className="mt-6 text-2xl font-bold md:text-3xl">
                    Your Perfect Dorm
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-purple-100">
                    ค้นหา เปรียบเทียบ และเลือกที่พัก
                    ที่เหมาะกับไลฟ์สไตล์ของคุณ
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/20 pt-5">
                  <span className="text-xs text-purple-100">
                    Discover your new home
                  </span>
                  <span className="text-xl">💜</span>
                </div>
              </div>

              {/* Floating Card */}
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                  ⭐
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    รีวิวและให้คะแนน
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    เลือกที่พักได้อย่างมั่นใจ
                  </p>
                </div>

                <span className="ml-auto text-violet-500">
                  ✦
                </span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Featured Dormitories */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
              Featured Dormitories
            </span>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              หอพักแนะนำ
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              ค้นพบหอพักที่น่าสนใจจากข้อมูลใน Mareview
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPicks((current) => shuffle(current))}
            disabled={picks.length < 2}
            className="rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↻ สุ่มใหม่
          </button>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-2xl border border-violet-100 bg-white"
              >
                <div className="aspect-[4/3] bg-violet-100" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-violet-100" />
                  <div className="h-3 w-1/2 rounded bg-violet-50" />
                  <div className="h-3 w-full rounded bg-violet-50" />
                </div>
              </div>
            ))}
          </div>
        ) : picks.length > 0 ? (
          <FeaturedCarousel dormitories={picks} />
        ) : (
          <div className="rounded-3xl border border-dashed border-violet-200 bg-violet-50/50 px-6 py-16 text-center">
            <div className="text-5xl">🏡</div>

            <p className="mt-4 font-semibold text-slate-700">
              ยังไม่มีข้อมูลหอพักแนะนำ
            </p>

            <p className="mt-2 text-sm text-slate-500">
              ลองเข้าชมรายการหอพักทั้งหมดได้ที่นี่
            </p>

            <Link
              to="/dormitories"
              className="mt-5 inline-flex rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              ดูหอพักทั้งหมด
            </Link>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/dormitories"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-purple-600"
          >
            ดูหอพักทั้งหมด
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Why Mareview */}
      <section className="bg-violet-50/70 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">

          <div className="mx-auto mb-10 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
              Why Mareview
            </span>

            <h2 className="mt-3 text-2xl font-extrabold text-slate-900 md:text-3xl">
              ทำไมต้องเลือก Mareview?
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              รวมสิ่งที่จำเป็นสำหรับการค้นหาที่พัก
              เพื่อช่วยให้คุณตัดสินใจได้ง่ายขึ้น
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            {[
              {
                icon: '🔎',
                title: 'ค้นหาง่าย',
                description:
                  'ค้นหาหอพักและเลือกดูข้อมูลที่ตรงกับความต้องการ',
              },
              {
                icon: '⭐',
                title: 'รีวิวและคะแนน',
                description:
                  'อ่านประสบการณ์และคะแนนจากสมาชิกเพื่อประกอบการตัดสินใจ',
              },
              {
                icon: '💜',
                title: 'บันทึกหอพัก',
                description:
                  'เก็บหอพักที่สนใจไว้ในรายการส่วนตัวเพื่อกลับมาดูภายหลัง',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-violet-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl transition group-hover:bg-violet-100">
                  {item.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-800">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {item.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Project Roadmap */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">

        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
            Project Overview
          </span>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 md:text-3xl">
            เกี่ยวกับการพัฒนา Mareview
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            ส่วนประกอบหลักของเว็บไซต์และการเชื่อมต่อกับ Backend
          </p>
        </div>

        <ol className="grid gap-4 md:grid-cols-2">
          {STEPS.map((step) => (
            <li
              key={step.n}
              className="flex gap-4 rounded-2xl border border-violet-100 bg-white p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-sm font-bold text-white shadow-md shadow-violet-200">
                {String(step.n).padStart(2, '0')}
              </span>

              <div className="min-w-0">
                <p className="text-sm font-semibold leading-relaxed text-slate-800">
                  {step.what}
                </p>

                <code className="mt-2 block break-all text-xs text-violet-500">
                  {step.file}
                </code>
              </div>
            </li>
          ))}
        </ol>

      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600 px-6 py-12 text-center text-white shadow-xl shadow-violet-200 md:px-12">

          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border-[30px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-28 -left-10 h-64 w-64 rounded-full border-[30px] border-white/10" />

          <div className="relative">
            <h2 className="text-2xl font-extrabold md:text-3xl">
              พร้อมค้นหาหอพักที่ใช่แล้วหรือยัง?
            </h2>

            <p className="mt-3 text-sm leading-7 text-purple-100">
              เริ่มต้นค้นหาและเปรียบเทียบหอพักที่เหมาะกับคุณได้เลย
            </p>

            <Link
              to="/dormitories"
              className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-bold text-violet-700 shadow-lg transition hover:-translate-y-1 hover:bg-violet-50"
            >
              เริ่มค้นหาหอพัก →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;
