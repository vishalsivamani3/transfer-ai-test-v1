'use client'

import React, { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Lock, AlertCircle } from 'lucide-react'

// Auth guard props
interface AuthGuardProps {
    children: ReactNode
    fallback?: ReactNode
    requireAuth?: boolean
    redirectTo?: string
    onUnauthorized?: () => void
}

// Auth guard component
export function AuthGuard({
    children,
    fallback,
    requireAuth = true,
    redirectTo,
    onUnauthorized
}: AuthGuardProps) {
    const { state } = useAuth()

    // Show loading state while auth is initializing
    if (!state.isInitialized || state.loading) {
        return fallback || (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-sm text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // Show error state if auth failed to initialize
    if (state.error && !state.isAuthenticated) {
        return fallback || (
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-5 w-5" />
                        Authentication Error
                    </CardTitle>
                    <CardDescription>
                        There was an issue with authentication, but you can still use the app
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {state.error.message || 'Authentication service unavailable'}
                        </AlertDescription>
                    </Alert>
                    <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="w-full"
                    >
                        Retry
                    </Button>
                </CardContent>
            </Card>
        )
    }

    // Check authentication requirement
    if (requireAuth && !state.isAuthenticated) {
        if (onUnauthorized) {
            onUnauthorized()
        }

        return fallback || (
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Authentication Required
                    </CardTitle>
                    <CardDescription>
                        Please sign in to access this feature
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                        This feature requires you to be signed in to your account.
                    </p>
                    {redirectTo && (
                        <Button
                            onClick={() => window.location.href = redirectTo}
                            className="w-full"
                        >
                            Go to Sign In
                        </Button>
                    )}
                </CardContent>
            </Card>
        )
    }

    // Render children if auth requirements are met
    return <>{children}</>
}

// HOC for protecting components
export function withAuthGuard<P extends object>(
    Component: React.ComponentType<P>,
    options: Omit<AuthGuardProps, 'children'> = {}
) {
    const WrappedComponent = (props: P) => (
        <AuthGuard {...options}>
            <Component {...props} />
        </AuthGuard>
    )

    WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`

    return WrappedComponent
}

// HOC for optional auth (shows different content based on auth state)
export function withOptionalAuth<P extends object>(
    Component: React.ComponentType<P>,
    UnauthenticatedComponent?: React.ComponentType<P>
) {
    const WrappedComponent = (props: P) => {
        const { state } = useAuth()

        if (!state.isInitialized || state.loading) {
            return (
                <div className="flex items-center justify-center min-h-[200px]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )
        }

        if (!state.isAuthenticated && UnauthenticatedComponent) {
            return <UnauthenticatedComponent {...props} />
        }

        return <Component {...props} />
    }

    WrappedComponent.displayName = `withOptionalAuth(${Component.displayName || Component.name})`

    return WrappedComponent
}