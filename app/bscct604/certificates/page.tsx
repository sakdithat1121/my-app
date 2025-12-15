// app/bscct604/certificates/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

/* =======================
   Types
======================= */
type CertItem = {
  id: string;
  title: string;
  fileName: string;
  fileType: string;
  size: number;
  addedAt: number;
  url: string; // ✅ เปิดจาก public/url ตรงๆ
};

type CertGroup = {
  id: string;
  name: string;
  locked?: boolean; // กันลบกลุ่มระบบ
  items: CertItem[];
};

/* =======================
   UID
======================= */
const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/* =======================
   Storage Key
======================= */
const LS_KEY = "bscct604-certificates-groups-v2-public";

/* =======================
   Helpers
======================= */
function isPDF(type: string, name: string) {
  const t = (type || "").toLowerCase();
  if (t.includes("pdf")) return true;
  return name.toLowerCase().endsWith(".pdf");
}

function isImage(type: string, name: string) {
  const t = (type || "").toLowerCase();
  if (t.startsWith("image/")) return true;
  const n = name.toLowerCase();
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
    return decodeURIComponent(p[p.length - 1] || "file");
  } catch {
    const parts = url.split("/").filter(Boolean);
    return decodeURIComponent(parts[parts.length - 1] || "file");
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

/* =======================
   ✅ STATIC FILE IN public
   public/bscct604/certificates/ใบประกาศฯ.pdf
   => URL: /bscct604/certificates/ใบประกาศฯ.pdf
======================= */
const STATIC_GROUP: CertGroup = {
  id: "public-certificates",
  name: "ใบประกาศ (public/bscct604/certificates)",
  locked: true,
  items: [
    {
      id: "cert-001",
      title: "ใบประกาศ",
      fileName: "ใบประกาศฯ.pdf",
      fileType: "application/pdf",
      size: 0,
      addedAt: Date.now(),
      url: "/bscct604/certificates/ใบประกาศฯ.pdf", // ✅ เปิดตรง
    },
  ],
};

function mergeWithStatic(saved: CertGroup[]) {
  const withoutStatic = (saved || []).filter((g) => g.id !== STATIC_GROUP.id);
  return [STATIC_GROUP, ...withoutStatic];
}

/* =======================
   Page
======================= */
export default function CertificatesPage() {
  const year = new Date().getFullYear();

  const [groups, setGroups] = useState<CertGroup[]>([]);
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
    if (!raw) {
      setGroups([STATIC_GROUP]);
      return;
    }
    try {
      const parsed = JSON.parse(raw) as CertGroup[];
      setGroups(mergeWithStatic(Array.isArray(parsed) ? parsed : []));
    } catch {
      setGroups([STATIC_GROUP]);
    }
  }, []);

  /* ---------- Persist ---------- */
  useEffect(() => {
    if (!groups.length) return;
    localStorage.setItem(LS_KEY, JSON.stringify(groups));
  }, [groups]);

  const totalFiles = useMemo(
    () => groups.reduce((acc, g) => acc + g.items.length, 0),
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

  /* ---------- Add by URL ---------- */
  const addLinkToGroup = (groupId: string, title: string, url: string) => {
    const t = title.trim();
    const u = url.trim();
    if (!t || !u) return;

    const fileName = fileNameFromUrl(u);
    const fileType = guessTypeFromName(fileName);

    const item: CertItem = {
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
        g.id === groupId ? { ...g, items: [item, ...g.items] } : g
      )
    );
  };

  /* ---------- Remove file ---------- */
  const removeFile = (groupId: string, itemId: string) => {
    const g = groups.find((x) => x.id === groupId);
    if (g?.locked) return; // กันลบของระบบ
    setGroups((prev) =>
      prev.map((gg) =>
        gg.id === groupId
          ? { ...gg, items: gg.items.filter((it) => it.id !== itemId) }
          : gg
      )
    );
  };

  /* ---------- Open viewer (✅ เปิด url ตรงๆ + encode) ---------- */
  const openViewer = (item: CertItem) => {
    setViewerOpen(true);
    setViewerTitle(item.title);
    setViewerFileName(item.fileName);
    setViewerType(item.fileType || guessTypeFromName(item.fileName));
    setViewerUrl(encodeURI(item.url)); // ✅ กันชื่อไทย/ฯ
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
            <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-rose-500/25 blur-3xl" />
            <div className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-violet-500/25 blur-3xl" />
          </div>

          <div className="relative p-6 sm:p-8 lg:p-10 space-y-5">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="inline-flex items-center gap-2 rounded-full border border-rose-500/50 bg-rose-500/10 px-3 py-1 text-[11px] font-medium tracking-[0.2em] uppercase text-rose-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-300 animate-pulse" />
                  BSCCT604 • Certificates
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  เกียรติบัตร (Certificates)
                </h1>
                <p className="text-sm text-slate-300">
                  ✅ เปิดไฟล์จาก <span className="text-rose-200">public/</span>{" "}
                  ได้ตรงๆ (เช่น ใบประกาศฯ.pdf)
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  href="/bscct604"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-100 hover:border-rose-500/60 hover:text-rose-100 transition-colors"
                >
                  ← กลับหน้ารายวิชา
                </Link>
                <Link
                  href="/bscct604/works"
                  className="inline-flex items-center gap-2 rounded-full border border-sky-400/70 bg-sky-500/15 px-3 py-1.5 text-sky-50 hover:bg-sky-500/25 hover:shadow-lg hover:shadow-sky-500/25 transition-all"
                >
                  ไปหน้าไฟล์งาน →
                </Link>
              </div>
            </header>

            <div className="border-t border-slate-800/70 pt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Add Group */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <h2 className="text-base font-semibold text-rose-200">
                  เพิ่มหัวข้อเกียรติบัตร
                </h2>

                <div className="mt-3 flex gap-2">
                  <input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="เช่น อบรม / Workshop / รับรอง / โครงงาน"
                    className="flex-1 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-rose-500/60"
                  />
                  <button
                    onClick={addGroup}
                    className="rounded-xl border border-rose-500/50 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/25"
                  >
                    เพิ่ม
                  </button>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  * กลุ่ม “ใบประกาศ (public/...)” ถูกใส่ให้อัตโนมัติแล้ว
                </p>
              </section>

              {/* Summary */}
              <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <h2 className="text-base font-semibold text-violet-200">
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
                  PDF/รูป: พรีวิวในหน้าได้ • ไฟล์อื่น: เปิดแท็บใหม่
                </p>
              </section>
            </div>
          </div>
        </section>

        {/* GROUPS LIST */}
        <section className="space-y-4">
          {groups.map((group) => (
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
                    กด “เปิดดู” เพื่อพรีวิวในหน้านี้
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

              {/* Add by URL */}
              {!group.locked && (
                <div className="mt-4">
                  <AddLinkForm
                    onAdd={(title, url) => addLinkToGroup(group.id, title, url)}
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    ตัวอย่าง URL:{" "}
                    <span className="text-slate-200">
                      /bscct604/certificates/ใบประกาศฯ.pdf
                    </span>
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-xl border border-slate-800 bg-slate-950/40 p-4 hover:border-rose-500/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-100">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.fileName} • {prettySize(item.size)}
                        </p>
                        <p className="text-[11px] text-slate-500 break-all">
                          {item.url}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        <button
                          onClick={() => openViewer(item)}
                          className="text-xs rounded-full border border-rose-500/50 bg-rose-500/10 px-3 py-1.5 text-rose-100 hover:bg-rose-500/20"
                        >
                          เปิดดู
                        </button>

                        <a
                          href={encodeURI(item.url)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs rounded-full border border-violet-400/60 bg-violet-500/10 px-3 py-1.5 text-violet-50 hover:bg-violet-500/20"
                        >
                          เปิดแท็บใหม่
                        </a>

                        {!group.locked && (
                          <button
                            onClick={() => removeFile(group.id, item.id)}
                            className="text-xs rounded-full border border-slate-600/60 bg-slate-900/60 px-3 py-1.5 text-slate-200 hover:border-rose-500/50"
                          >
                            ลบ
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer className="pt-3 border-t border-slate-800/70 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between text-xs sm:text-sm text-slate-400">
          <p>หน้าเกียรติบัตรสำหรับรายวิชา BSCCT604</p>
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
                  className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 hover:border-rose-500/60"
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
                      ไฟล์ชนิดนี้พรีวิวในหน้าไม่ได้โดยตรง
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
        ➕ เพิ่มเกียรติบัตร (ใส่ URL)
      </p>

      <div className="mt-3 flex flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ชื่อเอกสาร (เช่น อบรม Network Security)"
          className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-rose-500/60"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL ไฟล์ (เช่น /bscct604/certificates/ใบประกาศฯ.pdf)"
          className="w-full rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-rose-500/60"
        />
        <button
          onClick={add}
          className="self-start rounded-xl border border-violet-400/60 bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-50 hover:bg-violet-500/25"
        >
          บันทึก
        </button>
      </div>
    </div>
  );
}
