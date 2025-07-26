// lib/mockData.ts

export interface TimesheetEntry {
    id: string;
    projectId: string;
    projectName: string;
    date: string; // YYYY-MM-DD
    hours: number;
    description: string;
  }
  
  export interface TimesheetWeek {
    id: string; // Unique ID for the week (e.g., 'week-1')
    weekNumber: number;
    startDate: string; // YYYY-MM-DD (e.g., '2024-07-01')
    endDate: string; // YYYY-MM-DD (e.g., '2024-07-07')
    status: 'Pending' | 'Approved' | 'Rejected' | 'Submitted';
    entries: TimesheetEntry[]; // Nested entries for that week
  }
  
  export const mockTimesheetData: TimesheetWeek[] = [
    {
      id: 'week-1',
      weekNumber: 27,
      startDate: '2024-06-30',
      endDate: '2024-07-06',
      status: 'Approved',
      entries: [
        { id: 'entry-1-1', projectId: 'P001', projectName: 'Website Redesign', date: '2024-06-30', hours: 8, description: 'Worked on homepage layout.' },
        { id: 'entry-1-2', projectId: 'P002', projectName: 'Mobile App Feature', date: '2024-07-01', hours: 7, description: 'Implemented user profile screen.' },
        { id: 'entry-1-3', projectId: 'P001', projectName: 'Website Redesign', date: '2024-07-01', hours: 1, description: 'Bug fixing on contact form.' },
      ],
    },
    {
      id: 'week-2',
      weekNumber: 28,
      startDate: '2024-07-07',
      endDate: '2024-07-13',
      status: 'Pending',
      entries: [
        { id: 'entry-2-1', projectId: 'P003', projectName: 'CRM Integration', date: '2024-07-07', hours: 8, description: 'Configured Salesforce API.' },
        { id: 'entry-2-2', projectId: 'P001', projectName: 'Website Redesign', date: '2024-07-08', hours: 6, description: 'Developed product detail page.' },
      ],
    },
    {
      id: 'week-3',
      weekNumber: 29,
      startDate: '2024-07-14',
      endDate: '2024-07-20',
      status: 'Submitted',
      entries: [
        { id: 'entry-3-1', projectId: 'P004', projectName: 'Internal Tools', date: '2024-07-14', hours: 8, description: 'Built data import script.' },
        { id: 'entry-3-2', projectId: 'P003', projectName: 'CRM Integration', date: '2024-07-15', hours: 4, description: 'Debugging sync issues.' },
      ],
    },
    {
      id: 'week-4',
      weekNumber: 30,
      startDate: '2024-07-21',
      endDate: '2024-07-27',
      status: 'Pending',
      entries: [
        { id: 'entry-4-1', projectId: 'P005', projectName: 'Marketing Campaign', date: '2024-07-21', hours: 8, description: 'Designed email templates.' },
        { id: 'entry-4-2', projectId: 'P005', projectName: 'Marketing Campaign', date: '2024-07-22', hours: 8, description: 'Set up A/B tests.' },
      ],
    },
  ];