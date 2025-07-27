// app/api/timesheets/route.ts - Proper API architecture
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { mockTimesheetData } from '@/lib/mockData'; // ✅ API can import mock data
import { getUserAdditions, saveUserAdditions } from '@/lib/sessionStorage';

// Define proper TypeScript interfaces
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
  [key: string]: unknown; // For any additional properties
}

// GET /api/timesheets - API handles data, components don't touch mock data directly
export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // ✅ API layer combines mock data + user additions
    const userAdditions = getUserAdditions();
    
    const combinedData = mockTimesheetData.map(week => {
      const weekCopy = { ...week };
      
      // Add user entries if they exist for this week
      if (userAdditions[week.id] && userAdditions[week.id].length > 0) {
        weekCopy.entries = [...week.entries, ...userAdditions[week.id]];
        // Recalculate total hours with user additions
        // Note: totalHours getter will automatically calculate this
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

// POST /api/timesheets - API handles saving user data
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body: PostRequestBody = await request.json();
    console.log("✅ API received timesheet data:", body);

    // ✅ API handles the business logic of saving user additions
    if (body.weekId && body.entries) {
      const userAdditions = getUserAdditions();
      
      // Add entries to user's additions for this week
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