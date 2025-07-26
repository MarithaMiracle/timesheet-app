import { NextResponse } from 'next/server';
import { mockTimesheetData, TimesheetWeek } from '@/lib/mockData';
import { auth } from '@/lib/auth';

// GET /api/timesheets
export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  return NextResponse.json(mockTimesheetData, { status: 200 });
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

    return NextResponse.json({ message: 'Timesheet entry saved!', entry: body }, { status: 200 });
  } catch (error) {
    console.error("❌ Error saving timesheet:", error);
    return new NextResponse('Failed to save timesheet', { status: 500 });
  }
}
