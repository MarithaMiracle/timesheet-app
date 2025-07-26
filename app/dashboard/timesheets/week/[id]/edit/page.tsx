// app/dashboard/timesheets/week/[id]/edit/page.tsx

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ThisWeeksTimesheet from '@/components/common/ThisWeeksTimesheet';

import { TimesheetWeek } from '@/lib/mockData';

interface EditPageProps {
  params: Promise<{ id: string }>; // Changed to Promise
}

export default async function EditTimesheetPage({ params }: EditPageProps) {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/auth');
  }

  const { id } = await params; // AWAIT params here
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
  } catch (err: any) {
    console.error('Error fetching timesheet for edit page:', err.message);
    fetchError = `Could not load timesheet: ${err.message}`;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header userName={session.user.name || 'John Doe'} />

      <main className="p-4 md:p-8 flex-grow">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Timesheet</h1>

          {fetchError ? (
            <p className="text-red-500">{fetchError}</p>
          ) : timesheet ? (
            <ThisWeeksTimesheet timesheet={timesheet} />
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}