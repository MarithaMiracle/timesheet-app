import { TimesheetWeek, TimesheetEntry } from '@/types/timesheet';

const calculateTotalHours = (entries: TimesheetEntry[]): number => {
  return entries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
};

const formatWeekString = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${end.getFullYear()}`;
};

const calculateStatus = (totalHours: number): 'completed' | 'incomplete' | 'missing' => {
  if (totalHours === 0) return 'missing';
  if (totalHours >= 40) return 'completed';
  return 'incomplete';
};

const createOriginalMockData = (): TimesheetWeek[] => [
  {
    id: 'week-1',
    week: formatWeekString('2024-06-30', '2024-07-06'),
    weekNumber: 27,
    startDate: '2024-06-30',
    endDate: '2024-07-06',
    totalHours: 0,
    status: 'missing',
    entries: [
      {
        id: 'entry-1-1',
        date: '2024-06-30',
        hoursWorked: 8,
        status: 'completed',
        description: 'Worked on homepage layout.',
        taskDescription: 'Worked on homepage layout.'
      },
      {
        id: 'entry-1-2',
        date: '2024-07-01',
        hoursWorked: 7,
        status: 'incomplete',
        description: 'Implemented user profile screen.',
        taskDescription: 'Implemented user profile screen.'
      },
      {
        id: 'entry-1-3',
        date: '2024-07-02',
        hoursWorked: 8,
        status: 'completed',
        description: 'Database optimization tasks.',
        taskDescription: 'Database optimization tasks.'
      },
      {
        id: 'entry-1-4',
        date: '2024-07-03',
        hoursWorked: 6,
        status: 'incomplete',
        description: 'Testing and bug fixes.',
        taskDescription: 'Testing and bug fixes.'
      },
      {
        id: 'entry-1-5',
        date: '2024-07-04',
        hoursWorked: 8,
        status: 'completed',
        description: 'API integration work.',
        taskDescription: 'API integration work.'
      }
    ]
  },
  {
    id: 'week-2',
    week: formatWeekString('2024-07-07', '2024-07-13'),
    weekNumber: 28,
    startDate: '2024-07-07',
    endDate: '2024-07-13',
    totalHours: 0,
    status: 'missing',
    entries: [
      {
        id: 'entry-2-1',
        date: '2024-07-07',
        hoursWorked: 8,
        status: 'completed',
        description: 'Frontend component development.',
        taskDescription: 'Frontend component development.'
      },
      {
        id: 'entry-2-2',
        date: '2024-07-08',
        hoursWorked: 7.5,
        status: 'incomplete',
        description: 'Code review and refactoring.',
        taskDescription: 'Code review and refactoring.'
      },
      {
        id: 'entry-2-3',
        date: '2024-07-09',
        hoursWorked: 8,
        status: 'completed',
        description: 'Meeting with stakeholders.',
        taskDescription: 'Meeting with stakeholders.'
      }
    ]
  },
  {
    id: 'week-3',
    week: formatWeekString('2024-07-14', '2024-07-20'),
    weekNumber: 29,
    startDate: '2024-07-14',
    endDate: '2024-07-20',
    totalHours: 0,
    status: 'missing',
    entries: [
      {
        id: 'entry-3-1',
        date: '2024-07-14',
        hoursWorked: 4,
        status: 'incomplete',
        description: 'Documentation updates.',
        taskDescription: 'Documentation updates.'
      }
    ]
  }
];

const processWeekData = (weeks: TimesheetWeek[]): TimesheetWeek[] => {
  return weeks.map(week => {
    const totalHours = calculateTotalHours(week.entries);
    return {
      ...week,
      totalHours,
      status: calculateStatus(totalHours)
    };
  });
};

const STORAGE_KEY = 'timesheet_data';

export const getPersistentMockData = (): TimesheetWeek[] => {
  if (typeof window === 'undefined') {
    return processWeekData(createOriginalMockData());
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: TimesheetWeek[] = JSON.parse(stored);
      return processWeekData(parsed);
    }
  } catch (error) {
    console.error('Error loading timesheet data from session storage:', error);
  }

  return processWeekData(createOriginalMockData());
};

export const savePersistentMockData = (data: TimesheetWeek[]): void => {
  if (typeof window === 'undefined') return;

  try {
    const processedData = processWeekData(data);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(processedData));
  } catch (error) {
    console.error('Error saving timesheet data to session storage:', error);
  }
};

export const clearPersistentMockData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing timesheet data:', error);
  }
};

let mockTimesheetData: TimesheetWeek[] = processWeekData(createOriginalMockData());

export const getMockTimesheetData = (): TimesheetWeek[] => {
  return mockTimesheetData;
};

export const updateMockTimesheetData = (newData: TimesheetWeek[]): void => {
  mockTimesheetData = processWeekData(newData);
  savePersistentMockData(mockTimesheetData);
};

export const findTimesheetById = (id: string): TimesheetWeek | undefined => {
  return mockTimesheetData.find(week => week.id === id);
};

export const updateTimesheetById = (id: string, updates: Partial<TimesheetWeek>): TimesheetWeek | null => {
  const index = mockTimesheetData.findIndex(week => week.id === id);
  if (index !== -1) {
    const updatedWeek = { ...mockTimesheetData[index], ...updates };
    mockTimesheetData[index] = updatedWeek;
    
    mockTimesheetData[index] = processWeekData([mockTimesheetData[index]])[0];
    
    savePersistentMockData(mockTimesheetData);
    return mockTimesheetData[index];
  }
  return null;
};

export const addTimesheetEntry = (weekId: string, entry: Omit<TimesheetEntry, 'id'>): TimesheetEntry | null => {
  const week = findTimesheetById(weekId);
  if (!week) return null;

  const newEntry: TimesheetEntry = {
    ...entry,
    id: `entry-${weekId}-${Date.now()}`
  };

  const updatedEntries = [...week.entries, newEntry];
  updateTimesheetById(weekId, { entries: updatedEntries });

  return newEntry;
};

export const updateTimesheetEntry = (weekId: string, entryId: string, updates: Partial<TimesheetEntry>): TimesheetEntry | null => {
  const week = findTimesheetById(weekId);
  if (!week) return null;

  const entryIndex = week.entries.findIndex(entry => entry.id === entryId);
  if (entryIndex === -1) return null;

  const updatedEntry = { ...week.entries[entryIndex], ...updates };
  const updatedEntries = [...week.entries];
  updatedEntries[entryIndex] = updatedEntry;

  updateTimesheetById(weekId, { entries: updatedEntries });
  return updatedEntry;
};

if (typeof window !== 'undefined') {
  mockTimesheetData = getPersistentMockData();
}