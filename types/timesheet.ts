// types/timesheet.ts
export interface TimesheetEntry {
    id: string;
    date: string;
    hoursWorked: number;
    status: 'completed' | 'incomplete' | 'missing';
    description: string;
    taskDescription: string; // Added this property
  }
  
  export interface TimesheetWeek {
    id: string;
    week: string; // Added this property
    weekNumber: number;
    startDate: string;
    endDate: string;
    totalHours: number;
    status: 'completed' | 'incomplete' | 'missing';
    entries: TimesheetEntry[];
  }