// app/bscct604/add-two-digits/page.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";

type Question = {
  a: number;
  b: number;
};

function randomTwoDigit(): number {
  // สุ่มเลข 2 หลัก 10–99
  return Math.floor(Math.random() * 90) + 10;
}

function createQuestion(): Question {
  return {
    a: randomTwoDigit(),
    b: randomTwoDigit(),
  };
}

export default function AddTwoDigitsPage() {
  const [question, setQuestion] = useState<Question>(() => createQuestion());
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    // ล้าง feedback เมื่อมีโจทย์ใหม่
    setFeedback(null);
    setIsCorrect(null);
    setAnswer("");
  }, [question.a, question.b]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const userAns = Number(answer);
    const correct = question.a + question.b;

    if (Number.isNaN(userAns)) {
      setFeedback("กรุณากรอกคำตอบเป็นตัวเลข");
      setIsCorrect(null);
      return;
    }

    if (userAns === correct) {
      setFeedback("ถูกต้อง! เก่งมาก 🎉");
      setIsCorrect(true);
      setCount((c) => c + 1);
    } else {
      setFeedback(`ยังไม่ถูก ลองดูใหม่อีกครั้งนะ (คำตอบที่ถูกคือ ${correct})`);
      setIsCorrect(false);
    }
  };

  const nextQuestion = () => {
    setQuestion(createQuestion());
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-slate-100">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-violet-400">
              Tools • Math Practice
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-50">
              เมนูบวกเลข 2 หลัก
            </h1>
            <p className="text-sm text-slate-400">
              แบบฝึกหัดบวกเลขสองหลัก
              เหมาะสำหรับกิจกรรมในชั้นเรียนหรือฝึกฝนด้วยตัวเอง
            </p>
          </div>
          <Link
            href="http://10.70.163.2:3000/"
            className="text-xs sm:text-sm text-sky-300 hover:text-sky-200 underline-offset-4 hover:underline"
          >
            ← กลับหน้าหลัก BSCCT604ัั
          </Link>
        </header>

        {/* Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl backdrop-blur-md p-5 sm:p-6 space-y-5">
          {/* Info bar */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              ข้อที่ตอบถูกทั้งหมด:{" "}
              <span className="text-emerald-300 font-semibold">{count}</span>
            </span>
            <span className="text-slate-500">
              โจทย์สุ่มจากเลข 10–99 ทั้งสองตัว
            </span>
          </div>

          {/* Question */}
          <div className="mt-2 flex flex-col items-center gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              QUESTION
            </p>
            <div className="rounded-2xl border border-violet-500/40 bg-violet-500/10 px-6 py-4 text-center shadow-xl shadow-violet-500/20">
              <p className="text-sm text-slate-300 mb-1">
                บวกเลขสองหลักต่อไปนี้:
              </p>
              <p className="text-4xl font-extrabold text-violet-200 tracking-widest">
                {question.a} + {question.b} = ?
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-3">
            <div className="space-y-2">
              <label
                htmlFor="answer"
                className="block text-sm font-medium text-slate-200 text-center"
              >
                ใส่คำตอบของคุณ
              </label>
              <input
                id="answer"
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-center text-lg text-slate-100 outline-none ring-violet-500/30 focus:ring-2"
                placeholder="เช่น 145"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-violet-500/30 hover:bg-violet-400 active:bg-violet-600 transition-colors"
              >
                ตรวจคำตอบ
              </button>
              <button
                type="button"
                onClick={nextQuestion}
                className="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-100 hover:border-sky-500 hover:text-sky-200 transition-colors"
              >
                ข้อต่อไป (สุ่มโจทย์ใหม่)
              </button>
            </div>
          </form>

          {/* Feedback */}
          {feedback && (
            <div
              className={`mt-3 rounded-2xl px-4 py-3 text-sm border ${
                isCorrect === true
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-100"
                  : isCorrect === false
                  ? "border-red-500/60 bg-red-500/10 text-red-100"
                  : "border-slate-600 bg-slate-800 text-slate-100"
              }`}
            >
              {feedback}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
