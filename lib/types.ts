export type TimesheetStatus = 'completed' | 'incomplete' | 'missing';

export interface TimesheetWeek {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
  totalHours: number;
}