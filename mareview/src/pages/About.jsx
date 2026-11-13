
function About() {
  return (
    <div className="min-h-screen bg-violet-50/30">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-violet-100 bg-gradient-to-br from-violet-100 via-white to-purple-50">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center md:px-6 md:py-20">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 text-3xl text-white shadow-lg shadow-violet-200">
            🏠
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-violet-600">
            About Our Project
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            เกี่ยวกับ <span className="text-violet-700">Mareview</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
            เว็บไซต์สำหรับค้นหา รีวิว และให้คะแนนหอพัก
            เพื่อช่วยให้นักศึกษาตัดสินใจเลือกที่พักได้ง่ายขึ้น
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-12 md:px-6">

        {/* Project Introduction */}
        <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
              ✨
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                Introduction
              </p>
              <h2 className="text-xl font-bold text-slate-900">
                จุดประสงค์ของ Mareview
              </h2>
            </div>
          </div>

          <p className="mt-5 leading-8 text-slate-600">
            Mareview เป็นเว็บไซต์สำหรับค้นหา รีวิว และให้คะแนนหอพัก
            เพื่อช่วยให้นักศึกษาสามารถค้นหาข้อมูลหอพักและอ่านประสบการณ์
            จากผู้ที่เคยเข้าพักได้สะดวกยิ่งขึ้น
          </p>
        </section>

        {/* Project Details */}
        <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-xl">
              💻
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                Development
              </p>
              <h2 className="text-xl font-bold text-slate-900">
                รายละเอียดโครงงาน
              </h2>
            </div>
          </div>

          <p className="mt-5 leading-8 text-slate-600">
            โปรเจกต์นี้เป็นส่วนหนึ่งของรายวิชา 520 341 Client Side Web
            Programming ใช้เรียนรู้การพัฒนาเว็บไซต์ด้วย React
            การเรียก API ด้วย fetch การจัดการสถานะ loading / error / success
            และการเชื่อมต่อกับ Backend ที่พัฒนาด้วย Go
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-violet-50 p-4">
              <p className="text-xs font-semibold text-violet-500">
                FRONTEND
              </p>
              <p className="mt-1 font-bold text-slate-800">
                React
              </p>
              <p className="mt-1 text-sm text-slate-500">
                พัฒนาส่วนติดต่อผู้ใช้งาน
              </p>
            </div>

            <div className="rounded-2xl bg-purple-50 p-4">
              <p className="text-xs font-semibold text-purple-500">
                BACKEND
              </p>
              <p className="mt-1 font-bold text-slate-800">
                Go
              </p>
              <p className="mt-1 text-sm text-slate-500">
                จัดการ API และข้อมูลของระบบ
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="rounded-3xl border border-violet-100 bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
              👥
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                Our Team
              </p>
              <h2 className="text-xl font-bold text-slate-900">
                ทีมผู้พัฒนา
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-500">
            สมาชิกผู้ร่วมพัฒนาเว็บไซต์ Mareview
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl border border-violet-100 bg-violet-50/50 p-4 transition hover:border-violet-300 hover:shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-500 text-lg font-bold text-white shadow-md shadow-violet-200">
                ณ
              </div>

              <div className="min-w-0">
                <p className="font-bold text-slate-800">
                  ณัชพล สกลกิจรุ่งโรจน์
                </p>
                <p className="mt-1 text-sm text-violet-600">
                  670710718
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-violet-100 bg-violet-50/50 p-4 transition hover:border-violet-300 hover:shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-500 text-lg font-bold text-white shadow-md shadow-violet-200">
                ท
              </div>

              <div className="min-w-0">
                <p className="font-bold text-slate-800">
                  ทัศนาวัลย์ สุทธิวัฒน์
                </p>
                <p className="mt-1 text-sm text-violet-600">
                  670710720
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="rounded-3xl bg-gradient-to-br from-violet-700 to-purple-600 px-6 py-8 text-center text-white shadow-lg shadow-violet-200 md:px-10">
          <div className="text-3xl">🏠</div>

          <h2 className="mt-3 text-2xl font-extrabold">
            Mareview
          </h2>



          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-violet-100">
            เว็บไซต์รีวิวและให้คะแนนหอพัก
            พัฒนาขึ้นเพื่อเป็นส่วนหนึ่งของการเรียนรู้ในรายวิชา
            <br />
            520 341 CLIENT SIDE WEB PROGRAMMING
            <br />
            520342 SERVER SIDE WEB PROGRAMMING
          </p>


          <div className="mx-auto mt-6 h-px max-w-xs bg-white/20" />

          <p className="mt-5 text-xs text-violet-200">
            © {new Date().getFullYear()} Mareview Project
          </p>
        </section>

      </main>
    </div>
  );
}

export default About;
