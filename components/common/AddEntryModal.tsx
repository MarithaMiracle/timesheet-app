"use client";

import React, { useState } from "react";
import clsx from "clsx";

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: {
    project: string;
    workType: string;
    description: string;
    hours: number;
  }) => void;
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [project, setProject] = useState("");
  const [workType, setWorkType] = useState("");
  const [description, setDescription] = useState("");
  const [hours, setHours] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ project, workType, description, hours });
    onClose(); // Close modal after submit
    setProject("");
    setWorkType("");
    setDescription("");
    setHours(1);
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 bg-black/40 flex items-center justify-center transition-all duration-200",
        { hidden: !isOpen }
      )}
    >
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-lg">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">Add New Entry</h1>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <span className="material-icons">close</span>
            </button>
          </div>

          <div>
            {/* Project */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2" htmlFor="project">
                Select Project *
                <span className="material-icons text-gray-400 ml-1 text-base">
                  info_outline
                </span>
              </label>
              <div className="relative">
                <select
                  id="project"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  required
                  className="w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none text-gray-500"
                >
                  <option value="">Project Name</option>
                  <option value="Project A">Project A</option>
                  <option value="Project B">Project B</option>
                </select>
                <div className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none">
                  expand_more
                </div>
              </div>
            </div>

            {/* Work Type */}
            <div className="mb-6">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2" htmlFor="work-type">
                Type of Work *
                <span className="material-icons text-gray-400 ml-1 text-base">
                  info_outline
                </span>
              </label>
              <div className="relative">
                <select
                  id="work-type"
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  required
                  className="w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none text-gray-900"
                >
                  <option value="">Bug fixes</option>
                  <option value="Bug Fixes">Bug Fixes</option>
                  <option value="Feature Development">Feature Development</option>
                </select>
                <div className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none">
                  expand_more
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
                Task description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write text here ..."
                rows={3}
                required
                className="w-full px-3 py-2 text-base text-gray-700 placeholder-gray-400 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-2 text-sm text-gray-500">A note for extra info</p>
            </div>

            {/* Hours */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="hours">
                Hours *
              </label>
              <div className="flex items-center">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setHours(Math.max(1, hours - 1))}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 border-r border-gray-300"
                  >
                    <span className="material-icons text-lg text-gray-600">remove</span>
                  </button>
                  <input
                    id="hours"
                    type="text"
                    value={hours}
                    readOnly
                    className="w-16 h-11 text-center py-2 text-gray-700 focus:outline-none focus:ring-0 border-none"
                  />
                  <button
                    type="button"
                    onClick={() => setHours(hours + 1)}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 border-l border-gray-300"
                  >
                    <span className="material-icons text-lg text-gray-600">add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with border-top - matches HTML design */}
        <div className="border-t border-gray-200 px-8 py-6">
          <div className="flex justify-between space-x-4">
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add entry
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEntryModal;