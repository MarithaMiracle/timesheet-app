import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import Header from '@/components/common/Header';
import TimesheetTable from './components/TimesheetTable';
import { TimesheetWeek } from '@/lib/types';
import Footer from "@/components/common/Footer";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/auth');
  }

  let timesheets: TimesheetWeek[] = [];
  let fetchError: string | null = null;

  try {
    const incomingHeaders = Object.fromEntries((await headers()).entries());
    const cookieHeader = incomingHeaders.cookie; 

    const fetchHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (cookieHeader) {
      fetchHeaders['Cookie'] = cookieHeader;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/timesheets`, {
      method: 'GET',
      headers: fetchHeaders,
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Timesheets Fetch Error Response:', response.status, response.statusText, errorText);
      throw new Error(`Failed to fetch timesheets: ${response.status} ${response.statusText} - ${errorText}`);
    }

    timesheets = await response.json();

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching timesheets in DashboardPage:', error); 
    fetchError = `Could not load timesheet data: ${errorMessage}`;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header userName={session?.user?.name || "John Doe"} />

      <main className="p-4 sm:p-6 lg:p-8 flex-1">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Your Timesheets</h1>

          {fetchError ? (
            <div className="text-red-500 text-center py-8 px-4">
              <p className="text-sm sm:text-base">Error loading timesheets: {fetchError}</p>
              <p className="text-sm sm:text-base">Please try refreshing the page.</p>
            </div>
          ) : timesheets.length === 0 ? (
            <div className="text-gray-500 text-center py-8 px-4">
              <p className="text-sm sm:text-base">No timesheet entries found.</p>
            </div>
          ) : (
            <TimesheetTable timesheetWeeks={timesheets} />
          )}
        </div>
      </main>

      <div className="p-4 sm:p-6 lg:p-8">
        <Footer />
      </div>
    </div>
  );
}