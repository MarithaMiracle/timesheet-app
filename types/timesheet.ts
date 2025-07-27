export interface TimesheetEntry {
    id: string;
    date: string;
    hoursWorked: number;
    status: 'completed' | 'incomplete' | 'missing';
    description: string;
    taskDescription: string;
  }
  
  export interface TimesheetWeek {
    id: string;
    week: string;
    weekNumber: number;
    startDate: string;
    endDate: string;
    totalHours: number;
    status: 'completed' | 'incomplete' | 'missing';
    entries: TimesheetEntry[];
  }