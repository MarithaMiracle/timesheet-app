// app/api/timesheets/[id]/route.ts - Complete with GET and PUT
import { NextRequest, NextResponse } from 'next/server';
import { getCombinedTimesheetData } from '@/lib/hybridMockData';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Define proper types instead of using 'any'
interface TimesheetEntry {
  id?: string;
  projectId?: string;
  projectName?: string;
  project?: string;
  date: string;
  hours?: number;
  hoursWorked?: number;
  description?: string;
  taskDescription?: string;
}

interface TimesheetUpdateBody {
  entries?: TimesheetEntry[];
  [key: string]: unknown; // For any additional properties
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Get ALL combined data (original + user additions)
  const allTimesheets = getCombinedTimesheetData();
  
  // Find the specific week the user requested
  const timesheet = allTimesheets.find((week) => week.id === id);

  if (!timesheet) {
    return NextResponse.json({ error: 'Timesheet not found' }, { status: 404 });
  }

  // Return the complete week data including all user additions
  return NextResponse.json(timesheet, { status: 200 });
}

// ADD THIS PUT HANDLER
export async function PUT(
  req: NextRequest,
  { params }: RouteParams
) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body: TimesheetUpdateBody = await req.json();
    console.log("✅ Updating timesheet:", id, body);

    // Import the session storage functions
    const { getUserAdditions, saveUserAdditions } = await import('@/lib/sessionStorage');
    
    // Handle updating entries for this specific week
    if (body.entries) {
      const userAdditions = getUserAdditions();
      
      // Replace/update user additions for this week
      userAdditions[id] = body.entries.map((entry: TimesheetEntry) => ({
        id: entry.id || `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        projectId: entry.projectId || 'USER_PROJECT',
        projectName: entry.projectName || entry.project || 'User Project',
        date: entry.date,
        hours: entry.hours || entry.hoursWorked || 0,
        description: entry.description || entry.taskDescription || '',
        hoursWorked: entry.hours || entry.hoursWorked || 0,
        taskDescription: entry.description || entry.taskDescription || '',
        project: entry.projectName || entry.project || 'User Project'
      }));
      
      saveUserAdditions(userAdditions);
      
      return NextResponse.json({ 
        message: 'Timesheet updated successfully!', 
        weekId: id,
        entriesCount: body.entries.length
      }, { status: 200 });
    }

    return NextResponse.json({ 
      message: 'Timesheet updated successfully!', 
      data: body 
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error updating timesheet:", error);
    return NextResponse.json({ error: 'Failed to update timesheet' }, { status: 500 });
  }
}