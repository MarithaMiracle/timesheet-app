import { TimesheetEntry } from './mockData';

const STORAGE_KEY = 'user_timesheet_additions';

interface UserAdditions {
  [weekId: string]: TimesheetEntry[];
}

export const getUserAdditions = (): UserAdditions => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading user additions:', error);
    return {};
  }
};

export const saveUserAdditions = (additions: UserAdditions): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(additions));
    console.log("💾 Saved user additions to sessionStorage");
  } catch (error) {
    console.error('Error saving user additions:', error);
  }
};

export const clearUserAdditions = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.removeItem(STORAGE_KEY);
    console.log("🧹 Cleared user additions from sessionStorage");
  } catch (error) {
    console.error('Error clearing user additions:', error);
  }
};