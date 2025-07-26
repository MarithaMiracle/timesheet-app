// app/api/timesheets/route.ts - Updated to use hybrid system
import { NextResponse } from 'next/server';
import { getCombinedTimesheetData, addEntryToWeek } from '@/lib/hybridMockData';
import { auth } from '@/lib/auth';

// GET /api/timesheets
export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Get original mock data + any additional user data
  const data = getCombinedTimesheetData();
  return NextResponse.json(data, { status: 200 });
}

// POST /api/timesheets
export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("✅ New timesheet entry received:", body);

    // If the request includes a weekId, add entry to that week
    if (body.weekId && body.entry) {
      addEntryToWeek(body.weekId, body.entry);
      return NextResponse.json({ message: 'Entry added to existing week!', entry: body.entry }, { status: 200 });
    }

    return NextResponse.json({ message: 'Timesheet entry saved!', entry: body }, { status: 200 });
  } catch (error) {
    console.error("❌ Error saving timesheet:", error);
    return new NextResponse('Failed to save timesheet', { status: 500 });
  }
}