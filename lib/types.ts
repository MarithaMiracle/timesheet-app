// lib/types.ts

// Redefined TimesheetStatus based on your assessment instructions
export type TimesheetStatus = 'completed' | 'incomplete' | 'missing';

export interface TimesheetWeek {
  id: string;
  weekNumber: number;
  startDate: string; // e.g., 'YYYY-MM-DD'
  endDate: string;   // e.g., 'YYYY-MM-DD'
  status: TimesheetStatus; // Now holds 'completed', 'incomplete', or 'missing'
  totalHours: number; // This field is crucial for determining the status
}