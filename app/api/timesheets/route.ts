import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { mockTimesheetData } from '@/lib/mockData';
import { getUserAdditions, saveUserAdditions } from '@/lib/sessionStorage';

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

interface PostRequestBody {
  weekId?: string;
  entries?: TimesheetEntry[];
  [key: string]: unknown;
}

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    
    const userAdditions = getUserAdditions();
    
    const combinedData = mockTimesheetData.map(week => {
      const weekCopy = { ...week };
      
      if (userAdditions[week.id] && userAdditions[week.id].length > 0) {
        weekCopy.entries = [...week.entries, ...userAdditions[week.id]];
      }
      
      return weekCopy;
    });

    console.log("📊 API returning combined timesheet data");
    return NextResponse.json(combinedData, { status: 200 });

  } catch (error) {
    console.error("❌ API Error fetching timesheets:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body: PostRequestBody = await request.json();
    console.log("✅ API received timesheet data:", body);

    if (body.weekId && body.entries) {
      const userAdditions = getUserAdditions();
      
      if (!userAdditions[body.weekId]) {
        userAdditions[body.weekId] = [];
      }
      
      body.entries.forEach((entry: TimesheetEntry) => {
        const newEntry = {
          id: entry.id || `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          projectId: entry.projectId || 'USER_PROJECT',
          projectName: entry.projectName || entry.project || 'User Project',
          date: entry.date,
          hours: entry.hours || entry.hoursWorked || 0,
          description: entry.description || entry.taskDescription || '',
          hoursWorked: entry.hours || entry.hoursWorked || 0,
          taskDescription: entry.description || entry.taskDescription || '',
          project: entry.projectName || entry.project || 'User Project'
        };
        
        userAdditions[body.weekId!].push(newEntry);
      });
      
      saveUserAdditions(userAdditions);
      
      return NextResponse.json({ 
        message: 'Entries added successfully!', 
        weekId: body.weekId,
        entriesCount: body.entries.length 
      }, { status: 200 });
    }

    return NextResponse.json({ message: 'Data received' }, { status: 200 });

  } catch (error) {
    console.error("❌ API Error saving timesheet:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}