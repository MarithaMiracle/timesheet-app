"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface TimesheetEntry {
  date: string;
  hoursWorked: number;
  taskDescription: string;
  project?: string;
}

interface TimesheetWeek {
  id: string;
  week: string;
  entries: TimesheetEntry[];
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

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric'
  });
};

// Helper function to get week dates
const getWeekDates = (weekString: string) => {
  // Extract dates from week string like "July 22 - July 28"
  return weekString;
};

export default function ThisWeeksTimesheet({ timesheet }: Props) {
  const router = useRouter();
  const [week, setWeek] = useState(timesheet?.week || "");
  const [entries, setEntries] = useState<TimesheetEntry[]>(
    timesheet?.entries?.length
      ? timesheet.entries
      : []
  );
  const [submitting, setSubmitting] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const isEditing = !!timesheet?.id;

  // Calculate total hours
  const totalHours = entries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
  const targetHours = 40;
  const progressPercentage = Math.min((totalHours / targetHours) * 100, 100);

  const addNewTask = (date: string) => {
    const newEntry: TimesheetEntry = {
      date,
      hoursWorked: 0,
      taskDescription: "",
      project: "Project Name"
    };
    setEntries([...entries, newEntry]);
  };

  const updateEntry = (index: number, field: keyof TimesheetEntry, value: string | number) => {
    const updated = [...entries];
    updated[index] = {
      ...updated[index],
      [field]: field === "hoursWorked" ? Number(value) : (value as string),
    };
    setEntries(updated);
  };

  const deleteEntry = (index: number) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
    setActiveDropdown(null);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = { week, entries };

    try {
      const response = await fetch(
        isEditing
          ? `/api/timesheets/${timesheet?.id}`
          : "/api/timesheets",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      toast.success(
        isEditing
          ? "✅ Timesheet updated successfully!"
          : "✅ Timesheet submitted successfully!"
      );

      if (!isEditing) {
        setWeek("");
        setEntries([]);
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "❌ Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  // Generate week dates for display
  const weekDates = ['Jan 21', 'Jan 22', 'Jan 23', 'Jan 24', 'Jan 25', 'Jan 26', 'Jan 27'];
  const actualDates = ['2024-01-21', '2024-01-22', '2024-01-23', '2024-01-24', '2024-01-25', '2024-01-26', '2024-01-27'];
  
  const groupedEntries = groupEntriesByDate(entries);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="font-bold text-xl text-gray-800">ticktock</span>
              <nav className="hidden md:flex ml-10 space-x-8">
                <a className="text-sm font-medium text-gray-900" href="#">Timesheets</a>
              </nav>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
                  <span>John Doe</span>
                  <span className="material-icons text-lg">expand_more</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6 md:p-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">This week's timesheet</h1>
                <input
                  type="text"
                  value={week}
                  onChange={(e) => setWeek(e.target.value)}
                  placeholder="e.g. 21 - 28 January, 2024"
                  className="text-sm text-gray-500 mt-1 border-none outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center mt-4 md:mt-0">
                <span className="text-sm font-medium text-gray-700 mr-3">
                  {totalHours} / {targetHours} hrs
                </span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 ml-3">{Math.round(progressPercentage)}%</span>
              </div>
            </div>

            {/* Daily Entries */}
            <div className="space-y-8">
              {weekDates.map((displayDate, dayIndex) => {
                const actualDate = actualDates[dayIndex];
                const dayEntries = groupedEntries[actualDate] || [];
                
                return (
                  <div key={actualDate}>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">{displayDate}</h2>
                    <div className="space-y-2">
                      {dayEntries.map((entry, entryIndex) => {
                        const globalIndex = entries.findIndex(e => 
                          e.date === entry.date && 
                          e.taskDescription === entry.taskDescription &&
                          e.hoursWorked === entry.hoursWorked
                        );
                        const dropdownId = `${actualDate}-${entryIndex}`;
                        
                        return (
                          <div key={entryIndex} className="flex justify-between items-center p-3 border border-gray-200 rounded-md bg-white">
                            <input
                              type="text"
                              value={entry.taskDescription}
                              onChange={(e) => updateEntry(globalIndex, "taskDescription", e.target.value)}
                              placeholder="Task description"
                              className="text-sm text-gray-800 border-none outline-none bg-transparent flex-1"
                            />
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <input
                                  type="number"
                                  value={entry.hoursWorked}
                                  onChange={(e) => updateEntry(globalIndex, "hoursWorked", e.target.value)}
                                  className="text-sm text-gray-500 w-12 text-right border-none outline-none bg-transparent"
                                  step="0.1"
                                  min="0"
                                />
                                <span className="text-sm text-gray-500 ml-1">hrs</span>
                              </div>
                              <input
                                type="text"
                                value={entry.project || ""}
                                onChange={(e) => updateEntry(globalIndex, "project", e.target.value)}
                                placeholder="Project Name"
                                className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md border-none outline-none"
                              />
                              <div className="relative">
                                <button 
                                  className="text-gray-400 hover:text-gray-600"
                                  onClick={() => setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId)}
                                >
                                  <span className="material-icons text-lg">more_horiz</span>
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
                        className="w-full flex items-center justify-center p-3 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-100 bg-white focus:outline-none"
                        onClick={() => addNewTask(actualDate)}
                      >
                        <span className="material-icons text-lg mr-2">add</span>
                        <span className="text-sm font-medium">Add new task</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting
                  ? isEditing
                    ? "Updating..."
                    : "Submitting..."
                  : isEditing
                  ? "Update Timesheet"
                  : "Submit Timesheet"}
              </button>
            </div>
          </div>

          <footer className="text-center text-sm text-gray-500 mt-8">
            © 2024 tentwenty. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}