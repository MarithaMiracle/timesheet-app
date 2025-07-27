// lib/sessionStorage.ts - Helper for user data persistence
import { TimesheetEntry } from './mockData';

const STORAGE_KEY = 'user_timesheet_additions';

interface UserAdditions {
  [weekId: string]: TimesheetEntry[];
}

// Get user additions from sessionStorage
export const getUserAdditions = (): UserAdditions => {
  // Server-side: return empty object
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

// Save user additions to sessionStorage
export const saveUserAdditions = (additions: UserAdditions): void => {
  // Server-side: do nothing
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

// Clear all user additions (on logout)
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