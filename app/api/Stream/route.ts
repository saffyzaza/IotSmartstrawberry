import { NextResponse } from 'next/server';

let lastImage: string = ''; // เก็บภาพในรูปแบบ Base64 ชั่วคราว

export async function POST(request: Request) {
  try {
    const buffer = await request.arrayBuffer();
    // แปลง Binary เป็น Base64 เพื่อให้ส่งไปแสดงบนหน้าเว็บง่ายๆ
    const base64Image = Buffer.from(buffer).toString('base64');
    lastImage = `data:image/jpeg;base64,${base64Image}`;
    
    console.log("Received image from ESP32-CAM");
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ image: lastImage });
}