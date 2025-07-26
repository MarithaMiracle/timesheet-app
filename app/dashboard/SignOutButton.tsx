// app/dashboard/SignOutButton.tsx
'use client';

import { signOut } from 'next-auth/react';
import Button from '../../components/ui/Button'; // Assuming your Button component path

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: `${window.location.origin}/auth` });
 // Redirect to login after sign out
  };

  return (
    <Button onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
      Sign Out
    </Button>
  );
}