import { NextResponse } from 'next/server';

// ใช้ Global เพื่อไม่ให้ตัวแปรถูกล้างบ่อยในโหมด Dev
let lastImage = '';

export async function POST(request: Request) {
  try {
    const buffer = await request.arrayBuffer();
    if (buffer.byteLength > 0) {
      const base64Image = Buffer.from(buffer).toString('base64');
      lastImage = `data:image/jpeg;base64,${base64Image}`;
      return NextResponse.json({ status: 'success' });
    }
    return NextResponse.json({ status: 'empty' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    image: lastImage, 
    timestamp: Date.now() 
  });
}