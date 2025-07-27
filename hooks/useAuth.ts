import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signIn: typeof signIn;
  signOut: () => Promise<void>;
  requireAuth: () => void;
}

export default function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const router = useRouter();

  const user = useMemo(() => {
    if (session?.user) {
      return {
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
      };
    }
    return null;
  }, [session]);

  const isAuthenticated = status === 'authenticated' && !!session;
  const loading = status === 'loading';
  const error = status === 'unauthenticated' && !loading ? null : null;

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({ callbackUrl: '/auth' });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }, []);

  const requireAuth = useCallback(() => {
    if (!isAuthenticated && !loading) {
      throw new Error('Authentication required');
    }
  }, [isAuthenticated, loading]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    signIn,
    signOut: handleSignOut,
    requireAuth,
  };
}