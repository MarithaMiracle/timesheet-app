// app/dashboard/SignOutButton.tsx - Updated
'use client';

import { signOut } from 'next-auth/react';
import { clearPersistentMockData } from '@/lib/persistentMockData';
import Button from '../../components/ui/Button';

export default function SignOutButton() {
  const handleSignOut = async () => {
    // Clear all persistent timesheet data
    clearPersistentMockData();
    
    // Sign out
    await signOut({ callbackUrl: `${window.location.origin}/auth` });
  };

  return (
    <Button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
      Sign Out
    </Button>
  );
}