import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ThisWeeksTimesheet from '@/components/common/ThisWeeksTimesheet';

export default async function NewTimesheetPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/auth');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header userName={session.user.name || 'John Doe'} />

      <main className="p-4 sm:p-6 lg:p-8 flex-1">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
          <ThisWeeksTimesheet />
        </div>
      </main>

      <div className="p-4 sm:p-6 lg:p-8">
        <Footer />
      </div>
    </div>
  );
}