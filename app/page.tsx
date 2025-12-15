import Link from "next/link";

export default function BSCCT604Page() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HERO / HEADER */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl">
          {/* แสงเบา ๆ ด้านหลัง */}
          <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
            <div className="absolute -top-32 -left-24 h-64 w-64 rounded-full bg-sky-500/30 blur-3xl" />
            <div className="absolute -bottom-32 -right-10 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl" />
          </div>

          <div className="relative p-6 sm:p-8 lg:p-10 space-y-6">
            {/* บรรทัดหัวเรื่องหลัก */}
            <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3 max-w-xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-sky-500/50 bg-sky-500/10 px-3 py-1 text-[11px] font-medium tracking-[0.2em] uppercase text-sky-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-300 animate-pulse" />
                  Course Outline • BSCCT604
                </p>

                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                    BSCCT604 การบริหารเครือข่ายคอมพิวเตอร์
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300">
                    <span className="font-semibold text-sky-300">
                      Computer Network Administration
                    </span>{" "}
                    • 3(2-2-5)
                  </p>
                </div>

                <div className="text-xs sm:text-sm space-y-1 text-slate-300">
                  <p>
                    รหัสรายวิชาเดิม :{" "}
                    <span className="text-slate-100">ไม่มี</span>
                  </p>
                  <p>
                    วิชาบังคับก่อน :{" "}
                    <span className="font-semibold text-slate-100">
                      BSCCT603 การสื่อสารข้อมูลและระบบเครือข่ายคอมพิวเตอร์
                    </span>
                  </p>
                </div>
              </div>

              {/* กล่องสถานะวิชา */}
              <div className="w-full max-w-xs lg:max-w-sm self-start lg:self-center">
                <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 backdrop-blur">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-emerald-200/80">
                        สถานะรายวิชา
                      </p>
                      <p className="mt-1 text-sm font-semibold text-emerald-100">
                        พร้อมเปิดสอน / ใช้ใน มคอ.3
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-[11px] font-medium text-emerald-100 border border-emerald-400/60">
                      Active
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] text-slate-200">
                    <div className="rounded-xl bg-slate-900/70 border border-slate-800 px-3 py-2">
                      <p className="text-[10px] uppercase text-slate-400 tracking-wide">
                        หน่วยกิต
                      </p>
                      <p className="font-semibold mt-0.5">3(2-2-5)</p>
                    </div>
                    <div className="rounded-xl bg-slate-900/70 border border-slate-800 px-3 py-2">
                      <p className="text-[10px] uppercase text-slate-400 tracking-wide">
                        ระดับ
                      </p>
                      <p className="font-semibold mt-0.5">ปริญญาตรี</p>
                    </div>
                    <div className="rounded-xl bg-slate-900/70 border border-slate-800 px-3 py-2">
                      <p className="text-[10px] uppercase text-slate-400 tracking-wide">
                        ปีการศึกษา
                      </p>
                      <p className="font-semibold mt-0.5">256x</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* เมนูหลักของวิชา */}
            <nav className="mt-2 flex flex-col gap-3 border-t border-slate-800/70 pt-4 md:flex-row md:items-center md:justify-between">
              {/* หมวดเนื้อหาหลัก */}
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                <span className="px-3 py-1 rounded-full bg-sky-500/25 text-sky-50 border border-sky-400/60 shadow-sm shadow-sky-900/50">
                  ข้อมูลรายวิชา
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-100 border border-slate-700 hover:border-sky-500/60 hover:text-sky-100 transition-colors">
                  คำอธิบาย (ไทย)
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-100 border border-slate-700 hover:border-violet-500/60 hover:text-violet-100 transition-colors">
                  Course Description (EN)
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 text-slate-100 border border-slate-700 hover:border-amber-500/60 hover:text-amber-100 transition-colors">
                  โครงร่าง 7 บทเรียน
                </span>
              </div>

              {/* เมนูเครื่องมือ / แบบฝึก */}
              <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
                <Link
                  href="/bscct604/grade"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-500/15 px-3 py-1.5 text-emerald-50 hover:bg-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  เมนูตัดเกรด
                </Link>

                <Link
                  href="/bscct604/add-two-digits"
                  className="inline-flex items-center gap-2 rounded-full border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-violet-50 hover:bg-violet-500/25 hover:shadow-lg hover:shadow-violet-500/25 transition-all"
                >
                  <span className="h-2 w-2 rounded-full bg-violet-300" />
                  เมนูบวกเลข 2 หลัก
                </Link>

                {/* เมนูใหม่: เอกสาร */}
                <Link
                  href="/bscct604/documents"
                  className="inline-flex items-center gap-2 rounded-full border border-amber-400/70 bg-amber-500/15 px-3 py-1.5 text-amber-50 hover:bg-amber-500/25 hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                >
                  <span className="h-2 w-2 rounded-full bg-amber-300" />
                  เอกสารประกอบการสอน
                </Link>

                {/* ✅ เพิ่มเมนูใหม่: ไฟล์งาน */}
                <Link
                  href="/bscct604/works"
                  className="inline-flex items-center gap-2 rounded-full border border-sky-400/70 bg-sky-500/15 px-3 py-1.5 text-sky-50 hover:bg-sky-500/25 hover:shadow-lg hover:shadow-sky-500/25 transition-all"
                >
                  <span className="h-2 w-2 rounded-full bg-sky-300" />
                  ไฟล์งาน
                </Link>

                {/* ✅ เพิ่มเมนูใหม่: เกียรติบัตร */}
                <Link
                  href="/bscct604/certificates"
                  className="inline-flex items-center gap-2 rounded-full border border-rose-400/70 bg-rose-500/15 px-3 py-1.5 text-rose-50 hover:bg-rose-500/25 hover:shadow-lg hover:shadow-rose-500/25 transition-all"
                >
                  <span className="h-2 w-2 rounded-full bg-rose-300" />
                  เกียรติบัตร
                </Link>
              </div>
            </nav>
          </div>
        </section>

        {/* เนื้อหาหลัก: details 4 หมวด */}
        <section className="space-y-4">
          {/* หมวด 1: ข้อมูลรายวิชา (ย่อ) */}
          <details className="group rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-sky-500/70 transition-colors">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/15 text-sky-300 text-sm">
                  1
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">
                    หมวดที่ 1 • ข้อมูลรายวิชา (แบบย่อ)
                  </p>
                  <p className="text-xs text-slate-400">
                    รหัส, หน่วยกิต, วิชาบังคับก่อน, สรุปภาษาไทย/อังกฤษ
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 group-open:rotate-90 transition-transform">
                ▶
              </span>
            </summary>

            <div className="border-t border-slate-800 px-4 py-4 sm:px-5 text-sm leading-relaxed space-y-2 bg-slate-950/50">
              <p>
                <span className="font-semibold">
                  BSCCT604 การบริหารเครือข่ายคอมพิวเตอร์
                </span>{" "}
                3(2-2-5)
                <br />
                <span className="italic text-sky-200">
                  Computer Network Administration
                </span>
              </p>
              <p>รหัสรายวิชาเดิม : ไม่มี</p>
              <p>
                วิชาบังคับก่อน : BSCCT603
                การสื่อสารข้อมูลและระบบเครือข่ายคอมพิวเตอร์
              </p>

              <p className="mt-3 text-slate-200">
                ศึกษาและฝึกปฏิบัติเกี่ยวกับการติดตั้งและกำหนดค่าทางเครือข่ายคอมพิวเตอร์ใน
                รูปแบบต่าง ๆ การค้นหาเส้นทาง
                การจัดสรรหมายเลขไอพีแบบคงที่และแบบพลวัต
                ระบบเครือข่ายคอมพิวเตอร์ไร้สาย
                ระบบความปลอดภัยในเครือข่ายคอมพิวเตอร์
                การออกแบบช่องทางการสื่อสารชนิดส่วนบุคคล
                และการประยุกต์ใช้ระบบเครือข่าย คอมพิวเตอร์กับองค์กรแบบต่าง ๆ
              </p>

              <p className="mt-2 italic text-slate-300">
                Study and practice in installation and setup of computer network
                with various applications, routing, assignment of static and
                dynamic IP addresses, wireless network system, computer network
                security, virtual private network design, and application of
                computer network in various types of organization.
              </p>
            </div>
          </details>

          {/* หมวด 2: คำอธิบายรายวิชา (ไทย) */}
          <details className="group rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-emerald-500/70 transition-colors">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 text-sm">
                  2
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">
                    หมวดที่ 2 • คำอธิบายรายวิชา (ภาษาไทย)
                  </p>
                  <p className="text-xs text-slate-400">
                    ใช้ใส่ใน มคอ.3 / คำอธิบายรายวิชาอย่างเป็นทางการ
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 group-open:rotate-90 transition-transform">
                ▶
              </span>
            </summary>

            <div className="border-t border-slate-800 px-4 py-4 sm:px-5 text-sm leading-relaxed space-y-2 bg-slate-950/50">
              <p className="font-semibold text-slate-100">
                ข้อความคำอธิบายรายวิชา
              </p>
              <p>
                BSCCT604 การบริหารเครือข่ายคอมพิวเตอร์ (Computer Network
                Administration) 3(2-2-5)
              </p>
              <p>
                วิชาบังคับก่อน : BSCCT603
                การสื่อสารข้อมูลและระบบเครือข่ายคอมพิวเตอร์
              </p>
              <p className="mt-2 text-slate-200">
                ศึกษาหลักการและฝึกปฏิบัติเกี่ยวกับการติดตั้งและตั้งค่าระบบเครือข่ายคอมพิวเตอร์ในรูปแบบต่าง
                ๆ การกำหนดและจัดสรรหมายเลขไอพีทั้งแบบคงที่และแบบอัตโนมัติ
                การค้นหาและกำหนดเส้นทางในเครือข่าย การใช้งานเครือข่ายไร้สาย
                ระบบรักษาความปลอดภัยในเครือข่าย การออกแบบเครือข่ายส่วนบุคคล
                (VPN)
                และการประยุกต์ใช้ระบบเครือข่ายคอมพิวเตอร์ในองค์กรประเภทต่าง ๆ
              </p>
            </div>
          </details>

          {/* หมวด 3: Description EN */}
          <details className="group rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-indigo-500/70 transition-colors">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300 text-sm">
                  3
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">
                    หมวดที่ 3 • Course Description (English)
                  </p>
                  <p className="text-xs text-slate-400">
                    English version for syllabus / course specification
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 group-open:rotate-90 transition-transform">
                ▶
              </span>
            </summary>

            <div className="border-t border-slate-800 px-4 py-4 sm:px-5 text-sm leading-relaxed bg-slate-950/50">
              <p className="italic text-slate-200">
                This course covers principles and hands-on practice in
                installing and configuring computer networks in various forms.
                Topics include routing, configuration of static and dynamic IP
                addressing, wireless network systems, network security, virtual
                private network (VPN) design, and applying computer network
                systems to different types of organizations.
              </p>
            </div>
          </details>

          {/* หมวด 4: โครงร่าง 7 บทเรียน */}
          <details
            className="group rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-amber-500/70 transition-colors"
            open
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 text-sm">
                  4
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">
                    หมวดที่ 4 • โครงร่างรายวิชา 7 บทเรียน
                  </p>
                  <p className="text-xs text-slate-400">
                    แผนหัวข้อการสอนตั้งแต่พื้นฐานจนถึงโครงงาน
                  </p>
                </div>
              </div>
              <span className="text-xs text-slate-400 group-open:rotate-90 transition-transform">
                ▶
              </span>
            </summary>

            <div className="border-t border-slate-800 px-4 py-4 sm:px-5 sm:py-5 text-sm leading-relaxed bg-slate-950/50 space-y-4">
              {/* บทที่ 1 */}
              <section className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3 hover:border-sky-500/60 transition-colors">
                <h2 className="font-semibold text-sky-200">
                  บทที่ 1 บทนำสู่งานบริหารเครือข่ายคอมพิวเตอร์
                </h2>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-200">
                  <li>ความหมายและบทบาทของผู้ดูแลเครือข่าย</li>
                  <li>โครงสร้างพื้นฐานเครือข่าย (ทบทวนจาก BSCCT603)</li>
                  <li>รูปแบบเครือข่ายในองค์กรประเภทต่าง ๆ</li>
                </ul>
              </section>

              {/* บทที่ 2 */}
              <section className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3 hover:border-sky-500/60 transition-colors">
                <h2 className="font-semibold text-sky-200">
                  บทที่ 2 การติดตั้งและกำหนดค่าระบบเครือข่ายพื้นฐาน
                </h2>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-200">
                  <li>การออกแบบโครงสร้างเครือข่ายเบื้องต้น</li>
                  <li>
                    การตั้งค่าอุปกรณ์เครือข่าย (Switch, Router, Access Point)
                  </li>
                  <li>การทดสอบและตรวจสอบการเชื่อมต่อเครือข่าย</li>
                </ul>
              </section>

              {/* บทที่ 3 */}
              <section className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3 hover:border-sky-500/60 transition-colors">
                <h2 className="font-semibold text-sky-200">
                  บทที่ 3 การจัดสรรหมายเลขไอพีแบบคงที่และแบบพลวัต
                </h2>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-200">
                  <li>โครงสร้าง IP Address และ Subnetting</li>
                  <li>การกำหนด IP แบบคงที่ (Static IP)</li>
                  <li>การตั้งค่าเซิร์ฟเวอร์ DHCP และการแจก IP แบบอัตโนมัติ</li>
                </ul>
              </section>

              {/* บทที่ 4 */}
              <section className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3 hover:border-sky-500/60 transition-colors">
                <h2 className="font-semibold text-sky-200">
                  บทที่ 4 การค้นหาเส้นทางและการกำหนดเส้นทาง (Routing)
                </h2>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-200">
                  <li>แนวคิดของ Routing และเส้นทางข้อมูล</li>
                  <li>Static Route และ Default Route</li>
                  <li>
                    แนวคิดพื้นฐานของ Dynamic Routing (เช่น RIP/OSPF แบบภาพรวม)
                  </li>
                </ul>
              </section>

              {/* บทที่ 5 */}
              <section className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3 hover:border-sky-500/60 transition-colors">
                <h2 className="font-semibold text-sky-200">
                  บทที่ 5 ระบบเครือข่ายคอมพิวเตอร์ไร้สาย (Wireless Network)
                </h2>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-200">
                  <li>มาตรฐานเครือข่ายไร้สาย (เช่น 802.11x)</li>
                  <li>การออกแบบและติดตั้งเครือข่าย Wi-Fi ภายในองค์กร</li>
                  <li>ปัญหาและการแก้ไขเบื้องต้นของเครือข่ายไร้สาย</li>
                </ul>
              </section>

              {/* บทที่ 6 */}
              <section className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3 hover:border-sky-500/60 transition-colors">
                <h2 className="font-semibold text-sky-200">
                  บทที่ 6 ระบบความปลอดภัยในเครือข่ายและการออกแบบ VPN
                </h2>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-200">
                  <li>ภัยคุกคามและช่องโหว่ในเครือข่าย</li>
                  <li>การใช้ Firewall, Access Control List (ACL)</li>
                  <li>แนวคิดและการออกแบบ Virtual Private Network (VPN)</li>
                </ul>
              </section>

              {/* บทที่ 7 */}
              <section className="rounded-xl bg-slate-900/80 border border-slate-800 px-4 py-3 hover:border-sky-500/60 transition-colors">
                <h2 className="font-semibold text-sky-200">
                  บทที่ 7 การประยุกต์ใช้และโครงงานบริหารเครือข่ายในองค์กร
                </h2>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-slate-200">
                  <li>การออกแบบโครงสร้างเครือข่ายสำหรับองค์กรจำลอง</li>
                  <li>การเลือกเทคโนโลยีให้เหมาะกับประเภทองค์กร</li>
                  <li>สรุปและนำเสนอผลงาน/โครงงานบริหารเครือข่าย</li>
                </ul>
              </section>
            </div>
          </details>
        </section>

        {/* FOOTER */}
        <footer className="pt-3 border-t border-slate-800/70 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between text-xs sm:text-sm text-slate-400">
          <p>
            เอกสารนี้สามารถใช้แนบใน มคอ.3 หรือเอกสารโครงสร้างรายวิชาได้ทันที
          </p>
          <p className="text-slate-500">
            © {year} BSCCT • Computer Network Administration
          </p>
        </footer>
      </div>
    </main>
  );
}
