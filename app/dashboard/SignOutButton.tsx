'use client';

import { signOut } from 'next-auth/react';
import { clearAdditionalData } from '@/lib/hybridMockData';
import Button from '../../components/ui/Button';

export default function SignOutButton() {
  const handleSignOut = async () => {
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