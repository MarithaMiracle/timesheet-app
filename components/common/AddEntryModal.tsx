"use client";

import React, { useState } from "react";

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
  const [hours, setHours] = useState(12);

  const handleSubmit = () => {
    onSubmit({ project, workType, description, hours });
    onClose();
    setProject("");
    setWorkType("");
    setDescription("");
    setHours(12);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center transition-all duration-200">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-800">Add New Entry</h1>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <span className="text-xl">✕</span>
            </button>
          </div>

          <div className="mb-6">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2" htmlFor="project">
              Select Project *
              <span className="ml-1 text-base">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" width="16px" height="16px" fillRule="nonzero"><g fill="#a9a9a9" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: 'normal' }}><g transform="scale(4,4)"><path d="M32,6c-14.359,0 -26,11.641 -26,26c0,14.359 11.641,26 26,26c14.359,0 26,-11.641 26,-26c0,-14.359 -11.641,-26 -26,-26zM32.021,16c1.534,0 2.979,1.346 2.979,2.981c0,1.746 -1.445,3.019 -2.979,3.019c-1.796,0 -3.021,-1.273 -3.021,-3.019c0,-1.635 1.225,-2.981 3.021,-2.981zM39,47h-5h-4h-5v-3l5,-1v-13h-4v-3l8,-1v17l5,1z"></path></g></g></svg>
                </span>
            </label>
            <div className="relative">
              <select
                id="project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none text-gray-500"
              >
                <option value="">Project Name</option>
                <option value="Project A">Project A</option>
                <option value="Project B">Project B</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none">
              <svg
              className="w-4 h-4 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2" htmlFor="work-type">
              Type of Work *
              <span className="ml-1 text-base">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256" width="16px" height="16px" fillRule="nonzero"><g fill="#a9a9a9" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{ mixBlendMode: 'normal' }}><g transform="scale(4,4)"><path d="M32,6c-14.359,0 -26,11.641 -26,26c0,14.359 11.641,26 26,26c14.359,0 26,-11.641 26,-26c0,-14.359 -11.641,-26 -26,-26zM32.021,16c1.534,0 2.979,1.346 2.979,2.981c0,1.746 -1.445,3.019 -2.979,3.019c-1.796,0 -3.021,-1.273 -3.021,-3.019c0,-1.635 1.225,-2.981 3.021,-2.981zM39,47h-5h-4h-5v-3l5,-1v-13h-4v-3l8,-1v17l5,1z"></path></g></g></svg>
                </span>
            </label>
            <div className="relative">
              <select
                id="work-type"  
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none text-gray-900"
              >
                <option value="">Bug fixes</option>
                <option value="Bug Fixes">Bug Fixes</option>
                <option value="Feature Development">Feature Development</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none">
              <svg
              className="w-4 h-4 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
              </div>
            </div>
          </div>

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
              className="w-full px-3 py-2 text-base text-gray-700 placeholder-gray-400 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="mt-2 text-sm text-gray-500">A note for extra info</p>
          </div>

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
                  <span className="text-lg text-gray-600">−</span>
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
                  <span className="text-lg text-gray-600">+</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
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