// app/bscct604/grade/page.tsx
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

type GradeResult = {
  grade: string;
  detail: string;
};

function calculateGrade(score: number): GradeResult {
  if (score >= 80 && score <= 100) {
    return { grade: "A", detail: "ดีเยี่ยม (Excellent)" };
  } else if (score >= 75) {
    return { grade: "B+", detail: "ดีมาก (Very Good)" };
  } else if (score >= 70) {
    return { grade: "B", detail: "ดี (Good)" };
  } else if (score >= 65) {
    return { grade: "C+", detail: "ค่อนข้างดี (Fairly Good)" };
  } else if (score >= 60) {
    return { grade: "C", detail: "ปานกลาง (Fair)" };
  } else if (score >= 55) {
    return { grade: "D+", detail: "พอใช้ (Below Fair)" };
  } else if (score >= 50) {
    return { grade: "D", detail: "ผ่านแบบฉิวเฉียด (Pass)" };
  } else {
    return { grade: "F", detail: "ไม่ผ่าน (Fail)" };
  }
}

export default function GradePage() {
  const [scoreInput, setScoreInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const value = Number(scoreInput);

    if (Number.isNaN(value)) {
      setError("กรุณากรอกคะแนนเป็นตัวเลข");
      return;
    }

    if (value < 0 || value > 100) {
      setError("กรุณากรอกคะแนนระหว่าง 0 – 100");
      return;
    }

    setResult(calculateGrade(value));
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-slate-100">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-sky-400">
              Tools • Grade Calculator
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-50">
              เมนูตัดเกรดรายวิชา
            </h1>
            <p className="text-sm text-slate-400">
              ใส่คะแนน 0–100 แล้วระบบจะคำนวณเกรดตามช่วงคะแนนให้โดยอัตโนมัติ
            </p>
          </div>
          <Link
            href="http://10.70.163.9:3000/"
            className="text-xs sm:text-sm text-sky-300 hover:text-sky-200 underline-offset-4 hover:underline"
          >
            ← กลับหน้าหลัก BSCCT604
          </Link>
        </header>

        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl backdrop-blur-md p-5 sm:p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="score"
                className="block text-sm font-medium text-slate-200"
              >
                คะแนนรวม (0 – 100)
              </label>
              <input
                id="score"
                type="number"
                min={0}
                max={100}
                value={scoreInput}
                onChange={(e) => setScoreInput(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-sky-500/30 focus:ring-2"
                placeholder="เช่น 82, 74.5"
              />
              <p className="text-xs text-slate-500">
                * สามารถใส่ทศนิยมได้ เช่น 79.5
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-sky-500/30 hover:bg-sky-400 active:bg-sky-600 transition-colors"
            >
              คำนวณเกรด
            </button>
          </form>

          {/* Result */}
          {result && (
            <div className="mt-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 space-y-2">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                ผลการตัดเกรด
              </p>
              <p className="text-4xl font-extrabold text-emerald-300">
                {result.grade}
              </p>
              <p className="text-sm text-emerald-100">{result.detail}</p>

              <div className="mt-3 border-t border-emerald-500/30 pt-2 text-xs text-emerald-100/80 space-y-1">
                <p>ช่วงคะแนนที่ใช้ในระบบนี้:</p>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <li>80–100 : A</li>
                  <li>75–79 : B+</li>
                  <li>70–74 : B</li>
                  <li>65–69 : C+</li>
                  <li>60–64 : C</li>
                  <li>55–59 : D+</li>
                  <li>50–54 : D</li>
                  <li>0–49 : F</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
