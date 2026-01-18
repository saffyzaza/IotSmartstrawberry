import { NextResponse } from 'next/server';

// In-memory storage for demonstration. 
// In production, use a database or file system.
let cameraConfig = {
  interval: 10000,
  serverUrl: "http://210.246.215.136:3000/api/Stream"
};

export async function GET() {
  return NextResponse.json(cameraConfig);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.interval) cameraConfig.interval = Number(body.interval);
    if (body.serverUrl) cameraConfig.serverUrl = body.serverUrl;
    
    return NextResponse.json({ success: true, config: cameraConfig });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
  }
}
