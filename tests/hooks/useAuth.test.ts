// tests/hooks/useAuth.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import useAuth from '../../hooks/useAuth';
import { Session } from 'next-auth';

// Mock next-auth
jest.mock('next-auth/react');
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns authenticated state when user is logged in', async () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        expires: '2024-12-31'
      },
      status: 'authenticated'
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      });
      expect(result.current.loading).toBe(false);
    });
  });

  it('returns unauthenticated state when user is not logged in', async () => {
    mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: function (data?: any): Promise<Session | null> {
            throw new Error('Function not implemented.');
        }
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.loading).toBe(false);
    });
  });

  it('returns loading state while session is being fetched', () => {
    mockUseSession.mockReturnValue({
        data: null,
        status: 'loading',
        update: function (data?: any): Promise<Session | null> {
            throw new Error('Function not implemented.');
        }
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('handles session errors gracefully', async () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated'
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it('provides requireAuth function that throws when not authenticated', () => {
    mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: function (data?: any): Promise<Session | null> {
            throw new Error('Function not implemented.');
        }
    });

    const { result } = renderHook(() => useAuth());

    expect(() => result.current.requireAuth()).toThrow('Authentication required');
  });

  it('requireAuth function passes when authenticated', () => {
    mockUseSession.mockReturnValue({
      data: {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        expires: '2024-12-31'
      },
      status: 'authenticated'
    });

    const { result } = renderHook(() => useAuth());

    expect(() => result.current.requireAuth()).not.toThrow();
  });
});