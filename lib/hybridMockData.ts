// lib/hybridMockData.ts - New approach

import { TimesheetWeek, TimesheetEntry, mockTimesheetData } from './mockData';

// Key for session storage
const STORAGE_KEY = 'additional_timesheet_data';

// Structure for additional data (only new stuff added by user)
interface AdditionalData {
  newEntries: { [weekId: string]: TimesheetEntry[] }; // New entries added to existing weeks
  newWeeks: TimesheetWeek[]; // Completely new weeks created by user
  modifiedEntries: { [weekId: string]: { [entryId: string]: Partial<TimesheetEntry> } }; // Modified existing entries
}

// Get additional data from session storage
const getAdditionalData = (): AdditionalData => {
  if (typeof window === 'undefined') {
    return { newEntries: {}, newWeeks: [], modifiedEntries: {} };
  }

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading additional timesheet data:', error);
  }

  return { newEntries: {}, newWeeks: [], modifiedEntries: {} };
};

// Save additional data to session storage
const saveAdditionalData = (data: AdditionalData): void => {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving additional timesheet data:', error);
  }
};

// Generate dynamic dates for new weeks (this week, next week, etc.)
const generateDynamicWeek = (weeksFromNow: number = 0): { startDate: string; endDate: string; weekNumber: number } => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate start of current week (Monday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDay + 1 + (weeksFromNow * 7));
  
  // Calculate end of week (Friday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 4);
  
  // Get week number (simplified)
  const startOfYear = new Date(startOfWeek.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((startOfWeek.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7);

  return {
    startDate: startOfWeek.toISOString().split('T')[0],
    endDate: endOfWeek.toISOString().split('T')[0],
    weekNumber
  };
};

// Merge original mock data with additional user data
export const getCombinedTimesheetData = (): TimesheetWeek[] => {
  const additionalData = getAdditionalData();
  
  // Start with original mock data
  const combined = mockTimesheetData.map(week => {
    // Clone the original week
    let combinedWeek = { ...week };
    
    // Add any new entries for this week
    if (additionalData.newEntries[week.id]) {
      combinedWeek.entries = [...week.entries, ...additionalData.newEntries[week.id]];
    }
    
    // Apply any modifications to existing entries
    if (additionalData.modifiedEntries[week.id]) {
      combinedWeek.entries = combinedWeek.entries.map(entry => {
        const modifications = additionalData.modifiedEntries[week.id][entry.id];
        return modifications ? { ...entry, ...modifications } : entry;
      });
    }
    
    // Recalculate total hours
    combinedWeek.totalHours = combinedWeek.entries.reduce((sum, entry) => sum + entry.hours, 0);
    
    return combinedWeek;
  });
  
  // Add any completely new weeks
  combined.push(...additionalData.newWeeks);
  
  // Sort by week number
  return combined.sort((a, b) => a.weekNumber - b.weekNumber);
};

// Add a new entry to an existing week
export const addEntryToWeek = (weekId: string, entry: Omit<TimesheetEntry, 'id'>): void => {
  const additionalData = getAdditionalData();
  
  // Generate unique ID for new entry
  const newEntry: TimesheetEntry = {
    ...entry,
    id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    hoursWorked: entry.hours,
    taskDescription: entry.description,
    project: entry.projectName
  };
  
  // Add to new entries for this week
  if (!additionalData.newEntries[weekId]) {
    additionalData.newEntries[weekId] = [];
  }
  additionalData.newEntries[weekId].push(newEntry);
  
  saveAdditionalData(additionalData);
};

// Create a completely new week (dynamic dates)
export const createNewWeek = (): TimesheetWeek => {
  const additionalData = getAdditionalData();
  
  // Find the next week to create (after existing weeks)
  const existingWeeks = getCombinedTimesheetData();
  const maxWeekNumber = Math.max(...existingWeeks.map(w => w.weekNumber));
  const weeksFromNow = maxWeekNumber - new Date().getWeek() + 1; // Simplified calculation
  
  const { startDate, endDate, weekNumber } = generateDynamicWeek(weeksFromNow);
  
  const newWeek: TimesheetWeek = {
    id: `week-${Date.now()}`,
    weekNumber,
    startDate,
    endDate,
    status: 'Pending',
    entries: [],
    totalHours: 0,
    week: `${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${new Date(endDate).getFullYear()}`
  };
  
  additionalData.newWeeks.push(newWeek);
  saveAdditionalData(additionalData);
  
  return newWeek;
};

// Update an existing entry
export const updateEntry = (weekId: string, entryId: string, updates: Partial<TimesheetEntry>): void => {
  const additionalData = getAdditionalData();
  
  if (!additionalData.modifiedEntries[weekId]) {
    additionalData.modifiedEntries[weekId] = {};
  }
  
  additionalData.modifiedEntries[weekId][entryId] = {
    ...additionalData.modifiedEntries[weekId][entryId],
    ...updates
  };
  
  saveAdditionalData(additionalData);
};

// Delete an entry (mark as deleted)
export const deleteEntry = (weekId: string, entryId: string): void => {
  const additionalData = getAdditionalData();
  
  // Check if it's a new entry (in newEntries)
  if (additionalData.newEntries[weekId]) {
    additionalData.newEntries[weekId] = additionalData.newEntries[weekId].filter(entry => entry.id !== entryId);
  }
  
  // If it's an original entry, mark it as deleted
  if (!additionalData.modifiedEntries[weekId]) {
    additionalData.modifiedEntries[weekId] = {};
  }
  additionalData.modifiedEntries[weekId][entryId] = { ...additionalData.modifiedEntries[weekId][entryId], deleted: true };
  
  saveAdditionalData(additionalData);
};

// Clear all additional data (on logout)
export const clearAdditionalData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing additional timesheet data:', error);
  }
};

// Get a specific timesheet by ID (combines original + additional data)
export const getTimesheetById = (id: string): TimesheetWeek | undefined => {
  const combined = getCombinedTimesheetData();
  return combined.find(week => week.id === id);
};

// Helper extension for Date to get week number
declare global {
  interface Date {
    getWeek(): number;
  }
}

Date.prototype.getWeek = function() {
  const onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
};