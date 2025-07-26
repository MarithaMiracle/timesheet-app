// lib/persistentMockData.ts - New file for persistent mock data

import { TimesheetWeek, TimesheetEntry } from './mockData';

// Original mock data as the default
const originalMockData: TimesheetWeek[] = [
  {
    id: 'week-1',
    weekNumber: 27,
    startDate: '2024-06-30',
    endDate: '2024-07-06',
    status: 'Approved',
    entries: [
      { id: 'entry-1-1', projectId: 'P001', projectName: 'Website Redesign', date: '2024-06-30', hours: 8, description: 'Worked on homepage layout.', hoursWorked: 8, taskDescription: 'Worked on homepage layout.', project: 'Website Redesign' },
      { id: 'entry-1-2', projectId: 'P002', projectName: 'Mobile App Feature', date: '2024-07-01', hours: 7, description: 'Implemented user profile screen.', hoursWorked: 7, taskDescription: 'Implemented user profile screen.', project: 'Mobile App Feature' },
      // ... add rest of entries with compatibility fields
    ],
    get totalHours() { return this.entries.reduce((sum, entry) => sum + entry.hours, 0); },
    get week() { return `${new Date(this.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(this.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${new Date(this.endDate).getFullYear()}`; },
  },
  // ... rest of your mock data
];

// Key for session storage
const STORAGE_KEY = 'timesheet_data';

// Get data from session storage or use default
export const getPersistentMockData = (): TimesheetWeek[] => {
  if (typeof window === 'undefined') {
    // Server-side: return original data
    return [...originalMockData];
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Restore getter functions that don't serialize
      return parsed.map((week: any) => ({
        ...week,
        get totalHours() { return this.entries.reduce((sum: number, entry: TimesheetEntry) => sum + entry.hours, 0); },
        get week() { return `${new Date(this.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(this.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${new Date(this.endDate).getFullYear()}`; },
      }));
    }
  } catch (error) {
    console.error('Error loading timesheet data from session storage:', error);
  }

  // Fallback to original data
  return [...originalMockData];
};

// Save data to session storage
export const savePersistentMockData = (data: TimesheetWeek[]): void => {
  if (typeof window === 'undefined') return;

  try {
    // Convert to plain objects (remove getters for serialization)
    const serializable = data.map(week => ({
      ...week,
      totalHours: week.totalHours, // Convert getter to value
      week: week.week, // Convert getter to value
    }));
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  } catch (error) {
    console.error('Error saving timesheet data to session storage:', error);
  }
};

// Clear data on logout
export const clearPersistentMockData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing timesheet data:', error);
  }
};

// Initialize data (call this once when the app starts)
let mockTimesheetData: TimesheetWeek[] = [...originalMockData];

// Export functions to manage the data
export const getMockTimesheetData = (): TimesheetWeek[] => {
  return mockTimesheetData;
};

export const updateMockTimesheetData = (newData: TimesheetWeek[]): void => {
  mockTimesheetData = newData;
  savePersistentMockData(newData);
};

export const findTimesheetById = (id: string): TimesheetWeek | undefined => {
  return mockTimesheetData.find(week => week.id === id);
};

export const updateTimesheetById = (id: string, updates: Partial<TimesheetWeek>): TimesheetWeek | null => {
  const index = mockTimesheetData.findIndex(week => week.id === id);
  if (index !== -1) {
    mockTimesheetData[index] = { ...mockTimesheetData[index], ...updates };
    savePersistentMockData(mockTimesheetData);
    return mockTimesheetData[index];
  }
  return null;
};

// Initialize data on first load (client-side only)
if (typeof window !== 'undefined') {
  mockTimesheetData = getPersistentMockData();
}