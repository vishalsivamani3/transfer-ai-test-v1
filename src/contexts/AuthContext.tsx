'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { toast } from 'sonner'

// Auth state interface
interface AuthState {
    user: User | null
    session: Session | null
    loading: boolean
    error: AuthError | null
    isAuthenticated: boolean
    isInitialized: boolean
}

// Auth actions interface
interface AuthActions {
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean; error?: string }>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
    updateProfile: (updates: any) => Promise<{ success: boolean; error?: string }>
    clearError: () => void
}

// Auth context type
interface AuthContextType {
    state: AuthState
    actions: AuthActions
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null)

// Auth provider props
interface AuthProviderProps {
    children: ReactNode
    fallbackUser?: User | null // For development/testing
}

// Auth provider component
export function AuthProvider({ children, fallbackUser }: AuthProviderProps) {
    const [state, setState] = useState<AuthState>({
        user: fallbackUser || null,
        session: null,
        loading: true,
        error: null,
        isAuthenticated: !!fallbackUser,
        isInitialized: false
    })

    const supabase = createClientComponentClient()

    // Initialize auth state
    useEffect(() => {
        let mounted = true

        const initializeAuth = async () => {
            try {
                // If we have a fallback user (for development), use it
                if (fallbackUser) {
                    setState(prev => ({
                        ...prev,
                        user: fallbackUser,
                        isAuthenticated: true,
                        loading: false,
                        isInitialized: true
                    }))
                    return
                }

                // Get initial session
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.warn('Auth initialization error:', error)
                    // Don't throw - allow app to continue in unauthenticated state
                }

                if (mounted) {
                    setState(prev => ({
                        ...prev,
                        user: session?.user || null,
                        session: session,
                        isAuthenticated: !!session?.user,
                        loading: false,
                        isInitialized: true,
                        error: error
                    }))
                }
            } catch (error) {
                console.error('Auth initialization failed:', error)
                if (mounted) {
                    setState(prev => ({
                        ...prev,
                        loading: false,
                        isInitialized: true,
                        error: error as AuthError
                    }))
                }
            }
        }

        initializeAuth()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return

                console.log('Auth state changed:', event, session?.user?.id)

                setState(prev => ({
                    ...prev,
                    user: session?.user || null,
                    session: session,
                    isAuthenticated: !!session?.user,
                    error: null
                }))

                // Show toast for auth events
                if (event === 'SIGNED_IN') {
                    toast.success('Welcome back!')
                } else if (event === 'SIGNED_OUT') {
                    toast.info('You have been signed out')
                }
            }
        )

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [supabase.auth, fallbackUser])

    // Auth actions
    const actions: AuthActions = {
        signIn: async (email: string, password: string) => {
            try {
                setState(prev => ({ ...prev, loading: true, error: null }))

                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if (error) {
                    setState(prev => ({ ...prev, loading: false, error }))
                    return { success: false, error: error.message }
                }

                setState(prev => ({ ...prev, loading: false }))
                return { success: true }
            } catch (error) {
                const authError = error as AuthError
                setState(prev => ({ ...prev, loading: false, error: authError }))
                return { success: false, error: authError.message }
            }
        },

        signUp: async (email: string, password: string, metadata?: any) => {
            try {
                setState(prev => ({ ...prev, loading: true, error: null }))

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: metadata
                    }
                })

                if (error) {
                    setState(prev => ({ ...prev, loading: false, error }))
                    return { success: false, error: error.message }
                }

                setState(prev => ({ ...prev, loading: false }))
                return { success: true }
            } catch (error) {
                const authError = error as AuthError
                setState(prev => ({ ...prev, loading: false, error: authError }))
                return { success: false, error: authError.message }
            }
        },

        signOut: async () => {
            try {
                setState(prev => ({ ...prev, loading: true, error: null }))

                const { error } = await supabase.auth.signOut()

                if (error) {
                    setState(prev => ({ ...prev, loading: false, error }))
                    throw error
                }

                setState(prev => ({ ...prev, loading: false }))
            } catch (error) {
                const authError = error as AuthError
                setState(prev => ({ ...prev, loading: false, error: authError }))
                throw authError
            }
        },

        resetPassword: async (email: string) => {
            try {
                setState(prev => ({ ...prev, loading: true, error: null }))

                const { error } = await supabase.auth.resetPasswordForEmail(email)

                if (error) {
                    setState(prev => ({ ...prev, loading: false, error }))
                    return { success: false, error: error.message }
                }

                setState(prev => ({ ...prev, loading: false }))
                return { success: true }
            } catch (error) {
                const authError = error as AuthError
                setState(prev => ({ ...prev, loading: false, error: authError }))
                return { success: false, error: authError.message }
            }
        },

        updateProfile: async (updates: any) => {
            try {
                setState(prev => ({ ...prev, loading: true, error: null }))

                const { error } = await supabase.auth.updateUser({
                    data: updates
                })

                if (error) {
                    setState(prev => ({ ...prev, loading: false, error }))
                    return { success: false, error: error.message }
                }

                setState(prev => ({ ...prev, loading: false }))
                return { success: true }
            } catch (error) {
                const authError = error as AuthError
                setState(prev => ({ ...prev, loading: false, error: authError }))
                return { success: false, error: authError.message }
            }
        },

        clearError: () => {
            setState(prev => ({ ...prev, error: null }))
        }
    }

    const value: AuthContextType = {
        state,
        actions
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook to use auth context
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}

// Hook for auth state only (no actions)
export function useAuthState(): AuthState {
    const { state } = useAuth()
    return state
}

// Hook for auth actions only
export function useAuthActions(): AuthActions {
    const { actions } = useAuth()
    return actions
}

// Development helper - creates a mock user for testing
export function createMockUser(overrides: Partial<User> = {}): User {
    return {
        id: 'mock-user-id',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {
            full_name: 'Test User',
            currentCollege: 'Test College',
            targetMajor: 'Computer Science',
            gpa: '3.5',
            transferTimeline: '2-year'
        },
        aud: 'authenticated',
        ...overrides
    } as User
}