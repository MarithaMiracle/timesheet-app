import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TimesheetStatus } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

  const formattedStartDate = start.toLocaleDateString('en-US', options);
  const formattedEndDate = end.toLocaleDateString('en-US', options);

  if (start.getFullYear() !== end.getFullYear()) {
    const formattedStartDateWithYear = start.toLocaleDateString('en-US', { ...options, year: 'numeric' });
    return `${formattedStartDateWithYear} - ${formattedEndDate}, ${end.getFullYear()}`;
  }

  return `${formattedStartDate} - ${formattedEndDate}, ${end.getFullYear()}`;
}

export function getTimesheetStatus(totalHours: number): TimesheetStatus {
  if (totalHours === 40) {
    return 'completed';
  } else if (totalHours > 0 && totalHours < 40) {
    return 'incomplete';
  } else {
    return 'missing';
  }
}