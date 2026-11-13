
function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-violet-100 bg-white">
      {/* Decorative Gradient */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-400 via-purple-600 to-fuchsia-400" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">

        {/* Brand */}
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-xl text-white shadow-md shadow-violet-200">
            🏠
          </div>

          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-violet-800">
              Mareview
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              โปรเจกต์ประกอบรายวิชา
              <br />
              520341 CLIENT SIDE WEB PROGRAMMING
              <br />
              520342 SERVER SIDE WEB PROGRAMMING
              <br />
              
              <br />
              คณะวิทยาศาสตร์ มหาวิทยาลัยศิลปากร
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="max-w-md md:text-right">
          <p className="text-sm font-medium leading-relaxed text-slate-600">
            เว็บไซต์รีวิวและให้คะแนนหอพัก
          </p>

          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            เพื่อช่วยประกอบการตัดสินใจเลือกที่พัก
          </p>

          <p className="mt-3 text-xs text-violet-400">
            © {new Date().getFullYear()} Mareview. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
