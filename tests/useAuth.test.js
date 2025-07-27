import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('next-auth/react', () => ({
    useSession: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
}))

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}))

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import useAuth from '../hooks/useAuth'

describe('useAuth', () => {
    const mockPush = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        useRouter.mockReturnValue({
            push: mockPush,
        })
    })

    it('should return authenticated state when user is logged in', () => {
        useSession.mockReturnValue({
            data: {
                user: {
                    id: '1',
                    name: 'John Doe',
                    email: 'john@example.com'
                }
            },
            status: 'authenticated'
        })

        const { result } = renderHook(() => useAuth())

        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.user).toEqual({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com'
        })
        expect(result.current.loading).toBe(false)
    })

    it('should return unauthenticated state when user is not logged in', () => {
        useSession.mockReturnValue({
            data: null,
            status: 'unauthenticated'
        })

        const { result } = renderHook(() => useAuth())

        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.user).toBe(null)
        expect(result.current.loading).toBe(false)
    })

    it('should return loading state', () => {
        useSession.mockReturnValue({
            data: null,
            status: 'loading'
        })

        const { result } = renderHook(() => useAuth())

        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.user).toBe(null)
        expect(result.current.loading).toBe(true)
    })
})