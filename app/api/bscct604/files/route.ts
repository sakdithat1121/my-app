import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

export async function GET(_req: NextRequest) {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "bscct604");

    // ถ้าโฟลเดอร์ยังไม่มี ให้ส่ง array ว่าง
    try {
      await fs.access(uploadDir);
    } catch {
      return NextResponse.json([], { status: 200 });
    }

    const entries = await fs.readdir(uploadDir, { withFileTypes: true });

    const files = await Promise.all(
      entries
        .filter((entry) => entry.isFile())
        .map(async (entry) => {
          const fullPath = path.join(uploadDir, entry.name);
          const stat = await fs.stat(fullPath);

          return {
            name: entry.name,
            url: `/uploads/bscct604/${entry.name}`,
            size: stat.size,
          };
        })
    );

    // sort ใหม่ ให้ไฟล์ใหม่สุดอยู่บน
    files.sort((a, b) => (a.name < b.name ? 1 : -1));

    return NextResponse.json(files, { status: 200 });
  } catch (err: any) {
    console.error("LIST FILES ERROR:", err);
    return new NextResponse(
      err?.message || "เกิดข้อผิดพลาดในการดึงรายการไฟล์",
      { status: 500 }
    );
  }
}
