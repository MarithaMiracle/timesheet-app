"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AddEntryModal from "./AddEntryModal";
// Removed Header and Footer imports since they're handled by layout

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

export default function ThisWeeksTimesheet({ timesheet }: Props) {
  const router = useRouter();
  const [week, setWeek] = useState(timesheet?.week || "21 - 28 January, 2024");
  const [entries, setEntries] = useState<TimesheetEntry[]>(
    timesheet?.entries?.length ? timesheet.entries : [
      {
        date: "2024-01-21",
        hoursWorked: 4,
        taskDescription: "Homepage Development",
        project: "Project Name"
      },
      {
        date: "2024-01-21", 
        hoursWorked: 4,
        taskDescription: "Homepage Development",
        project: "Project Name"
      },
      {
        date: "2024-01-22",
        hoursWorked: 4,
        taskDescription: "Homepage Development", 
        project: "Project Name"
      },
      {
        date: "2024-01-22",
        hoursWorked: 4,
        taskDescription: "Homepage Development",
        project: "Project Name"
      },
      {
        date: "2024-01-22",
        hoursWorked: 4,
        taskDescription: "Homepage Development",
        project: "Project Name"
      },
      {
        date: "2024-01-23",
        hoursWorked: 4,
        taskDescription: "Homepage Development",
        project: "Project Name"
      },
      {
        date: "2024-01-23",
        hoursWorked: 4,
        taskDescription: "Homepage Development",
        project: "Project Name"
      },
      {
        date: "2024-01-23",
        hoursWorked: 4,
        taskDescription: "Homepage Development",
        project: "Project Name"
      },
      {
        date: "2024-01-24",
        hoursWorked: 4,
        taskDescription: "Homepage Development",
        project: "Project Name"
      },
      {
        date: "2024-01-24",
        hoursWorked: 4,
        taskDescription: "Homepage Development",
        project: "Project Name"
      },
      {
        date: "2024-01-24",
        hoursWorked: 4,
        taskDescription: "Homepage Development",
        project: "Project Name"
      }
    ]
  );
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
    const newEntry: TimesheetEntry = {
      date: selectedDate,
      hoursWorked: entry.hours,
      taskDescription: entry.description,
      project: entry.project
    };
    setEntries([...entries, newEntry]);
    setIsModalOpen(false);
  };

  const updateEntry = (index: number, field: keyof TimesheetEntry, value: string | number) => {
    const updated = [...entries];
    updated[index] = {
      ...updated[index],
      [field]: field === "hoursWorked" ? Number(value) : (value as string),
    };
    setEntries(updated);
    setActiveDropdown(null);
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
        isEditing ? `/api/timesheets/${timesheet?.id}` : "/api/timesheets",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      toast.success(
        isEditing ? "✅ Timesheet updated successfully!" : "✅ Timesheet submitted successfully!"
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
  
  const groupedEntries = groupEntriesByDate(entries);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">This week's timesheet</h1>
          <p className="text-sm text-gray-500 mt-1">{week}</p>
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
                  const globalIndex = entries.findIndex(e => 
                    e.date === entry.date && 
                    e.taskDescription === entry.taskDescription &&
                    e.hoursWorked === entry.hoursWorked
                  );
                  const dropdownId = `${day.date}-${entryIndex}`;
                  
                  return (
                    <div key={entryIndex} className="flex justify-between items-center p-3 border border-gray-200 rounded-md bg-white">
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

      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}