import { NextResponse } from 'next/server';

// ตัวแปรเก็บภาพชั่วคราว (Base64)
let lastImage = '';

export async function POST(request: Request) {
  try {
    // 1. รับข้อมูลแบบ ArrayBuffer (Binary จาก ESP32)
    const buffer = await request.arrayBuffer();
    
    if (buffer.byteLength === 0) {
      return NextResponse.json({ status: 'error', message: 'Empty buffer' }, { status: 400 });
    }

    // 2. แปลง Binary เป็น Base64 String
    const base64Image = Buffer.from(buffer).toString('base64');
    
    // 3. เก็บลงตัวแปรพร้อม Data URI Scheme
    lastImage = `data:image/jpeg;base64,${base64Image}`;

    // (Optional) ดูใน Console ว่ามีภาพเข้ามาขนาดเท่าไหร่
    console.log(`Received image: ${(buffer.byteLength / 1024).toFixed(2)} KB`);

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error("Stream Error:", error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}

export async function GET() {
  // ส่งภาพล่าสุดกลับไปให้หน้า Dashboard
  return NextResponse.json({ 
    image: lastImage,
    timestamp: new Date().getTime() 
  });
}