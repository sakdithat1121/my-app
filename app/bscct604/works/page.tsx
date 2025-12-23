// app/bscct604/works/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/* =======================
   Types
======================= */
type WorkItem = {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  size: number;
  addedAt: number;
  url: string; // เปิดจาก public/url ตรงๆ
};

type WorkGroup = {
  id: string;
  name: string;
  locked?: boolean; // กันลบกลุ่มระบบ
  items: WorkItem[];
};

/* =======================
   Simple UID
======================= */
const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/* =======================
   LocalStorage Key
======================= */
const LS_KEY = "bscct604-works-groups-v2-public";

/* =======================
   Helpers
======================= */
function isPDF(type: string, name: string) {
  const t = (type || "").toLowerCase();
  if (t.includes("pdf")) return true;
  return (name || "").toLowerCase().endsWith(".pdf");
}

function isImage(type: string, name: string) {
  const t = (type || "").toLowerCase();
  if (t.startsWith("image/")) return true;
  const n = (name || "").toLowerCase();
  return (
    n.endsWith(".png") ||
    n.endsWith(".jpg") ||
    n.endsWith(".jpeg") ||
    n.endsWith(".webp") ||
    n.endsWith(".gif")
  );
}

function guessTypeFromName(nameOrUrl: string) {
  const n = (nameOrUrl || "").toLowerCase();
  if (n.endsWith(".pdf")) return "application/pdf";
  if (n.endsWith(".png")) return "image/png";
  if (n.endsWith(".jpg") || n.endsWith(".jpeg")) return "image/jpeg";
  if (n.endsWith(".webp")) return "image/webp";
  if (n.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

function fileNameFromUrl(url: string) {
  try {
    const u = new URL(
      url,
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost"
    );
    const p = u.pathname.split("/").filter(Boolean);
    return p[p.length - 1] || "file";
  } catch {
    const parts = (url || "").split("/").filter(Boolean);
    return parts[parts.length - 1] || "file";
  }
}

function prettySize(bytes: number) {
  const b = Number(bytes || 0);
  if (!b) return "-";
  if (b < 1024) return `${b} B`;
  const kb = b / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

/** ทำให้ url ใช้งานได้:
 * - ถ้าเป็น absolute http(s) ใช้ได้เลย
 * - ถ้าเป็น relative และไม่ขึ้นต้นด้วย "/" จะเติม "/" ให้
 */
function normalizeUrl(input: string) {
  const u = (input || "").trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith("/")) return u;
  return `/${u}`;
}

/* =======================
   ✅ STATIC FILES IN public
   public/bscct604/works/week-01.pdf -> /bscct604/works/week-01.pdf
======================= */
const STATIC_PUBLIC_GROUP_ID = "public-works";

const STATIC_PUBLIC_ITEMS: WorkItem[] = [
  {
    id: "week-01",
    title: "งานสัปดาห์ที่ 1",
    fileName: "week-01.pdf",
    fileType: "application/pdf",
    size: 0,
    addedAt: Date.now(),
    url: "/bscct604/works/week-01.pdf",
  },
  {
    id: "week-02",
    title: "งานสัปดาห์ที่ 2",
    fileName: "week-02.pdf",
    fileType: "application/pdf",
    size: 0,
    addedAt: Date.now(),
    url: "/bscct604/works/week-02.pdf",
  },
];

function buildStaticGroup(): WorkGroup {
  return {
    id: STATIC_PUBLIC_GROUP_ID,
    name: "ไฟล์ในโฟลเดอร์ public/bscct604/works",
    locked: true,
    items: STATIC_PUBLIC_ITEMS,
  };
}

/** merge กลุ่มจาก localStorage เข้ากับกลุ่มระบบ (static)
 * - ตัดกลุ่มที่ id ชนกับ static ออกก่อนเสมอ
 */
function mergeWithStatic(saved: WorkGroup[]) {
  const cleaned = (saved || []).filter(
    (g) => g?.id && g.id !== STATIC_PUBLIC_GROUP_ID
  );
  return [buildStaticGroup(), ...cleaned];
}

/** เพื่อกันข้อมูล localStorage พัง */
function safeParseGroups(raw: string | null): WorkGroup[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // sanitize minimal
    return (
      parsed
        .filter((g) => g && typeof g === "object")
        .map((g) => ({
          id: String((g as any).id || uid()),
          name: String((g as any).name || "ไม่ระบุชื่อ"),
          locked: Boolean((g as any).locked),
          items: Array.isArray((g as any).items)
            ? (g as any).items.map((it: any) => ({
                id: String(it?.id || uid()),
                title: String(it?.title || "ไม่ระบุชื่อไฟล์"),
                fileName: String(
                  it?.fileName || fileNameFromUrl(String(it?.url || ""))
                ),
                fileType: String(
                  it?.fileType ||
                    guessTypeFromName(String(it?.fileName || it?.url || ""))
                ),
                size: Number(it?.size || 0),
                addedAt: Number(it?.addedAt || Date.now()),
                url: normalizeUrl(String(it?.url || "")),
              }))
            : [],
        }))
        // กันไม่ให้มี locked group ถูก save มาผิด ๆ (เลือกเก็บไว้ก็ได้ แต่เพื่อความสะอาด ตัดทิ้ง)
        .filter((g) => !g.locked)
    );
  } catch {
    return [];
  }
}

/* =======================
   Page
======================= */
export default function WorksPage() {
  const year = new Date().getFullYear();

  const [groups, setGroups] = useState<WorkGroup[]>([]);
  const [groupName, setGroupName] = useState("");

  // Viewer
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerTitle, setViewerTitle] = useState("");
  const [viewerFileName, setViewerFileName] = useState("");
  const [viewerType, setViewerType] = useState("");
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);

  /* ---------- Load ---------- */
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    const saved = safeParseGroups(raw);
    setGroups(mergeWithStatic(saved));
  }, []);

  /* ---------- Persist: เก็บเฉพาะกลุ่มที่ user สร้าง (ไม่ locked) ---------- */
  useEffect(() => {
    if (!groups.length) return;
    const toSave = groups.filter((g) => !g.locked);
    localStorage.setItem(LS_KEY, JSON.stringify(toSave));
  }, [groups]);

  const totalFiles = useMemo(
    () => groups.reduce((acc, g) => acc + (g.items?.length || 0), 0),
    [groups]
  );

  /* ---------- Add group ---------- */
  const addGroup = () => {
    const name = groupName.trim();
    if (!name) return;
    setGroups((prev) => [...prev, { id: uid(), name, items: [] }]);
    setGroupName("");
  };

  /* ---------- Remove group ---------- */
  const removeGroup = (groupId: string) => {
    const g = groups.find((x) => x.id === groupId);
    if (!g || g.locked) return;
    setGroups((prev) => prev.filter((x) => x.id !== groupId));
  };

  /* ---------- Add item by URL ---------- */
  const addLinkToGroup = (groupId: string, title: string, url: string) => {
    const t = title.trim();
    const u0 = url.trim();
    if (!t || !u0) return;

    const u = normalizeUrl(u0);
    const fileName = fileNameFromUrl(u);
    const fileType = guessTypeFromName(fileName);

    const item: WorkItem = {
      id: uid(),
      title: t,
      fileName,
      fileType,
      size: 0,
      addedAt: Date.now(),
      url: u,
    };

    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, items: [item, ...(g.items || [])] } : g
      )
    );
  };

  /* ---------- Remove file ---------- */
  const removeFile = (groupId: string, itemId: string) => {
    const g = groups.find((x) => x.id === groupId);
    if (g?.locked) return;
    setGroups((prev) =>
      prev.map((gg) =>
        gg.id === groupId
          ? { ...gg, items: (gg.items || []).filter((it) => it.id !== itemId) }
          : gg
      )
    );
  };

  /* ---------- Open viewer ---------- */
  const openViewer = (item: WorkItem) => {
    setViewerOpen(true);
    setViewerTitle(item.title);
    setViewerFileName(item.fileName);
    setViewerType(item.fileType || guessTypeFromName(item.fileName));
    setViewerUrl(item.url);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setViewerTitle("");
    setViewerFileName("");
    setViewerType("");
    setViewerUrl(null);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl">
          <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-sky-500/30 blur-3xl" />
            <div className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          </div>

          <div className="relative p-6 sm:p-8 lg:p-10 space-y-5">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="inline-flex items-center gap-2 rounded-full border border-sky-500/50 bg-sky-500/10 px-3 py-1 text-[11px] font-medium tracking-[0.2em] uppercase text-sky-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-300 animate-pulse" />
                  BSCCT604 • Works
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  ไฟล์งาน (Assignments / Works)
                </h1>
                <p className="text-sm text-slate-300">
                  ✅ เปิดไฟล์จาก <span className="text-sky-200">public/</span>{" "}
                  ได้ตรงๆ เช่น{" "}
                  <span className="text-slate-100">
                    /bscct604/works/week-01.pdf
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/bscct604"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-100 hover:border-sky-500/60 hover:text-sky-100 transition-colors"
                >
                  ← กลับหน้ารายวิชา
                </Link>
                <Link
                  href="/bscct604/certificates"
                  className="inline-flex items-center gap-2 rounded-full border border-rose-400/70 bg-rose-500/15 px-3 py-1.5 text-rose-50 hover:bg-rose-500/25 hover:shadow-lg hover:shadow-rose-500/25 transition-all"
                >
                  ไปหน้าเกียรติบัตร →
                </Link>
              </div>
            </header>

            <div className="border-t border-slate-800/70 pt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <h2 className="text-base font-semibold text-sky-200">
                  เพิ่มหัวข้อ (หมวดงาน)
                </h2>

                <div className="mt-3 flex gap-2">
                  <input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="เช่น งานสัปดาห์ / Lab / Final"
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500/60"
                  />
                  <button
                    onClick={addGroup}
                    className="rounded-xl border border-sky-500/50 bg-sky-500/15 px-4 py-2 text-sm font-semibold text-sky-100 hover:bg-sky-500/25"
                  >
                    เพิ่ม
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  * กลุ่มระบบ (public/bscct604/works) ถูกล็อก และจะไม่ถูกเก็บใน
                  localStorage
                </p>
              </section>

              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <h2 className="text-base font-semibold text-emerald-200">
                  สรุปสถานะ
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
                    <p className="text-xs text-slate-400">จำนวนหัวข้อ</p>
                    <p className="mt-0.5 font-semibold">{groups.length}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
                    <p className="text-xs text-slate-400">จำนวนไฟล์</p>
                    <p className="mt-0.5 font-semibold">{totalFiles}</p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  PDF/รูป: พรีวิวในหน้าได้ • ไฟล์อื่น: เปิดแท็บใหม่/ดาวน์โหลด
                </p>
              </section>
            </div>
          </div>
        </section>

        {/* GROUPS LIST */}
        <section className="space-y-4">
          {groups.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-slate-300">
              ยังไม่มีข้อมูล
            </div>
          ) : (
            groups.map((group) => (
              <div
                key={group.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">
                      {group.name}
                      {group.locked && (
                        <span className="ml-2 text-xs text-slate-400">
                          (ระบบ)
                        </span>
                      )}
                    </h2>
                    <p className="text-sm text-slate-300 mt-1">
                      กด “ดูเอกสาร” เพื่อเปิดไฟล์ในหน้านี้
                    </p>
                  </div>

                  <button
                    onClick={() => removeGroup(group.id)}
                    disabled={!!group.locked}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-400/50 bg-rose-500/10 px-3 py-1.5 text-rose-100 hover:bg-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    title={group.locked ? "กลุ่มนี้ลบไม่ได้" : "ลบหัวข้อ"}
                  >
                    ลบหัวข้อ
                  </button>
                </div>

                {/* Add by URL (สำหรับกลุ่มที่ไม่ใช่ระบบ) */}
                {!group.locked && (
                  <div className="mt-4">
                    <AddLinkForm
                      onAdd={(title, url) =>
                        addLinkToGroup(group.id, title, url)
                      }
                    />
                    <p className="mt-2 text-xs text-slate-400">
                      ตัวอย่าง URL:{" "}
                      <span className="text-slate-200">
                        /bscct604/works/week-03.pdf
                      </span>{" "}
                      หรือแบบเต็ม{" "}
                      <span className="text-slate-200">
                        https://yourdomain.com/bscct604/works/week-03.pdf
                      </span>
                    </p>
                  </div>
                )}

                {/* Items */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.items.length === 0 ? (
                    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-400">
                      ยังไม่มีไฟล์ในหัวข้อนี้
                    </div>
                  ) : (
                    group.items.map((item) => (
                      <div
                        key={item.id}
                        className="group rounded-xl border border-slate-800 bg-slate-950/40 p-4 hover:border-sky-500/60 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <p className="font-semibold text-slate-100">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-400">
                              {item.fileName} • {prettySize(item.size)}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {new Date(item.addedAt).toLocaleString()}
                            </p>
                            <p className="text-[11px] text-slate-500 break-all">
                              {item.url}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 items-end">
                            <button
                              onClick={() => openViewer(item)}
                              className="text-xs rounded-full border border-sky-500/50 bg-sky-500/10 px-3 py-1.5 text-sky-100 hover:bg-sky-500/20"
                            >
                              ดูเอกสาร
                            </button>

                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1.5 text-emerald-50 hover:bg-emerald-500/20"
                            >
                              เปิดแท็บใหม่
                            </a>

                            {!group.locked && (
                              <button
                                onClick={() => removeFile(group.id, item.id)}
                                className="text-xs rounded-full border border-rose-400/50 bg-rose-500/10 px-3 py-1.5 text-rose-100 hover:bg-rose-500/20"
                                title="ลบไฟล์"
                              >
                                ลบ
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </section>

        {/* FOOTER */}
        <footer className="pt-3 border-t border-slate-800/70 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between text-xs sm:text-sm text-slate-400">
          <p>หน้าไฟล์งานสำหรับรายวิชา BSCCT604</p>
          <p className="text-slate-500">© {year} BSCCT604</p>
        </footer>

        {/* VIEWER MODAL */}
        {viewerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={closeViewer}
            />
            <div className="relative w-full max-w-5xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 p-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-100">
                    {viewerTitle}
                  </p>
                  <p className="text-xs text-slate-400">
                    {viewerFileName} • {viewerType || "unknown"}
                  </p>
                </div>
                <button
                  onClick={closeViewer}
                  className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 hover:border-sky-500/60"
                >
                  ปิด
                </button>
              </div>

              <div className="p-4">
                {!viewerUrl ? (
                  <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-6 text-rose-100">
                    ไม่พบ URL ของไฟล์
                  </div>
                ) : isImage(viewerType, viewerFileName) ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <img
                      src={viewerUrl}
                      alt={viewerFileName}
                      className="max-h-[70vh] w-full object-contain rounded-lg"
                    />
                  </div>
                ) : isPDF(viewerType, viewerFileName) ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                    <iframe
                      src={viewerUrl}
                      className="w-full h-[70vh]"
                      title={viewerFileName}
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
                    <p className="text-slate-200 text-sm">
                      ไฟล์ชนิดนี้ไม่สามารถพรีวิวในหน้าได้โดยตรง
                    </p>
                    <a
                      href={viewerUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-500/15 px-4 py-2 text-sm text-emerald-50 hover:bg-emerald-500/25"
                    >
                      เปิดไฟล์ →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* =======================
   AddLinkForm
======================= */
function AddLinkForm({
  onAdd,
}: {
  onAdd: (title: string, url: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const add = () => {
    if (!title.trim() || !url.trim()) return;
    onAdd(title, url);
    setTitle("");
    setUrl("");
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
      <p className="text-sm font-semibold text-slate-100">
        ➕ เพิ่มเอกสาร (ใส่ URL)
      </p>

      <div className="mt-3 flex flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ชื่อเอกสาร (เช่น งานสัปดาห์ที่ 3)"
          className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500/60"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL ไฟล์ (เช่น /bscct604/works/week-03.pdf)"
          className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-500/60"
        />
        <button
          onClick={add}
          className="self-start rounded-xl border border-emerald-400/60 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-50 hover:bg-emerald-500/25"
        >
          บันทึก
        </button>
      </div>
    </div>
  );
}
