import { NextRequest, NextResponse } from 'next/server';
import { getCombinedTimesheetData } from '@/lib/hybridMockData';
import { auth } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

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
  [key: string]: unknown;
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

  const allTimesheets = getCombinedTimesheetData();
  
  const timesheet = allTimesheets.find((week) => week.id === id);

  if (!timesheet) {
    return NextResponse.json({ error: 'Timesheet not found' }, { status: 404 });
  }

  return NextResponse.json(timesheet, { status: 200 });
}

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

    const { getUserAdditions, saveUserAdditions } = await import('@/lib/sessionStorage');
    
    if (body.entries) {
      const userAdditions = getUserAdditions();
      
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