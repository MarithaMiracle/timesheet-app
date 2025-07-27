// app/dashboard/page.tsx
// This is a Server Component by default, which is ideal for checking session server-side
// and fetching initial data.

import { auth } from '@/lib/auth'; // <--- ADDED THIS LINE: Server-side auth helper
import { redirect } from 'next/navigation';
import { headers } from 'next/headers'; // Import the headers function for Server Components

// Import components and types
import Header from '@/components/common/Header';
import TimesheetTable from './components/TimesheetTable';
// Removed unused SignOutButton import - this fixes the @typescript-eslint/no-unused-vars warning
// import SignOutButton from './SignOutButton'; // Client component for sign out
import { TimesheetWeek } from '@/lib/types'; // Import the type for timesheet data from lib/types.ts

import Footer from "@/components/common/Footer";

export default async function DashboardPage() {
  const session = await auth(); // Get the session using our server-side helper

  // If no session, redirect to login
  if (!session || !session.user) {
    redirect('/auth');
  }

  // --- Fetch Timesheet Data from Local API Endpoint ---
  let timesheets: TimesheetWeek[] = [];
  let fetchError: string | null = null;

  try {
    // Get all incoming request headers as a plain object for easier manipulation
    const incomingHeaders = Object.fromEntries((await headers()).entries());

    // Extract the 'cookie' header directly
    const cookieHeader = incomingHeaders.cookie; // Access directly as a property

    // Construct the headers object for the fetch request
    const fetchHeaders: HeadersInit = {
      'Content-Type': 'application/json', // Always good to specify content type for API requests
    };

    if (cookieHeader) {
      fetchHeaders['Cookie'] = cookieHeader; // Assign the cookie header if it exists
    }

    // Using process.env.NEXT_PUBLIC_APP_URL is generally more semantic for the app's base URL
    // compared to NEXTAUTH_URL, but both can work if configured correctly.
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/timesheets`, {
      method: 'GET',
      headers: fetchHeaders, // Use the correctly constructed headers object
      cache: 'no-store', // Ensures fresh data on every request to this page
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Log the full response to help debug unexpected API behavior
      console.error('API Timesheets Fetch Error Response:', response.status, response.statusText, errorText);
      throw new Error(`Failed to fetch timesheets: ${response.status} ${response.statusText} - ${errorText}`);
    }

    timesheets = await response.json();
    // console.log('Fetched timesheets:', timesheets); // Keep for debugging if needed

  } catch (error: unknown) {
    // Fixed: Replace 'any' with 'unknown' and add proper type checking
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching timesheets in DashboardPage:', error); // More specific log
    fetchError = `Could not load timesheet data: ${errorMessage}`;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header Component - assuming you have this */}
      <Header userName={session?.user?.name || "John Doe"} />

      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Timesheets</h1>

          {fetchError ? (
            <div className="text-red-500 text-center py-8">
              <p>Error loading timesheets: {fetchError}</p>
              <p>Please try refreshing the page.</p>
            </div>
          ) : timesheets.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <p>No timesheet entries found.</p>
              {/* Optional: Add a button to create a new timesheet here if applicable */}
            </div>
          ) : (
            // Render the TimesheetTable component
            <TimesheetTable timesheetWeeks={timesheets} />
          )}
        </div>
      </main>

      <Footer />
      
    </div>
  );
}