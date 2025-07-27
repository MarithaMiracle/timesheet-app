'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { clearAdditionalData } from '@/lib/hybridMockData';
import { useState } from 'react';

interface HeaderProps {
  userName?: string;
}

export default function Header({ userName = 'User' }: HeaderProps) {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayUserName = session?.user?.name || userName;

  const handleSignOut = async () => {
    clearAdditionalData();
    await signOut({ callbackUrl: '/auth' });
  };

  return (
    <header className="bg-white shadow-sm py-4 px-4 sm:px-6 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          <Link href="/dashboard" className="text-xl sm:text-2xl font-bold text-gray-900">
            ticktock
          </Link>
          <nav className="hidden sm:block">
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
              Timesheets
            </Link>
          </nav>
        </div>

        {/* Mobile menu button */}
        <div className="sm:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 hover:text-blue-600 p-2 rounded-md"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        {/* Desktop User Menu */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none px-3 py-2 rounded-md"
          >
            <span className="font-medium truncate max-w-32">{displayUserName}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden mt-4 pb-4 border-t border-gray-200">
          <div className="pt-4 space-y-2">
            <Link 
              href="/dashboard" 
              className="block px-3 py-2 text-gray-600 hover:text-blue-600 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Timesheets
            </Link>
            <div className="px-3 py-2 text-sm text-gray-500 border-t border-gray-100 mt-2 pt-2">
              <span className="block font-medium text-gray-700 mb-2">{displayUserName}</span>
              <button
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}