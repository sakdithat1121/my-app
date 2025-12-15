// app/bscct604/certificates/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

/* =======================
   Types
======================= */
type CertItem = {
  id: string; // key for IndexedDB
  title: string;
  fileName: string;
  fileType: string;
  size: number;
  addedAt: number;
};

type CertGroup = {
  id: string;
  name: string;
  items: CertItem[];
};

/* =======================
   UID (no crypto.randomUUID)
======================= */
const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

/* =======================
   Storage Keys
======================= */
const LS_KEY = "bscct604-certificates-groups-v1";

/* =======================
   IndexedDB (store blobs)
======================= */
const DB_NAME = "bscct604-certificates-db";
const DB_VERSION = 1;
const STORE_FILES = "files";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_FILES)) {
        db.createObjectStore(STORE_FILES);
      }
    };
    req.onsuccess = () => resolve(req.result);
  });
}

async function idbPutBlob(key: string, value: Blob): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_FILES, "readwrite");
    tx.onerror = () => reject(tx.error);
    tx.oncomplete = () => resolve();
    tx.objectStore(STORE_FILES).put(value, key);
  });
  db.close();
}

async function idbGetBlob(key: string): Promise<Blob | null> {
  const db = await openDB();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(STORE_FILES, "readonly");
    tx.onerror = () => reject(tx.error);
    const req = tx.objectStore(STORE_FILES).get(key);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve((req.result as Blob) ?? null);
  });
  db.close();
  return blob;
}

async function idbDelete(key: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_FILES, "readwrite");
    tx.onerror = () => reject(tx.error);
    tx.oncomplete = () => resolve();
    tx.objectStore(STORE_FILES).delete(key);
  });
  db.close();
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
  const [viewerLoading, setViewerLoading] = useState(false);

  const lastUrlRef = useRef<string | null>(null);
  useEffect(() => {
    return () => {
      if (lastUrlRef.current) URL.revokeObjectURL(lastUrlRef.current);
    };
  }, []);

  /* ---------- Load from localStorage ---------- */
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        setGroups(JSON.parse(raw));
      } catch {
        setGroups([]);
      }
    } else {
      setGroups([]);
    }
  }, []);

  /* ---------- Persist to localStorage ---------- */
  useEffect(() => {
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

  /* ---------- Remove group (delete its blobs) ---------- */
  const removeGroup = async (groupId: string) => {
    const target = groups.find((g) => g.id === groupId);
    if (!target) return;

    await Promise.all(target.items.map((it) => idbDelete(it.id)));
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  /* ---------- Add certificate (store blob to IndexedDB) ---------- */
  const addFileToGroup = async (
    groupId: string,
    title: string,
    file?: File
  ) => {
    const t = title.trim();
    if (!t || !file) return;

    const id = uid();
    await idbPutBlob(id, file);

    const item: CertItem = {
      id,
      title: t,
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      size: file.size,
      addedAt: Date.now(),
    };

    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, items: [item, ...g.items] } : g
      )
    );
  };

  /* ---------- Remove file ---------- */
  const removeFile = async (groupId: string, itemId: string) => {
    await idbDelete(itemId);
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, items: g.items.filter((it) => it.id !== itemId) }
          : g
      )
    );
  };

  /* ---------- Open viewer ---------- */
  const openViewer = async (item: CertItem) => {
    setViewerOpen(true);
    setViewerTitle(item.title);
    setViewerFileName(item.fileName);
    setViewerType(item.fileType);
    setViewerLoading(true);

    if (lastUrlRef.current) {
      URL.revokeObjectURL(lastUrlRef.current);
      lastUrlRef.current = null;
    }
    setViewerUrl(null);

    const blob = await idbGetBlob(item.id);
    if (!blob) {
      setViewerLoading(false);
      setViewerUrl(null);
      return;
    }

    const url = URL.createObjectURL(blob);
    lastUrlRef.current = url;
    setViewerUrl(url);
    setViewerLoading(false);
  };

  const closeViewer = () => {
    setViewerOpen(false);
    setViewerTitle("");
    setViewerFileName("");
    setViewerType("");
    setViewerLoading(false);

    if (lastUrlRef.current) {
      URL.revokeObjectURL(lastUrlRef.current);
      lastUrlRef.current = null;
    }
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
                  เพิ่มหัวข้อ + เพิ่มไฟล์เกียรติบัตร + เปิดดูได้เลยในหน้านี้
                  (เก็บไฟล์จริงใน IndexedDB)
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
                  * หัวข้อ/รายการเก็บใน localStorage, ตัวไฟล์เก็บใน IndexedDB
                  (รีเฟรชไม่หาย)
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
                  เปิดดู PDF/รูปในหน้าได้ทันที • ไฟล์อื่นจะเป็นดาวน์โหลด
                </p>
              </section>
            </div>
          </div>
        </section>

        {/* GROUPS LIST */}
        <section className="space-y-4">
          {groups.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-slate-300">
              ยังไม่มีหัวข้อ → สร้างหัวข้อด้านบนก่อน
              แล้วค่อยเพิ่มไฟล์เกียรติบัตรได้เลย
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
                    </h2>
                    <p className="text-sm text-slate-300 mt-1">
                      เพิ่มไฟล์แล้วกด “เปิดดู” เพื่อเปิดในหน้านี้
                    </p>
                  </div>

                  <button
                    onClick={() => removeGroup(group.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-400/50 bg-rose-500/10 px-3 py-1.5 text-rose-100 hover:bg-rose-500/20"
                    title="ลบหัวข้อและไฟล์ทั้งหมดในหัวข้อนี้"
                  >
                    ลบหัวข้อ
                  </button>
                </div>

                <div className="mt-4">
                  <AddCertForm
                    onAdd={(title, file) =>
                      addFileToGroup(group.id, title, file)
                    }
                  />
                </div>

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
                            <p className="text-[11px] text-slate-500">
                              {new Date(item.addedAt).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 items-end">
                            <button
                              onClick={() => openViewer(item)}
                              className="text-xs rounded-full border border-rose-500/50 bg-rose-500/10 px-3 py-1.5 text-rose-100 hover:bg-rose-500/20"
                            >
                              เปิดดู
                            </button>
                            <button
                              onClick={() => removeFile(group.id, item.id)}
                              className="text-xs rounded-full border border-slate-600/60 bg-slate-900/60 px-3 py-1.5 text-slate-200 hover:border-rose-500/50"
                              title="ลบไฟล์"
                            >
                              ลบ
                            </button>
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
                {viewerLoading ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-slate-300">
                    กำลังโหลดไฟล์...
                  </div>
                ) : !viewerUrl ? (
                  <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 p-6 text-rose-100">
                    ไม่พบไฟล์ใน IndexedDB (อาจถูกลบ / เคลียร์ข้อมูลเบราว์เซอร์)
                  </div>
                ) : isImage(viewerType) ? (
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
                      (ดาวน์โหลดไปเปิดภายนอกได้)
                    </p>
                    <a
                      href={viewerUrl}
                      download={viewerFileName}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-500/15 px-4 py-2 text-sm text-emerald-50 hover:bg-emerald-500/25"
                    >
                      ดาวน์โหลดไฟล์ →
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
   AddCertForm
======================= */
function AddCertForm({
  onAdd,
}: {
  onAdd: (title: string, file?: File) => Promise<void> | void;
}) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [busy, setBusy] = useState(false);
  const inputId = useMemo(() => `cert-file-${uid()}`, []);

  const add = async () => {
    if (!title.trim() || !file) return;
    setBusy(true);
    try {
      await onAdd(title, file);
      setTitle("");
      setFile(undefined);
      const input = document.getElementById(inputId) as HTMLInputElement | null;
      if (input) input.value = "";
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/30 p-4">
      <p className="text-sm font-semibold text-slate-100">
        ➕ เพิ่มเกียรติบัตร
      </p>

      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ชื่อเกียรติบัตร/เอกสาร (เช่น อบรม Network Security)"
          className="flex-1 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-rose-500/60"
        />
        <input
          id={inputId}
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0])}
          className="text-sm text-slate-200"
        />
        <button
          onClick={add}
          disabled={busy}
          className="rounded-xl border border-violet-400/60 bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-50 hover:bg-violet-500/25 disabled:opacity-60"
        >
          {busy ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </div>

      <p className="mt-2 text-xs text-slate-400">
        * ไฟล์ถูกเก็บจริงใน IndexedDB (ล้างข้อมูลเบราว์เซอร์/โหมดไม่ระบุตัวตน
        ไฟล์จะหาย)
      </p>
    </div>
  );
}

/* =======================
   Helpers
======================= */
function isPDF(type: string, name: string) {
  const t = (type || "").toLowerCase();
  if (t.includes("pdf")) return true;
  return name.toLowerCase().endsWith(".pdf");
}

function isImage(type: string) {
  const t = (type || "").toLowerCase();
  return t.startsWith("image/");
}

function prettySize(bytes: number) {
  const b = Number(bytes || 0);
  if (b < 1024) return `${b} B`;
  const kb = b / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}
