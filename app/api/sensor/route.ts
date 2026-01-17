import { NextResponse } from 'next/server';

// ตัวแปรเก็บค่าล่าสุด (Temporary storage)
let sensorData = {
  distance: 0, temp: 0, hum: 0, ph: 0, ec: 0, co2: 0, light: 0, lastUpdate: "-"
};

export async function POST(request: Request) {
  const data = await request.json();
  sensorData = { ...data, lastUpdate: new Date().toLocaleTimeString() };
  return NextResponse.json({ status: 'success' });
}

export async function GET() {
  return NextResponse.json(sensorData);
}
