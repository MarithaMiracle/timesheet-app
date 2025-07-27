"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AddEntryModal from "./AddEntryModal";

interface TimesheetEntry {
  id?: string;
  date: string;
  hoursWorked: number;
  taskDescription: string;
  project?: string;
  hours?: number;
  description?: string;
  projectName?: string;
}

interface TimesheetWeek {
  id: string;
  week: string;
  entries: TimesheetEntry[];
  weekNumber?: number;
  startDate?: string;
  endDate?: string;
  totalHours?: number;
}

interface Props {
  timesheet?: TimesheetWeek | null;
}

const groupEntriesByDate = (entries: TimesheetEntry[]) => {
  const grouped: { [key: string]: TimesheetEntry[] } = {};
  entries.forEach(entry => {
    if (!grouped[entry.date]) {
      grouped[entry.date] = [];
    }
    grouped[entry.date].push(entry);
  });
  return grouped;
};

const createRichMockEntries = (timesheet?: TimesheetWeek | null | { id?: string; totalHours?: number }): TimesheetEntry[] => {
  const baseId = timesheet?.id || 'new';
  
  let targetHours = 0;
  
  if (timesheet && 'totalHours' in timesheet && timesheet.totalHours !== undefined) {
    targetHours = timesheet.totalHours;
  }
  
  console.log(`Creating mock entries for ${baseId} with target hours: ${targetHours}`);
  
  const baseEntries = [
    {
      id: `mock-${baseId}-1`,
      date: "2024-01-21",
      taskDescription: "Homepage Development - Implemented responsive navigation and hero section",
      project: "Website Redesign"
    },
    {
      id: `mock-${baseId}-2`,
      date: "2024-01-21", 
      taskDescription: "Code review and documentation updates",
      project: "Website Redesign"
    },
    {
      id: `mock-${baseId}-3`,
      date: "2024-01-22",
      taskDescription: "User authentication module - Login/logout functionality", 
      project: "Mobile App"
    },
    {
      id: `mock-${baseId}-4`,
      date: "2024-01-22",
      taskDescription: "Daily standup and sprint planning meeting",
      project: "Mobile App"
    },
    {
      id: `mock-${baseId}-5`,
      date: "2024-01-23",
      taskDescription: "Database optimization and query performance tuning",
      project: "Backend Services"
    },
    {
      id: `mock-${baseId}-6`,
      date: "2024-01-23",
      taskDescription: "API endpoint testing and bug fixes", 
      project: "Backend Services"
    },
    {
      id: `mock-${baseId}-7`,
      date: "2024-01-24",
      taskDescription: "Client presentation and feature demo preparation",
      project: "Project Management"
    },
    {
      id: `mock-${baseId}-8`,
      date: "2024-01-25",
      taskDescription: "UI component library updates and styling improvements",
      project: "Design System"
    }
  ];

  if (targetHours === 0) {
    return baseEntries.map(entry => ({
      ...entry,
      hoursWorked: 0
    }));
  } else if (targetHours === 40) {
    const hourDistribution = [8, 2, 7, 1, 6, 2, 8, 6];
    return baseEntries.map((entry, index) => ({
      ...entry,
      hoursWorked: hourDistribution[index] || 0
    }));
  } else {
    const hourDistribution = [8, 2, 7, 1, 6, 2, 8, 6];
    const scaleFactor = targetHours / 40;
    
    return baseEntries.map((entry, index) => {
      const baseHours = hourDistribution[index] || 0;
      const scaledHours = Math.round(baseHours * scaleFactor * 4) / 4;
      return {
        ...entry,
        hoursWorked: scaledHours
      };
    }).filter(entry => entry.hoursWorked > 0);
  }
};

const getDisplayEntries = (timesheet?: TimesheetWeek | null): TimesheetEntry[] => {
  const effectiveTimesheet = timesheet || { 
    id: 'new',
    totalHours: 0
  };
  
  console.log(`Creating status-appropriate mock entries for ${effectiveTimesheet.id || 'new timesheet'} with ${effectiveTimesheet.totalHours || 0} hours`);
  return createRichMockEntries(effectiveTimesheet);
};

export default function ThisWeeksTimesheet({ timesheet }: Props) {
  const router = useRouter();
  
  const initialEntries = getDisplayEntries(timesheet);

  const [entries, setEntries] = useState<TimesheetEntry[]>(initialEntries);
  const [submitting, setSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const isEditing = !!timesheet?.id;

  console.log("ThisWeeksTimesheet rendered with:", {
    timesheet: timesheet?.id,
    entriesCount: entries.length,
    isEditing,
    firstEntry: entries[0]
  });

  const totalHours = Math.round(entries.reduce((sum, entry) => sum + entry.hoursWorked, 0) * 100) / 100;
  const targetHours = 40;
  const progressPercentage = Math.min((totalHours / targetHours) * 100, 100);

  const weekDays = [
    { display: "Jan 21", date: "2024-01-21" },
    { display: "Jan 22", date: "2024-01-22" },
    { display: "Jan 23", date: "2024-01-23" },
    { display: "Jan 24", date: "2024-01-24" },
    { display: "Jan 25", date: "2024-01-25" },
  ];

  const addNewTask = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (entry: {
    project: string;
    workType: string;
    description: string;
    hours: number;
  }) => {
    console.log("Adding new entry:", entry);
    
    const newEntry: TimesheetEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: selectedDate,
      hoursWorked: entry.hours,
      taskDescription: entry.description,
      project: entry.project
    };
    
    setEntries(prevEntries => [...prevEntries, newEntry]);
    setIsModalOpen(false);
    
    toast.success("Task added successfully!");
  };

  const deleteEntry = (index: number) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
    setActiveDropdown(null);
    toast.success("Entry deleted");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      let payload;
      let url;
      let method;

      if (isEditing && timesheet?.id) {
        payload = { 
          weekId: timesheet.id,
          entries: entries.map(entry => ({
            id: entry.id,
            projectName: entry.project,
            description: entry.taskDescription,
            hours: entry.hoursWorked,
            date: entry.date
          }))
        };
        url = `/api/timesheets/${timesheet.id}`;
        method = "PUT";
      } else {
        payload = {
          weekId: timesheet?.id,
          entries: entries.map(entry => ({
            id: entry.id,
            projectName: entry.project,
            description: entry.taskDescription,
            hours: entry.hoursWorked,
            date: entry.date
          }))
        };
        url = "/api/timesheets";
        method = "POST";
      }

      console.log("Submitting timesheet:", { payload, url, method });

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Submit response:", result);

      toast.success(
        isEditing ? "✅ Timesheet updated successfully!" : "✅ Timesheet submitted successfully!"
      );

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error("Submit error:", error);
      toast.error(errorMessage || "❌ Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };
  
  const groupedEntries = groupEntriesByDate(entries);

  return (
    <div className="max-w-full">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div className="w-full lg:w-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            This week&apos;s timesheet
          </h1>
          <p className="text-sm text-gray-500 mt-1">{timesheet?.week || "21 - 28 January, 2024"}</p>
          {isEditing && timesheet?.id && (
            <p className="text-xs text-blue-600 mt-1">Week ID: {timesheet.id}</p>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center w-full lg:w-auto space-x-3">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{totalHours} / 40 hrs</span>
          <div className="w-full lg:w-32 bg-gray-200 rounded-full h-2 min-w-[120px]">
            <div className="bg-orange-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      {/* Timesheet Entries */}
      <div className="space-y-6 lg:space-y-8">
        {weekDays.map((day) => {
          const dayEntries = groupedEntries[day.date] || [];
          
          return (
            <div key={day.date} className="w-full">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">{day.display}</h2>
              <div className="space-y-2">
                {dayEntries.map((entry, entryIndex) => {
                  const globalIndex = entries.findIndex(e => e.id === entry.id);
                  const dropdownId = `${day.date}-${entryIndex}`;
                  
                  return (
                    <div key={entry.id || entryIndex} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 border border-gray-200 rounded-md bg-white space-y-2 sm:space-y-0">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-sm text-gray-800 break-words">{entry.taskDescription}</p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4 flex-shrink-0">
                        <span className="text-sm text-gray-500 whitespace-nowrap">{entry.hoursWorked} hrs</span>
                        <span className="text-xs sm:text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md whitespace-nowrap">
                          {entry.project}
                        </span>
                        <div className="relative">
                          <button 
                            className="text-gray-400 hover:text-gray-600 p-1"
                            onClick={() => setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId)}
                          >
                            <span className="text-lg">⋯</span>
                          </button>
                          {activeDropdown === dropdownId && (
                            <div className="absolute right-0 mt-2 w-32 sm:w-48 bg-white rounded-md shadow-lg py-1 z-10">
                              <button 
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setActiveDropdown(null)}
                              >
                                Edit
                              </button>
                              <button 
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                onClick={() => deleteEntry(globalIndex)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                <button 
                  className="w-full flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 bg-white focus:outline-none transition-colors duration-200"
                  onClick={() => addNewTask(day.date)}
                >
                  <span className="text-lg mr-2">+</span>
                  <span className="text-sm font-medium">Add new task</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
        >
          {submitting ? "Saving..." : (isEditing ? "Update Timesheet" : "Save Timesheet")}
        </button>
      </div>

      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}