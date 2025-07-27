// lib/hybridMockData.ts - Simplified version focused on persistence
import { TimesheetWeek, TimesheetEntry, mockTimesheetData } from './mockData';

const STORAGE_KEY = 'user_timesheet_additions';

interface UserAdditions {
  [weekId: string]: TimesheetEntry[]; // New entries added by user per week
}

interface EntryInput {
  id?: string;
  projectId?: string;
  projectName?: string;
  project?: string;
  date: string;
  hours?: number;
  hoursWorked?: number;
  description?: string;
  taskDescription?: string;
}

// Get user additions from sessionStorage
const getUserAdditions = (): UserAdditions => {
  if (typeof window === 'undefined') return {};

  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading user additions:', error);
    return {};
  }
};

// Save user additions to sessionStorage
const saveUserAdditions = (additions: UserAdditions): void => {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(additions));
    console.log("💾 Saved user additions:", additions);
  } catch (error) {
    console.error('Error saving user additions:', error);
  }
};

// Main function: Get original mock data + user additions
export const getCombinedTimesheetData = (): TimesheetWeek[] => {
  const userAdditions = getUserAdditions();
  
  // Combine original data with user additions
  const combined = mockTimesheetData.map(week => {
    const weekCopy = { ...week };
    
    // Add user entries if they exist for this week
    if (userAdditions[week.id] && userAdditions[week.id].length > 0) {
      weekCopy.entries = [...week.entries, ...userAdditions[week.id]];
      // Recalculate total hours
      weekCopy.totalHours = weekCopy.entries.reduce((sum, entry) => sum + entry.hours, 0);
      
      console.log(`📈 Week ${week.id} now has ${userAdditions[week.id].length} user entries, total hours: ${weekCopy.totalHours}`);
    }
    
    return weekCopy;
  });
  
  return combined;
};

// Add entry to a specific week
export const addEntryToWeek = (weekId: string, entry: EntryInput): void => {
  console.log(`➕ Adding entry to week ${weekId}:`, entry);
  
  const userAdditions = getUserAdditions();
  
  // Create properly formatted entry
  const newEntry: TimesheetEntry = {
    id: entry.id || `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    projectId: entry.projectId || 'USER_PROJECT',
    projectName: entry.projectName || entry.project || 'User Project',
    date: entry.date,
    hours: entry.hours || entry.hoursWorked || 0,
    description: entry.description || entry.taskDescription || '',
    // Compatibility fields
    hoursWorked: entry.hours || entry.hoursWorked || 0,
    taskDescription: entry.description || entry.taskDescription || '',
    project: entry.projectName || entry.project || 'User Project'
  };
  
  // Initialize array if it doesn't exist
  if (!userAdditions[weekId]) {
    userAdditions[weekId] = [];
  }
  
  // Add the entry
  userAdditions[weekId].push(newEntry);
  
  // Save to sessionStorage
  saveUserAdditions(userAdditions);
  
  console.log(`✅ Entry added to week ${weekId}. Week now has ${userAdditions[weekId].length} user entries.`);
};

// Get specific week by ID (includes user additions)
export const getTimesheetById = (id: string): TimesheetWeek | undefined => {
  const combined = getCombinedTimesheetData();
  const found = combined.find(week => week.id === id);
  
  if (found) {
    console.log(`✅ Found timesheet ${id} with ${found.entries.length} entries (${found.totalHours} hours)`);
  } else {
    console.log(`❌ Timesheet ${id} not found`);
  }
  
  return found;
};

// Clear all user additions (on logout)
export const clearAdditionalData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    console.log("🧹 Cleared all user timesheet additions");
  } catch (error) {
    console.error('Error clearing user additions:', error);
  }
};

// Debug function
export const debugCurrentData = (): void => {
  if (typeof window === 'undefined') return;
  
  console.log("🐛 DEBUG - Original mock data:", mockTimesheetData);
  console.log("🐛 DEBUG - User additions:", getUserAdditions());
  console.log("🐛 DEBUG - Combined data:", getCombinedTimesheetData());
};