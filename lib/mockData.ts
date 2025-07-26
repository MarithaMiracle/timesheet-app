// lib/mockData.ts - Updated to match your component expectations

export interface TimesheetEntry {
  id: string;
  projectId: string;
  projectName: string;
  date: string; // YYYY-MM-DD
  hours: number;
  description: string;
  // Add these for compatibility with ThisWeeksTimesheet component
  hoursWorked: number; // Same as hours
  taskDescription: string; // Same as description
  project?: string; // Same as projectName
}

export interface TimesheetWeek {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Submitted';
  entries: TimesheetEntry[];
  totalHours: number; // Add this for status calculation
  week?: string; // Add this for ThisWeeksTimesheet compatibility
}

// Helper function to calculate total hours
const calculateTotalHours = (entries: TimesheetEntry[]): number => {
  return entries.reduce((sum, entry) => sum + entry.hours, 0);
};

// Helper function to format week string
const formatWeekString = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${end.getFullYear()}`;
};

// Create entries with compatibility fields
const createEntry = (base: Omit<TimesheetEntry, 'hoursWorked' | 'taskDescription' | 'project'>): TimesheetEntry => ({
  ...base,
  hoursWorked: base.hours,
  taskDescription: base.description,
  project: base.projectName,
});

export const mockTimesheetData: TimesheetWeek[] = [
  {
    id: 'week-1',
    weekNumber: 27,
    startDate: '2024-06-30',
    endDate: '2024-07-06',
    status: 'Approved',
    entries: [
      createEntry({ id: 'entry-1-1', projectId: 'P001', projectName: 'Website Redesign', date: '2024-06-30', hours: 8, description: 'Worked on homepage layout.' }),
      createEntry({ id: 'entry-1-2', projectId: 'P002', projectName: 'Mobile App Feature', date: '2024-07-01', hours: 7, description: 'Implemented user profile screen.' }),
      createEntry({ id: 'entry-1-3', projectId: 'P001', projectName: 'Website Redesign', date: '2024-07-01', hours: 1, description: 'Bug fixing on contact form.' }),
      createEntry({ id: 'entry-1-4', projectId: 'P001', projectName: 'Website Redesign', date: '2024-07-02', hours: 8, description: 'Responsive design implementation.' }),
      createEntry({ id: 'entry-1-5', projectId: 'P002', projectName: 'Mobile App Feature', date: '2024-07-03', hours: 8, description: 'API integration for user profiles.' }),
      createEntry({ id: 'entry-1-6', projectId: 'P001', projectName: 'Website Redesign', date: '2024-07-04', hours: 8, description: 'Testing and bug fixes.' }),
    ],
    get totalHours() { return calculateTotalHours(this.entries); },
    get week() { return formatWeekString(this.startDate, this.endDate); },
  },
  {
    id: 'week-2',
    weekNumber: 28,
    startDate: '2024-07-07',
    endDate: '2024-07-13',
    status: 'Pending',
    entries: [
      createEntry({ id: 'entry-2-1', projectId: 'P003', projectName: 'CRM Integration', date: '2024-07-07', hours: 8, description: 'Configured Salesforce API.' }),
      createEntry({ id: 'entry-2-2', projectId: 'P001', projectName: 'Website Redesign', date: '2024-07-08', hours: 6, description: 'Developed product detail page.' }),
      createEntry({ id: 'entry-2-3', projectId: 'P003', projectName: 'CRM Integration', date: '2024-07-09', hours: 7, description: 'Database schema updates.' }),
    ],
    get totalHours() { return calculateTotalHours(this.entries); },
    get week() { return formatWeekString(this.startDate, this.endDate); },
  },
  {
    id: 'week-3',
    weekNumber: 29,
    startDate: '2024-07-14',
    endDate: '2024-07-20',
    status: 'Submitted',
    entries: [
      createEntry({ id: 'entry-3-1', projectId: 'P004', projectName: 'Internal Tools', date: '2024-07-14', hours: 8, description: 'Built data import script.' }),
      createEntry({ id: 'entry-3-2', projectId: 'P003', projectName: 'CRM Integration', date: '2024-07-15', hours: 4, description: 'Debugging sync issues.' }),
    ],
    get totalHours() { return calculateTotalHours(this.entries); },
    get week() { return formatWeekString(this.startDate, this.endDate); },
  },
  {
    id: 'week-4',
    weekNumber: 30,
    startDate: '2024-07-21',
    endDate: '2024-07-27',
    status: 'Pending',
    entries: [], // No entries = missing status
    get totalHours() { return calculateTotalHours(this.entries); },
    get week() { return formatWeekString(this.startDate, this.endDate); },
  },
];