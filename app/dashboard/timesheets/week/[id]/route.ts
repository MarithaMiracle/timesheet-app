// app/dashboard/timesheets/week/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { mockTimesheetData } from '@/lib/mockData';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // In a real app, you'd filter by userId too. But mock data doesn't have userId.
  const timesheet = mockTimesheetData.find((week) => week.id === params.id);

  if (!timesheet) {
    return NextResponse.json({ error: 'Timesheet not found' }, { status: 404 });
  }

  return NextResponse.json(timesheet, { status: 200 });
}