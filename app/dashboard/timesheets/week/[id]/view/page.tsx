import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ThisWeeksTimesheet from '@/components/common/ThisWeeksTimesheet';

import { TimesheetWeek } from '@/types/timesheet';

interface ViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewTimesheetPage({ params }: ViewPageProps) {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/auth');
  }

  const { id } = await params;
  let timesheet: TimesheetWeek | null = null;
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/timesheets/${id}`, {
      method: 'GET',
      headers: fetchHeaders,
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Timesheet fetch error:', res.status, res.statusText, errorText);
      throw new Error(`Failed to load timesheet ${id}`);
    }

    timesheet = await res.json();
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Error fetching timesheet for view page:', errorMessage);
    fetchError = `Could not load timesheet: ${errorMessage}`;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header userName={session.user.name || 'John Doe'} />

      <main className="p-4 sm:p-6 lg:p-8 flex-1">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
          {fetchError ? (
            <p className="text-red-500 text-center py-8">{fetchError}</p>
          ) : timesheet ? (
            <ThisWeeksTimesheet timesheet={timesheet} />
          ) : (
            <p className="text-gray-500 text-center py-8">Loading...</p>
          )}
        </div>
      </main>

      <div className="p-4 sm:p-6 lg:p-8">
        <Footer />
      </div>
    </div>
  );
}