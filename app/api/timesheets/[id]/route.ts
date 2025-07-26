// app/api/timesheets/[id]/route.ts
import { NextResponse } from 'next/server';
import { mockTimesheetData } from '@/lib/mockData'; // Your mock data
import { auth } from '@/lib/auth'; // Your server-side auth helper

// GET /api/timesheets/[id] - Fetch a single timesheet
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = params; // Extract the dynamic 'id' from the URL

  // Find the timesheet in your mock data
  const timesheet = mockTimesheetData.find(week => week.id === id);

  if (timesheet) {
    return NextResponse.json(timesheet, { status: 200 });
  } else {
    return new NextResponse('Timesheet not found', { status: 404 });
  }
}

// PUT /api/timesheets/[id] - Update a single timesheet
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = params;
  const body = await request.json(); // Get the updated data from the request body

  // In a real app, you'd update a database entry.
  // For mock data, you'd find and modify the entry (caution: this won't persist across server restarts)
  const timesheetIndex = mockTimesheetData.findIndex(week => week.id === id);

  if (timesheetIndex !== -1) {
    // Merge existing data with updated data
    mockTimesheetData[timesheetIndex] = { ...mockTimesheetData[timesheetIndex], ...body };
    return NextResponse.json(mockTimesheetData[timesheetIndex], { status: 200 });
  } else {
    return new NextResponse('Timesheet not found', { status: 404 });
  }
}

// DELETE /api/timesheets/[id] - Delete a single timesheet
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = params;

  const initialLength = mockTimesheetData.length;
  // Filter out the deleted timesheet (again, won't persist across restarts for mock data)
  const updatedData = mockTimesheetData.filter(week => week.id !== id);
  mockTimesheetData.splice(0, mockTimesheetData.length, ...updatedData); // "Mutate" the original array

  if (mockTimesheetData.length < initialLength) {
    return new NextResponse(null, { status: 204 }); // 204 No Content for successful deletion
  } else {
    return new NextResponse('Timesheet not found', { status: 404 });
  }
}