// components/common/Header.tsx - Updated for hybrid system
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { clearAdditionalData } from '@/lib/hybridMockData'; // Updated import
import { useState } from 'react';

interface HeaderProps {
  userName?: string;
}

export default function Header({ userName = 'User' }: HeaderProps) {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const displayUserName = session?.user?.name || userName;

  // Handle sign out with clearing additional data only
  const handleSignOut = async () => {
    clearAdditionalData(); // Only clears user additions, keeps original mock data
    await signOut({ callbackUrl: '/auth' });
  };

  return (
    <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
            ticktock
          </Link>
          <nav>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
              Timesheets
            </Link>
          </nav>
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <span className="font-medium">{displayUserName}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}