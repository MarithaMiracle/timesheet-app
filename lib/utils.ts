// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TimesheetStatus } from './types'; // Import the new TimesheetStatus type

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

  let formattedStartDate = start.toLocaleDateString('en-US', options);
  let formattedEndDate = end.toLocaleDateString('en-US', options);

  if (start.getFullYear() !== end.getFullYear()) {
    formattedStartDate = start.toLocaleDateString('en-US', { ...options, year: 'numeric' });
  }

  return `${formattedStartDate} - ${formattedEndDate}, ${end.getFullYear()}`;
}

/**
 * Derives the timesheet status based on total hours as per assessment instructions.
 * @param totalHours The total hours entered for the week.
 * @returns 'completed', 'incomplete', or 'missing'.
 */
export function getTimesheetStatus(totalHours: number): TimesheetStatus {
  if (totalHours === 40) {
    return 'completed';
  } else if (totalHours > 0 && totalHours < 40) {
    return 'incomplete';
  } else { // totalHours <= 0
    return 'missing';
  }
}