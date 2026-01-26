import { NextResponse } from 'next/server';

// ตัวแปรเก็บค่าล่าสุด (Temporary storage)
let sensorData = {
  distance: 0, temp: 0, hum: 0, ph: 0, ec: 0, co2: 0, light: 0, 
  relay1: false, relay2: false, relay3: false, relay4: true, 
  lastUpdate: "-",
  // เพิ่มตัวเก็บเวลาที่กดมือล่าสุด เพื่อป้องกันตารางเวลาทับซ้อนชั่วคราว
  manualOverwrites: {} as Record<string, number>,
  schedules: {
    relay1: { days: [1,2,3,4,5], startTime: "08:00", duration: 5 },
    relay2: { days: [1,2,3,4,5], startTime: "18:00", duration: 60 },
    relay3: { days: [1,2,3,4,5], startTime: "12:00", duration: 30 },
    relay4: { days: [1,2,3,4,5], startTime: "06:00", duration: 10 },
  },
  automationRules: {
    temp: { threshold: 40, condition: "above", action: "off", relay: "none", enabled: false },
    hum: { threshold: 90, condition: "above", action: "off", relay: "none", enabled: false },
    co2: { threshold: 1500, condition: "above", action: "off", relay: "none", enabled: false },
    light: { threshold: 8000, condition: "above", action: "off", relay: "none", enabled: false },
    distance: { threshold: 10, condition: "above", action: "off", relay: "none", enabled: false },
    ph: { threshold: 8, condition: "above", action: "off", relay: "none", enabled: false },
    ec: { threshold: 3, condition: "above", action: "off", relay: "none", enabled: false },
  }
};

function updateRelayStatesBySchedule(excludedRelays: string[] = []) {
  // ปรับเวลาให้เป็น Asia/Bangkok (UTC+7)
  const now = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
  const currentTime = now.getTime();
  const currentDay = now.getDay(); // 0 (Sun) - 6 (Sat)
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();
  const currentTotalMinutes = (currentHour * 60) + currentMin;

  const relayKeys = ['relay1', 'relay2', 'relay3', 'relay4'] as const;
  
  // 1. Apply Schedule Logic
  relayKeys.forEach(key => {
    // ถ้ามีการกดมือ (Manual) และยังไม่เกิน 10 นาที ให้ข้ามตารางเวลา
    const lastManualTime = sensorData.manualOverwrites[key] || 0;
    if (currentTime - lastManualTime < 10 * 60 * 1000) {
      return; 
    }

    if (excludedRelays.includes(key)) return; 
    
    const sched = sensorData.schedules[key];
    
    // ถ้ามีการเลือกวันทำงาน (ถือว่าเปิดใช้งานตาราง) หรือตั้งเปิดตลอด
    if (sched.duration === -1) {
      sensorData[key] = true;
      return;
    }

    if (sched.days && sched.days.length > 0) {
      if (sched.days.includes(currentDay)) {
        const [startHour, startMin] = (sched.startTime || "00:00").split(':').map(Number);
        const startTotalMinutes = (startHour * 60) + startMin;
        const endTotalMinutes = startTotalMinutes + (sched.duration || 0);

        if (currentTotalMinutes >= startTotalMinutes && currentTotalMinutes < endTotalMinutes) {
          sensorData[key] = true;
        } else {
          sensorData[key] = false;
        }
      }
    }
  });

  // 2. Apply Automation Rules
  Object.entries(sensorData.automationRules).forEach(([sensor, rule]) => {
    if (rule.enabled && rule.relay !== "none") {
      const currentValue = sensorData[sensor as keyof typeof sensorData];
      if (typeof currentValue === 'number') {
        const isTriggered = rule.condition === "above" 
          ? currentValue > rule.threshold 
          : currentValue < rule.threshold;

        if (isTriggered) {
          // Action: Set relay state
          const relayKey = rule.relay as keyof typeof sensorData;
          if (relayKey.startsWith('relay')) {
            (sensorData as any)[relayKey] = rule.action === "on";
          }
        }
      }
    }
  });
}

export async function POST(request: Request) {
  const data = await request.json();
  
  if (data.schedules) {
    sensorData.schedules = { ...sensorData.schedules, ...data.schedules };
  } else if (data.automationRules) {
    sensorData.automationRules = { ...sensorData.automationRules, ...data.automationRules };
  } else {
    // Sensor update from ESP32 OR Manual toggle from Web
    if (data.distance !== undefined || data.temp !== undefined) {
      sensorData.lastUpdate = new Date().toLocaleTimeString("th-TH", {timeZone: "Asia/Bangkok"});
    }
    
    // เก็บรายชื่อ relay ที่มีการสั่งงานด้วยมือ
    const manualRelays = Object.keys(data).filter(key => key.startsWith('relay'));
    const now = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
    
    manualRelays.forEach(key => {
      sensorData.manualOverwrites[key] = now.getTime();
    });
    
    sensorData = { ...sensorData, ...data };
    
    // Apply schedule logic, but skip manually toggled relays in this request
    updateRelayStatesBySchedule(manualRelays);

    return NextResponse.json({ status: 'success', relays: {
      r1: sensorData.relay1,
      r2: sensorData.relay2,
      r3: sensorData.relay3,
      r4: sensorData.relay4
    }});
  }

  // Fallback for schedule/automation updates
  updateRelayStatesBySchedule();

  return NextResponse.json({ status: 'success', relays: {
    r1: sensorData.relay1,
    r2: sensorData.relay2,
    r3: sensorData.relay3,
    r4: sensorData.relay4
  }});
}

export async function GET() {
  updateRelayStatesBySchedule();
  return NextResponse.json(sensorData);
}
