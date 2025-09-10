'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    AuthProvider,
    useAuth,
    AuthGuard,
    AuthModal,
    UserProfile,
    createMockUser
} from './index'
import { LogIn, User, Shield, AlertTriangle } from 'lucide-react'

// Demo component that shows auth state
function AuthStatus() {
    const { state } = useAuth()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Authentication Status
                </CardTitle>
                <CardDescription>
                    Current authentication state and user information
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Status</p>
                        <Badge variant={state.isAuthenticated ? 'default' : 'secondary'}>
                            {state.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-gray-600">Loading</p>
                        <Badge variant={state.loading ? 'default' : 'outline'}>
                            {state.loading ? 'Loading...' : 'Ready'}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-gray-600">Initialized</p>
                        <Badge variant={state.isInitialized ? 'default' : 'destructive'}>
                            {state.isInitialized ? 'Yes' : 'No'}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-gray-600">Error</p>
                        <Badge variant={state.error ? 'destructive' : 'outline'}>
                            {state.error ? 'Error' : 'None'}
                        </Badge>
                    </div>
                </div>

                {state.user && (
                    <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">User Information</h4>
                        <div className="space-y-1 text-sm">
                            <p><span className="text-gray-600">Email:</span> {state.user.email}</p>
                            <p><span className="text-gray-600">ID:</span> {state.user.id}</p>
                            <p><span className="text-gray-600">Created:</span> {new Date(state.user.created_at).toLocaleDateString()}</p>
                            {state.user.user_metadata?.full_name && (
                                <p><span className="text-gray-600">Name:</span> {state.user.user_metadata.full_name}</p>
                            )}
                        </div>
                    </div>
                )}

                {state.error && (
                    <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2 text-red-600 flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            Error Details
                        </h4>
                        <p className="text-sm text-red-600">{state.error.message}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// Protected content component
function ProtectedContent() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Protected Content
                </CardTitle>
                <CardDescription>
                    This content is only visible to authenticated users
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-green-600 font-medium">
                    🎉 You are successfully authenticated and can see this protected content!
                </p>
                <p className="text-sm text-gray-600 mt-2">
                    This demonstrates how the AuthGuard component protects content based on authentication state.
                </p>
            </CardContent>
        </Card>
    )
}

// Main demo component
function AuthDemoContent() {
    const { state, actions } = useAuth()
    const [showAuthModal, setShowAuthModal] = useState(false)

    const handleSignOut = async () => {
        try {
            await actions.signOut()
        } catch (error) {
            console.error('Sign out error:', error)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Authentication System Demo</h1>
                <p className="text-gray-600">
                    This demo shows the modular authentication system in action
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AuthStatus />

                <Card>
                    <CardHeader>
                        <CardTitle>User Profile</CardTitle>
                        <CardDescription>
                            User profile component with dropdown menu
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {state.isAuthenticated ? (
                            <div className="space-y-4">
                                <UserProfile />
                                <Button onClick={handleSignOut} variant="outline" className="w-full">
                                    Sign Out
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <p className="text-gray-600">No user profile to display</p>
                                <Button onClick={() => setShowAuthModal(true)} className="w-full">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Sign In
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Protected Content Example */}
            <AuthGuard
                requireAuth={true}
                fallback={
                    <Card>
                        <CardHeader>
                            <CardTitle>Protected Content</CardTitle>
                            <CardDescription>
                                This content requires authentication
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">
                                Please sign in to view this protected content.
                            </p>
                            <Button onClick={() => setShowAuthModal(true)}>
                                <LogIn className="mr-2 h-4 w-4" />
                                Sign In
                            </Button>
                        </CardContent>
                    </Card>
                }
            >
                <ProtectedContent />
            </AuthGuard>

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => setShowAuthModal(false)}
            />
        </div>
    )
}

// Main demo component with auth provider
export function AuthDemo() {
    // For development, you can use a mock user
    const mockUser = process.env.NODE_ENV === 'development' ? createMockUser() : null

    return (
        <AuthProvider fallbackUser={mockUser}>
            <AuthDemoContent />
        </AuthProvider>
    )
}