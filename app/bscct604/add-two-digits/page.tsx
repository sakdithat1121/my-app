// app/bscct604/add-two-digits/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

type Operator = "+" | "-" | "×" | "÷" | null;

export default function AddTwoDigitsPage() {
  const [display, setDisplay] = useState("0");
  const [firstValue, setFirstValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operator>(null);
  const [waitingForSecond, setWaitingForSecond] = useState(false);
  const [history, setHistory] = useState<string | null>(null);

  const resetAll = () => {
    setDisplay("0");
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecond(false);
    setHistory(null);
  };

  const handleDigit = (digit: string) => {
    setDisplay((prev) => {
      if (waitingForSecond) {
        setWaitingForSecond(false);
        return digit;
      }
      if (prev === "0") return digit;
      if (prev.length > 16) return prev; // กันยาวเกิน
      return prev + digit;
    });
  };

  const handleDot = () => {
    setDisplay((prev) => {
      if (waitingForSecond) {
        setWaitingForSecond(false);
        return "0.";
      }
      if (prev.includes(".")) return prev;
      return prev + ".";
    });
  };

  const performCalculation = (a: number, b: number, op: Operator): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return b === 0 ? NaN : a / b;
      default:
        return b;
    }
  };

  const handleOperator = (nextOp: Operator) => {
    const inputValue = parseFloat(display);

    if (firstValue === null) {
      setFirstValue(display);
    } else if (!waitingForSecond && operator) {
      const current = parseFloat(firstValue);
      const result = performCalculation(current, inputValue, operator);
      const resultStr = Number.isNaN(result) ? "Error" : String(result);
      setDisplay(resultStr);
      setFirstValue(resultStr === "Error" ? null : resultStr);
      setHistory(
        Number.isNaN(result)
          ? `${firstValue} ${operator} ${display} = Error`
          : `${firstValue} ${operator} ${display} = ${resultStr}`
      );
    }

    setOperator(nextOp);
    setWaitingForSecond(true);
  };

  const handleEquals = () => {
    if (operator === null || firstValue === null || waitingForSecond) {
      return;
    }
    const a = parseFloat(firstValue);
    const b = parseFloat(display);
    const result = performCalculation(a, b, operator);
    const resultStr = Number.isNaN(result) ? "Error" : String(result);

    setHistory(
      Number.isNaN(result)
        ? `${firstValue} ${operator} ${display} = Error`
        : `${firstValue} ${operator} ${display} = ${resultStr}`
    );

    setDisplay(resultStr);
    setFirstValue(null);
    setOperator(null);
    setWaitingForSecond(false);
  };

  const handleToggleSign = () => {
    setDisplay((prev) => {
      if (prev === "0" || prev === "Error") return prev;
      if (prev.startsWith("-")) return prev.slice(1);
      return "-" + prev;
    });
  };

  const handlePercent = () => {
    setDisplay((prev) => {
      const num = parseFloat(prev);
      if (Number.isNaN(num)) return prev;
      return String(num / 100);
    });
  };

  const handleClearEntry = () => {
    // ล้างเฉพาะค่าปัจจุบัน
    setDisplay("0");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-slate-100">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-violet-400">
              Tools • Calculator
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-50">
              เครื่องคิดเลข (พื้นฐาน)
            </h1>
            <p className="text-sm text-slate-400">
              ใช้คำนวณบวก ลบ คูณ หาร ได้เหมือนเครื่องคิดเลขทั่วไป
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
          {/* Display */}
          <div className="rounded-2xl border border-violet-500/40 bg-slate-950/60 px-4 py-3 sm:px-5 sm:py-4 shadow-inner flex flex-col gap-1">
            {history && (
              <div className="text-xs sm:text-sm text-slate-500 text-right truncate">
                {history}
              </div>
            )}
            <div className="text-right text-3xl sm:text-4xl font-semibold tracking-tight text-violet-100 break-all">
              {display}
            </div>
          </div>

          {/* Operator status */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              ตัวดำเนินการปัจจุบัน:{" "}
              <span className="font-semibold text-violet-300">
                {operator ?? "-"}
              </span>
            </span>
            <span className="text-slate-500">
              {waitingForSecond
                ? "กำลังรอใส่ตัวเลขตัวที่สอง…"
                : "พร้อมพิมพ์ตัวเลขได้เลย"}
            </span>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {/* แถว 1 */}
            <button
              type="button"
              onClick={resetAll}
              className="py-2 rounded-xl bg-slate-800 text-sm font-semibold text-red-300 hover:bg-red-500/20 border border-red-500/50"
            >
              AC
            </button>
            <button
              type="button"
              onClick={handleClearEntry}
              className="py-2 rounded-xl bg-slate-800 text-sm font-semibold text-amber-300 hover:bg-amber-500/20 border border-amber-500/50"
            >
              C
            </button>
            <button
              type="button"
              onClick={handlePercent}
              className="py-2 rounded-xl bg-slate-800 text-sm font-semibold text-slate-100 hover:bg-slate-700/80"
            >
              %
            </button>
            <button
              type="button"
              onClick={() => handleOperator("÷")}
              className="py-2 rounded-xl bg-violet-600 text-lg font-semibold text-slate-950 hover:bg-violet-500"
            >
              ÷
            </button>

            {/* แถว 2 */}
            <button
              type="button"
              onClick={() => handleDigit("7")}
              className="py-3 rounded-xl bg-slate-800 text-lg font-semibold hover:bg-slate-700/80"
            >
              7
            </button>
            <button
              type="button"
              onClick={() => handleDigit("8")}
              className="py-3 rounded-xl bg-slate-800 text-lg font-semibold hover:bg-slate-700/80"
            >
              8
            </button>
            <button
              type="button"
              onClick={() => handleDigit("9")}
              className="py-3 rounded-xl bg-slate-800 text-lg font-semibold hover:bg-slate-700/80"
            >
              9
            </button>
            <button
              type="button"
              onClick={() => handleOperator("×")}
              className="py-3 rounded-xl bg-violet-600 text-lg font-semibold text-slate-950 hover:bg-violet-500"
            >
              ×
            </button>

            {/* แถว 3 */}
            <button
              type="button"
              onClick={() => handleDigit("4")}
              className="py-3 rounded-xl bg-slate-800 text-lg font-semibold hover:bg-slate-700/80"
            >
              4
            </button>
            <button
              type="button"
              onClick={() => handleDigit("5")}
              className="py-3 rounded-xl bg-slate-800 text-lg font-semibold hover:bg-slate-700/80"
            >
              5
            </button>
            <button
              type="button"
              onClick={() => handleDigit("6")}
              className="py-3 rounded-xl bg-slate-800 text-lg font-semibold hover:bg-slate-700/80"
            >
              6
            </button>
            <button
              type="button"
              onClick={() => handleOperator("-")}
              className="py-3 rounded-xl bg-violet-600 text-lg font-semibold text-slate-950 hover:bg-violet-500"
            >
              −
            </button>

            {/* แถว 4 */}
            <button
              type="button"
              onClick={() => handleDigit("1")}
              className="py-3 rounded-xl bg-slate-800 text-lg font-semibold hover:bg-slate-700/80"
            >
              1
            </button>
            <button
              type="button"
              onClick={() => handleDigit("2")}
              className="py-3 rounded-xl bg-slate-800 text-lg font-semibold hover:bg-slate-700/80"
            >
              2
            </button>
            <button
              type="button"
              onClick={() => handleDigit("3")}
              className="py-3 rounded-xl bg-slate-800 text-lg font-semibold hover:bg-slate-700/80"
            >
              3
            </button>
            <button
              type="button"
              onClick={() => handleOperator("+")}
              className="py-3 rounded-xl bg-violet-600 text-lg font-semibold text-slate-950 hover:bg-violet-500"
            >
              +
            </button>

            {/* แถว 5 */}
            <button
              type="button"
              onClick={handleToggleSign}
              className="py-3 rounded-xl bg-slate-800 text-lg font-semibold hover:bg-slate-700/80"
            >
              ±
            </button>
            <button
              type="button"
              onClick={() => handleDigit("0")}
              className="py-3 rounded-xl bg-slate-800 text-lg font-semibold hover:bg-slate-700/80"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleDot}
              className="py-3 rounded-xl bg-slate-800 text-lg font-semibold hover:bg-slate-700/80"
            >
              .
            </button>
            <button
              type="button"
              onClick={handleEquals}
              className="py-3 rounded-xl bg-emerald-500 text-lg font-semibold text-slate-950 hover:bg-emerald-400"
            >
              =
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
