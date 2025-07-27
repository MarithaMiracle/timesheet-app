// app/dashboard/SignOutButton.tsx - Fixed to clear hybrid data
'use client';

import { signOut } from 'next-auth/react';
import { clearAdditionalData } from '@/lib/hybridMockData'; // Use hybrid system
import Button from '../../components/ui/Button';

export default function SignOutButton() {
  const handleSignOut = async () => {
    // Clear all user-added timesheet data from sessionStorage
    clearAdditionalData();
    console.log("🧹 Cleared all user timesheet data");
    
    // Sign out
    await signOut({ callbackUrl: `${window.location.origin}/auth` });
  };

  return (
    <Button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
      Sign Out
    </Button>
  );
}