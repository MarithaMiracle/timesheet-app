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
  // Add compatibility fields
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

// Helper function to group entries by date
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

// Helper to normalize entry data
const normalizeEntry = (entry: TimesheetEntry): TimesheetEntry => ({
  id: entry.id || `entry-${Date.now()}-${Math.random()}`,
  date: entry.date,
  hoursWorked: entry.hoursWorked || entry.hours || 0,
  taskDescription: entry.taskDescription || entry.description || '',
  project: entry.project || entry.projectName || 'Default Project'
});

export default function ThisWeeksTimesheet({ timesheet }: Props) {
  const router = useRouter();
  
  // Normalize entries from timesheet or use defaults
  const initialEntries = timesheet?.entries?.length 
    ? timesheet.entries.map(normalizeEntry)
    : [
        {
          id: "default-1",
          date: "2024-01-21",
          hoursWorked: 0,
          taskDescription: "Homepage Development",
          project: "Project Name"
        },
        {
          id: "default-2", 
          date: "2024-01-21",
          hoursWorked: 0,
          taskDescription: "Homepage Development",
          project: "Project Name"
        },
        // ... add more default entries
      ];

  const [entries, setEntries] = useState<TimesheetEntry[]>(initialEntries);
  const [submitting, setSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const isEditing = !!timesheet?.id;

  // Calculate total hours
  const totalHours = entries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
  const targetHours = 40;
  const progressPercentage = Math.min((totalHours / targetHours) * 100, 100);

  // Fixed week dates matching your HTML design
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
        // Updating existing timesheet
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
        // Adding entries to existing week or creating new entries
        payload = {
          weekId: timesheet?.id, // If we have a timesheet ID
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

      // Navigate back to dashboard after successful submission
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
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            This week&apos;s timesheet
          </h1>
          <p className="text-sm text-gray-500 mt-1">{timesheet?.week || "21 - 28 January, 2024"}</p>
          {isEditing && timesheet?.id && (
            <p className="text-xs text-blue-600 mt-1">Week ID: {timesheet.id}</p>
          )}
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <span className="text-sm font-medium text-gray-700 mr-3">{totalHours} / 40 hrs</span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <span className="text-sm text-gray-500 ml-3">{Math.round(progressPercentage)}%</span>
        </div>
      </div>

      <div className="space-y-8">
        {weekDays.map((day) => {
          const dayEntries = groupedEntries[day.date] || [];
          
          return (
            <div key={day.date}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">{day.display}</h2>
              <div className="space-y-2">
                {dayEntries.map((entry, entryIndex) => {
                  const globalIndex = entries.findIndex(e => e.id === entry.id);
                  const dropdownId = `${day.date}-${entryIndex}`;
                  
                  return (
                    <div key={entry.id || entryIndex} className="flex justify-between items-center p-3 border border-gray-200 rounded-md bg-white">
                      <span className="text-sm text-gray-800">{entry.taskDescription}</span>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{entry.hoursWorked} hrs</span>
                        <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md">
                          {entry.project}
                        </span>
                        <div className="relative">
                          <button 
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() => setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId)}
                          >
                            <span className="text-lg">⋯</span>
                          </button>
                          {activeDropdown === dropdownId && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
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

      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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