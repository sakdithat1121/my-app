// app/bscct604/documents/page.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type UploadedFile = {
  name: string;
  url: string;
  size: number;
};

export default function BSCCT604DocumentsPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // โหลดรายการไฟล์จาก API
  const loadFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/bscct604/files");
      if (!res.ok) {
        throw new Error("โหลดรายการไฟล์ไม่สำเร็จ");
      }
      const data = (await res.json()) as UploadedFile[];
      setFiles(data);
      // ถ้ายังไม่มีไฟล์ที่เลือก ให้เลือกไฟล์แรกอัตโนมัติ
      if (data.length > 0 && !selectedFile) {
        setSelectedFile(data[0]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "เกิดข้อผิดพลาดในการโหลดไฟล์");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // จัดการอัปโหลดไฟล์
  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      setError("กรุณาเลือกไฟล์ก่อนอัปโหลด");
      return;
    }

    try {
      setIsUploading(true);
      const res = await fetch("/api/bscct604/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "อัปโหลดไม่สำเร็จ");
      }

      setMessage("อัปโหลดไฟล์สำเร็จ");
      form.reset();
      await loadFiles();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
    } finally {
      setIsUploading(false);
    }
  };

  // สั่งพิมพ์ไฟล์ที่เลือก (เปิดแท็บใหม่แล้ว print)
  const handlePrintSelected = () => {
    if (!selectedFile) return;
    const w = window.open(selectedFile.url, "_blank");
    if (!w) return;
    const listener = () => {
      w.focus();
      w.print();
      w.removeEventListener("load", listener);
    };
    w.addEventListener("load", listener);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* หัวข้อหน้าเอกสาร */}
        <header className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
            <div className="absolute -top-24 -left-10 h-40 w-40 rounded-full bg-amber-500/30 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-44 w-44 rounded-full bg-sky-500/25 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse" />
                Documents • BSCCT604
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold">
                เอกสารประกอบการสอน BSCCT604
              </h1>
              <p className="text-sm text-slate-300">
                รวมไฟล์เอกสารที่ใช้ในการสอน / มคอ.3 / สไลด์ / แบบฝึกหัด
                พร้อมตัวอย่างไฟล์ที่เปิดดูและสั่งพิมพ์ได้
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-2 text-xs sm:text-sm">
              <Link
                href="http://10.70.163.2:3000/"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1.5 text-slate-100 hover:border-sky-500 hover:text-sky-100 transition-colors"
              >
                ← กลับหน้ารายวิชา
              </Link>
              <p className="text-slate-400">
                สามารถอัปโหลดไฟล์ใหม่ + เลือกดูตัวอย่างและสั่งปริ้นได้จากหน้านี้
              </p>
            </div>
          </div>
        </header>

        {/* layout หลัก แบ่งซ้ายขวา: อัปโหลด + list | preview */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
          {/* ด้านซ้าย: อัปโหลด + รายการไฟล์ */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-amber-200">
                  อัปโหลดไฟล์เอกสารใหม่
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  รองรับไฟล์ .pdf, .pptx, .docx, .xlsx, รูปภาพ ฯลฯ (จะถูกเก็บใน
                  /public/uploads/bscct604)
                </p>
              </div>
            </div>

            <form
              onSubmit={handleUpload}
              className="mt-2 space-y-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  type="file"
                  name="file"
                  className="block w-full text-xs sm:text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-amber-500/20 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-amber-50 hover:file:bg-amber-500/30 cursor-pointer"
                />
                <button
                  type="submit"
                  disabled={isUploading}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-400/80 bg-amber-500/20 px-4 py-2 text-xs sm:text-sm font-medium text-amber-50 hover:bg-amber-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-amber-300 animate-ping" />
                      กำลังอัปโหลด...
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-emerald-300" />
                      อัปโหลดไฟล์
                    </>
                  )}
                </button>
              </div>

              {message && (
                <p className="text-xs text-emerald-300 mt-1">{message}</p>
              )}
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </form>

            {/* รายการไฟล์ที่อัปโหลด */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-100">
                  ไฟล์ที่อัปโหลดแล้ว
                </h3>
                {isLoading && (
                  <span className="text-[11px] text-slate-400">
                    กำลังโหลดรายการไฟล์...
                  </span>
                )}
              </div>

              {files.length === 0 && !isLoading && (
                <p className="text-xs text-slate-500">
                  ยังไม่มีไฟล์ที่อัปโหลด ลองอัปโหลดไฟล์แรกของรายวิชานี้ได้เลย
                </p>
              )}

              {files.length > 0 && (
                <ul className="space-y-2 text-sm max-h-[380px] overflow-y-auto pr-1">
                  {files.map((file) => {
                    const isActive =
                      selectedFile && selectedFile.name === file.name;
                    return (
                      <li
                        key={file.name}
                        className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 transition-colors cursor-pointer ${
                          isActive
                            ? "border-amber-500/80 bg-slate-900"
                            : "border-slate-800 bg-slate-950/80 hover:border-amber-500/70"
                        }`}
                        onClick={() => setSelectedFile(file)}
                      >
                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-100 break-all">
                            {file.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            ขนาดประมาณ {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-[11px]">
                          <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-slate-300">
                            คลิกเพื่อดูตัวอย่าง
                          </span>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-full border border-amber-400/70 bg-amber-500/20 px-2 py-0.5 text-amber-50 hover:bg-amber-500/30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            เปิด / ดาวน์โหลด
                          </a>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>

          {/* ด้านขวา: ตัวอย่างไฟล์ + ปุ่มพิมพ์ */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 flex flex-col">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-sky-200">
                  ตัวอย่างเอกสาร / Preview
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  แสดงไฟล์ที่เลือกจากด้านซ้าย สามารถสั่งพิมพ์หรือเปิดเต็มจอได้
                </p>
              </div>

              {selectedFile && (
                <div className="flex flex-col sm:flex-row gap-2 text-[11px] sm:text-xs">
                  <button
                    type="button"
                    onClick={handlePrintSelected}
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-emerald-400/80 bg-emerald-500/20 px-3 py-1 font-medium text-emerald-50 hover:bg-emerald-500/30 transition-colors"
                  >
                    🖨 พิมพ์ไฟล์นี้
                  </button>
                  <a
                    href={selectedFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 rounded-full border border-sky-400/80 bg-sky-500/20 px-3 py-1 font-medium text-sky-50 hover:bg-sky-500/30 transition-colors"
                  >
                    เปิดเต็มจอ
                  </a>
                </div>
              )}
            </div>

            {!selectedFile && (
              <div className="flex-1 flex items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-xs text-slate-500">
                เลือกไฟล์จากด้านซ้ายเพื่อดูตัวอย่างเอกสารที่นี่
              </div>
            )}

            {selectedFile && (
              <div className="flex-1 flex flex-col gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs sm:text-sm">
                  <p className="font-medium text-slate-100 break-all">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    ขนาดประมาณ {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    * แนะนำใช้ไฟล์ PDF เพื่อให้แสดงและพิมพ์ได้สวยที่สุด
                  </p>
                </div>

                {/* กล่อง iframe แสดงไฟล์ */}
                <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/90 overflow-hidden">
                  <iframe
                    key={selectedFile.url}
                    src={selectedFile.url}
                    className="w-full h-[420px] sm:h-[520px] border-0"
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* กล่องแบ่งหมวดเอกสารเดิม (static) */}
        <section className="space-y-5">
          {/* กลุ่ม 1: เอกสารหลักวิชา */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-amber-200">
                  1. เอกสารหลักของรายวิชา
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  ใช้แนบ มคอ.3 / เสนอหลักสูตร / ส่งให้หัวหน้าสาขา
                </p>
              </div>
            </div>

            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 hover:border-amber-500/70 transition-colors">
                <div>
                  <p className="font-medium text-slate-100">
                    1.1 Course Outline (TH/EN)
                  </p>
                  <p className="text-xs text-slate-400">
                    โครงร่างรายวิชาแบบย่อ ใช้แนบ มคอ.3 / นำเสนอสรุปวิชา
                  </p>
                </div>
                <Link
                  href="/files/bscct604/course-outline-bscct604.pdf"
                  className="text-xs rounded-full border border-amber-400/70 bg-amber-500/20 px-3 py-1 text-amber-50 hover:bg-amber-500/30 transition-colors"
                >
                  ดาวน์โหลด
                </Link>
              </li>

              <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 hover:border-amber-500/70 transition-colors">
                <div>
                  <p className="font-medium text-slate-100">
                    1.2 มคอ.3 ฉบับเต็ม (Thai)
                  </p>
                  <p className="text-xs text-slate-400">
                    รายละเอียดจุดมุ่งหมาย, CLO, แผนการสอน, วิธีประเมินผล ฯลฯ
                  </p>
                </div>
                <Link
                  href="/files/bscct604/mor-kor-3-bscct604.pdf"
                  className="text-xs rounded-full border border-amber-400/70 bg-amber-500/20 px-3 py-1 text-amber-50 hover:bg-amber-500/30 transition-colors"
                >
                  ดาวน์โหลด
                </Link>
              </li>

              <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 hover:border-amber-500/70 transition-colors">
                <div>
                  <p className="font-medium text-slate-100">
                    1.3 Syllabus (English)
                  </p>
                  <p className="text-xs text-slate-400">
                    ใช้สำหรับส่งแลกเปลี่ยนกับหลักสูตรอื่น / International
                    Program
                  </p>
                </div>
                <Link
                  href="/files/bscct604/syllabus-en-bscct604.pdf"
                  className="text-xs rounded-full border border-amber-400/70 bg-amber-500/20 px-3 py-1 text-amber-50 hover:bg-amber-500/30 transition-colors"
                >
                  ดาวน์โหลด
                </Link>
              </li>
            </ul>
          </div>

          {/* กลุ่ม 2: สไลด์และ handout ตามบท */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-sky-200">
                  2. สไลด์และ Handout 7 บทเรียน
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  ไฟล์สไลด์สำหรับการสอนในห้องเรียน / ออนไลน์
                </p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {[
                {
                  id: 1,
                  title: "บทที่ 1 บทนำสู่งานบริหารเครือข่าย",
                  key: "1-intro",
                },
                {
                  id: 2,
                  title: "บทที่ 2 การติดตั้งและกำหนดค่าระบบเครือข่ายพื้นฐาน",
                  key: "2-basic-config",
                },
                {
                  id: 3,
                  title: "บทที่ 3 การจัดสรรหมายเลขไอพีและ DHCP",
                  key: "3-ip-dhcp",
                },
                {
                  id: 4,
                  title: "บทที่ 4 Routing และการค้นหาเส้นทาง",
                  key: "4-routing",
                },
                {
                  id: 5,
                  title: "บทที่ 5 เครือข่ายไร้สาย (Wireless Network)",
                  key: "5-wireless",
                },
                {
                  id: 6,
                  title: "บทที่ 6 ความปลอดภัยเครือข่ายและ VPN",
                  key: "6-security-vpn",
                },
                {
                  id: 7,
                  title: "บทที่ 7 โครงงานบริหารเครือข่ายในองค์กร",
                  key: "7-project",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 hover:border-sky-500/70 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-slate-100">
                      บทที่ {item.id}
                    </p>
                    <p className="text-xs text-slate-400">{item.title}</p>
                  </div>
                  <Link
                    href={`/files/bscct604/slides/bscct604-ch${item.id}.pptx`}
                    className="text-xs rounded-full border border-sky-400/70 bg-sky-500/20 px-3 py-1 text-sky-50 hover:bg-sky-500/30 transition-colors"
                  >
                    สไลด์
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* กลุ่ม 3: เอกสาร lab / แบบฝึกหัด */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-emerald-200">
                  3. Lab Sheet / แบบฝึกหัด / ใบงาน
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  สำหรับส่งให้นักศึกษาในห้องปฏิบัติการ / งานเดี่ยว / งานกลุ่ม
                </p>
              </div>
            </div>

            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 hover:border-emerald-500/70 transition-colors">
                <div>
                  <p className="font-medium text-slate-100">
                    3.1 Lab Sheet: Basic Network Setup
                  </p>
                  <p className="text-xs text-slate-400">
                    ตั้งค่า IP, ทดสอบการเชื่อมต่อ, ใช้คำสั่งพื้นฐาน
                  </p>
                </div>
                <Link
                  href="/files/bscct604/labs/lab01-basic-setup.pdf"
                  className="text-xs rounded-full border border-emerald-400/70 bg-emerald-500/20 px-3 py-1 text-emerald-50 hover:bg-emerald-500/30 transition-colors"
                >
                  ดาวน์โหลด
                </Link>
              </li>

              <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 hover:border-emerald-500/70 transition-colors">
                <div>
                  <p className="font-medium text-slate-100">
                    3.2 Lab Sheet: Routing &amp; Static Route
                  </p>
                  <p className="text-xs text-slate-400">
                    ทดลองกำหนดเส้นทาง Static Route ระหว่างเครือข่ายย่อย
                  </p>
                </div>
                <Link
                  href="/files/bscct604/labs/lab02-routing.pdf"
                  className="text-xs rounded-full border border-emerald-400/70 bg-emerald-500/20 px-3 py-1 text-emerald-50 hover:bg-emerald-500/30 transition-colors"
                >
                  ดาวน์โหลด
                </Link>
              </li>

              <li className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 hover:border-emerald-500/70 transition-colors">
                <div>
                  <p className="font-medium text-slate-100">
                    3.3 Project Guide Line
                  </p>
                  <p className="text-xs text-slate-400">
                    แนวทางโครงงานปลายภาคด้านการบริหารเครือข่ายในองค์กร
                  </p>
                </div>
                <Link
                  href="/files/bscct604/labs/project-guideline.pdf"
                  className="text-xs rounded-full border border-emerald-400/70 bg-emerald-500/20 px-3 py-1 text-emerald-50 hover:bg-emerald-500/30 transition-colors"
                >
                  ดาวน์โหลด
                </Link>
              </li>
            </ul>
          </div>
        </section>

        {/* หมายเหตุเล็ก ๆ */}
        <p className="text-[11px] text-slate-500">
          * ไฟล์ที่อัปโหลดจะถูกเก็บไว้ใน <code>/public/uploads/bscct604</code>{" "}
          และสามารถเปิดผ่าน URL ที่ระบบสร้างให้ได้ทันที ทั้งในหน้า Preview
          และในแท็บใหม่สำหรับสั่งพิมพ์
        </p>
      </div>
    </main>
  );
}
