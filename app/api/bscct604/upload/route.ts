import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return new NextResponse("ไม่พบไฟล์ที่อัปโหลด", { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ป้องกันชื่อไฟล์มั่ว ๆ / หัก path
    const originalName = file.name.replace(/[^a-zA-Z0-9._-ก-๙]/g, "_");
    const timeStamp = Date.now();
    const fileName = `${timeStamp}-${originalName}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "bscct604");

    // ถ้าโฟลเดอร์ยังไม่มีให้สร้าง
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json(
      {
        success: true,
        fileName,
        url: `/uploads/bscct604/${fileName}`,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return new NextResponse(err?.message || "เกิดข้อผิดพลาดในการอัปโหลดไฟล์", {
      status: 500,
    });
  }
}
