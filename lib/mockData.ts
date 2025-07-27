// lib/mockData.ts - Corrected with proper status distribution

export interface TimesheetEntry {
  id: string;
  projectId: string;
  projectName: string;
  date: string; // YYYY-MM-DD
  hours: number;
  description: string;
  // Compatibility fields for your existing component
  hoursWorked: number;
  taskDescription: string;
  project?: string;
}

export interface TimesheetWeek {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  entries: TimesheetEntry[];
  totalHours: number;
  week?: string;
  // Note: status is derived from totalHours using getTimesheetStatus() function
}

// Helper function to create entry with compatibility fields
const createEntry = (base: Omit<TimesheetEntry, 'hoursWorked' | 'taskDescription' | 'project'>): TimesheetEntry => ({
  ...base,
  hoursWorked: base.hours,
  taskDescription: base.description,
  project: base.projectName,
});

// Helper function to format week string
const formatWeekString = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${end.getFullYear()}`;
};

export const mockTimesheetData: TimesheetWeek[] = [
  // COMPLETED - Exactly 40 hours
  {
    id: 'week-1',
    weekNumber: 27,
    startDate: '2024-06-30',
    endDate: '2024-07-06',
    entries: [
      createEntry({ id: 'entry-1-1', projectId: 'P001', projectName: 'Website Redesign', date: '2024-06-30', hours: 8, description: 'Homepage layout design and implementation' }),
      createEntry({ id: 'entry-1-2', projectId: 'P002', projectName: 'Mobile App', date: '2024-07-01', hours: 8, description: 'User authentication module' }),
      createEntry({ id: 'entry-1-3', projectId: 'P001', projectName: 'Website Redesign', date: '2024-07-02', hours: 8, description: 'Responsive design implementation' }),
      createEntry({ id: 'entry-1-4', projectId: 'P002', projectName: 'Mobile App', date: '2024-07-03', hours: 8, description: 'API integration for user profiles' }),
      createEntry({ id: 'entry-1-5', projectId: 'P001', projectName: 'Website Redesign', date: '2024-07-04', hours: 8, description: 'Testing and bug fixes' }),
    ],
    get totalHours() { return this.entries.reduce((sum, entry) => sum + entry.hours, 0); },
    get week() { return formatWeekString(this.startDate, this.endDate); },
  },

  // INCOMPLETE - Less than 40 hours (25 hours)
  {
    id: 'week-2',
    weekNumber: 28,
    startDate: '2024-07-07',
    endDate: '2024-07-13',
    entries: [
      createEntry({ id: 'entry-2-1', projectId: 'P003', projectName: 'CRM Integration', date: '2024-07-07', hours: 6, description: 'Salesforce API configuration' }),
      createEntry({ id: 'entry-2-2', projectId: 'P001', projectName: 'Website Redesign', date: '2024-07-08', hours: 4, description: 'Product catalog development' }),
      createEntry({ id: 'entry-2-3', projectId: 'P003', projectName: 'CRM Integration', date: '2024-07-09', hours: 7, description: 'Database schema updates' }),
      createEntry({ id: 'entry-2-4', projectId: 'P002', projectName: 'Mobile App', date: '2024-07-10', hours: 5, description: 'UI component library setup' }),
      createEntry({ id: 'entry-2-5', projectId: 'P001', projectName: 'Website Redesign', date: '2024-07-11', hours: 3, description: 'Code review and documentation' }),
    ],
    get totalHours() { return this.entries.reduce((sum, entry) => sum + entry.hours, 0); },
    get week() { return formatWeekString(this.startDate, this.endDate); },
  },

  // INCOMPLETE - Less than 40 hours (18 hours)
  {
    id: 'week-3',
    weekNumber: 29,
    startDate: '2024-07-14',
    endDate: '2024-07-20',
    entries: [
      createEntry({ id: 'entry-3-1', projectId: 'P004', projectName: 'Internal Tools', date: '2024-07-14', hours: 6, description: 'Data import script development' }),
      createEntry({ id: 'entry-3-2', projectId: 'P003', projectName: 'CRM Integration', date: '2024-07-15', hours: 4, description: 'Testing sync functionality' }),
      createEntry({ id: 'entry-3-3', projectId: 'P004', projectName: 'Internal Tools', date: '2024-07-16', hours: 5, description: 'Report generation module' }),
      createEntry({ id: 'entry-3-4', projectId: 'P002', projectName: 'Mobile App', date: '2024-07-17', hours: 3, description: 'Performance optimization' }),
    ],
    get totalHours() { return this.entries.reduce((sum, entry) => sum + entry.hours, 0); },
    get week() { return formatWeekString(this.startDate, this.endDate); },
  },

  // MISSING - Tasks exist but with 0 hours each
  {
    id: 'week-4',
    weekNumber: 30,
    startDate: '2024-07-21',
    endDate: '2024-07-27',
    entries: [
      createEntry({ id: 'entry-4-1', projectId: 'P001', projectName: 'Website Redesign', date: '2024-07-21', hours: 0, description: 'Review requirements document' }),
      createEntry({ id: 'entry-4-2', projectId: 'P002', projectName: 'Mobile App', date: '2024-07-22', hours: 0, description: 'Setup development environment' }),
      createEntry({ id: 'entry-4-3', projectId: 'P003', projectName: 'CRM Integration', date: '2024-07-23', hours: 0, description: 'Initial project planning' }),
      createEntry({ id: 'entry-4-4', projectId: 'P001', projectName: 'Website Redesign', date: '2024-07-24', hours: 0, description: 'Wireframe analysis' }),
      createEntry({ id: 'entry-4-5', projectId: 'P002', projectName: 'Mobile App', date: '2024-07-25', hours: 0, description: 'Design system review' }),
    ],
    get totalHours() { return this.entries.reduce((sum, entry) => sum + entry.hours, 0); },
    get week() { return formatWeekString(this.startDate, this.endDate); },
  },

  // ANOTHER MISSING - Tasks exist but with 0 hours each
  {
    id: 'week-5',
    weekNumber: 31,
    startDate: '2024-07-28',
    endDate: '2024-08-03',
    entries: [
      createEntry({ id: 'entry-5-1', projectId: 'P004', projectName: 'Internal Tools', date: '2024-07-28', hours: 0, description: 'Research new frameworks' }),
      createEntry({ id: 'entry-5-2', projectId: 'P003', projectName: 'CRM Integration', date: '2024-07-29', hours: 0, description: 'Database design review' }),
      createEntry({ id: 'entry-5-3', projectId: 'P001', projectName: 'Website Redesign', date: '2024-07-30', hours: 0, description: 'Content strategy meeting' }),
    ],
    get totalHours() { return this.entries.reduce((sum, entry) => sum + entry.hours, 0); },
    get week() { return formatWeekString(this.startDate, this.endDate); },
  },
];