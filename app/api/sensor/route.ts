import { NextResponse } from 'next/server';

// ตัวแปรเก็บค่าล่าสุด (Temporary storage)
let sensorData = {
  distance: 0, temp: 0, hum: 0, ph: 0, ec: 0, co2: 0, light: 0, 
  relay1: false, relay2: false, relay3: false, relay4: false,
  lastUpdate: "-"
};

export async function POST(request: Request) {
  const data = await request.json();
  // Merge data, keeping current relay states if not provided in POST
  sensorData = { ...sensorData, ...data, lastUpdate: new Date().toLocaleTimeString() };
  return NextResponse.json({ status: 'success', relays: {
    r1: sensorData.relay1,
    r2: sensorData.relay2,
    r3: sensorData.relay3,
    r4: sensorData.relay4
  }});
}

export async function GET() {
  return NextResponse.json(sensorData);
}
