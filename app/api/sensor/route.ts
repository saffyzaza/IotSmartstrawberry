import { NextResponse } from 'next/server';

// ตัวแปรเก็บค่าล่าสุด (Temporary storage)
let sensorData = {
  distance: 0, temp: 0, hum: 0, ph: 0, ec: 0, co2: 0, light: 0, 
  relay1: false, relay2: false, relay3: false, relay4: true, // relay4 (Pump) เริ่มต้นเป็น true
  lastUpdate: "-"
};

export async function POST(request: Request) {
  const data = await request.json();
  
  // If data contains sensor readings (like distance or temp), 
  // we treat it as a status report from the ESP32.
  // We update sensor values but preserve the relay states set by the web
  // unless the ESP32 is explicitly trying to change them (which it doesn't in this logic).
  if (data.distance !== undefined || data.temp !== undefined) {
    const { relay1, relay2, relay3, relay4, ...sensors } = data;
    sensorData = { 
      ...sensorData, 
      ...sensors, 
      // We could optionally update relay states here if we trust the ESP32 more,
      // but to prevent the "overwrite" bug, we keep existing ones if they differ.
      lastUpdate: new Date().toLocaleTimeString() 
    };
  } else {
    // If it's from the web (no distance/temp), update everything provided (usually relays)
    sensorData = { ...sensorData, ...data, lastUpdate: new Date().toLocaleTimeString() };
  }

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
