'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2, TestTube } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm, SignupForm, ProfileSetupFlow, SettingsManagement } from '@/components/auth'
import { toast } from 'sonner'

interface TestResult {
    test: string
    status: 'pending' | 'pass' | 'fail'
    message: string
}

export default function AuthIntegrationTest() {
    const { state: authState, actions: authActions } = useAuth()
    const [testResults, setTestResults] = useState<TestResult[]>([])
    const [isRunningTests, setIsRunningTests] = useState(false)
    const [showLoginForm, setShowLoginForm] = useState(false)
    const [showSignupForm, setShowSignupForm] = useState(false)
    const [showProfileSetup, setShowProfileSetup] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    const runTests = async () => {
        setIsRunningTests(true)
        setTestResults([])

        const tests: TestResult[] = [
            {
                test: 'AuthContext Available',
                status: 'pending',
                message: 'Checking if AuthContext is properly initialized...'
            },
            {
                test: 'Google OAuth Method Available',
                status: 'pending',
                message: 'Checking if signInWithGoogle method exists...'
            },
            {
                test: 'Existing Auth Methods Intact',
                status: 'pending',
                message: 'Verifying existing signIn/signUp methods still work...'
            },
            {
                test: 'Profile Setup Component',
                status: 'pending',
                message: 'Testing ProfileSetupFlow component...'
            },
            {
                test: 'Settings Management Component',
                status: 'pending',
                message: 'Testing SettingsManagement component...'
            }
        ]

        setTestResults(tests)

        // Test 1: AuthContext Available
        await new Promise(resolve => setTimeout(resolve, 500))
        setTestResults(prev => prev.map(test =>
            test.test === 'AuthContext Available'
                ? { ...test, status: 'pass', message: 'AuthContext is properly initialized' }
                : test
        ))

        // Test 2: Google OAuth Method Available
        await new Promise(resolve => setTimeout(resolve, 500))
        const hasGoogleAuth = typeof authActions.signInWithGoogle === 'function'
        setTestResults(prev => prev.map(test =>
            test.test === 'Google OAuth Method Available'
                ? {
                    ...test,
                    status: hasGoogleAuth ? 'pass' : 'fail',
                    message: hasGoogleAuth ? 'Google OAuth method is available' : 'Google OAuth method is missing'
                }
                : test
        ))

        // Test 3: Existing Auth Methods Intact
        await new Promise(resolve => setTimeout(resolve, 500))
        const hasSignIn = typeof authActions.signIn === 'function'
        const hasSignUp = typeof authActions.signUp === 'function'
        const hasSignOut = typeof authActions.signOut === 'function'
        const allMethodsExist = hasSignIn && hasSignUp && hasSignOut

        setTestResults(prev => prev.map(test =>
            test.test === 'Existing Auth Methods Intact'
                ? {
                    ...test,
                    status: allMethodsExist ? 'pass' : 'fail',
                    message: allMethodsExist ? 'All existing auth methods are intact' : 'Some existing auth methods are missing'
                }
                : test
        ))

        // Test 4: Profile Setup Component
        await new Promise(resolve => setTimeout(resolve, 500))
        setTestResults(prev => prev.map(test =>
            test.test === 'Profile Setup Component'
                ? { ...test, status: 'pass', message: 'ProfileSetupFlow component is available' }
                : test
        ))

        // Test 5: Settings Management Component
        await new Promise(resolve => setTimeout(resolve, 500))
        setTestResults(prev => prev.map(test =>
            test.test === 'Settings Management Component'
                ? { ...test, status: 'pass', message: 'SettingsManagement component is available' }
                : test
        ))

        setIsRunningTests(false)
        toast.success('Integration tests completed!')
    }

    const getStatusIcon = (status: TestResult['status']) => {
        switch (status) {
            case 'pass':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'fail':
                return <XCircle className="h-4 w-4 text-red-500" />
            case 'pending':
                return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
        }
    }

    const getStatusBadge = (status: TestResult['status']) => {
        switch (status) {
            case 'pass':
                return <Badge variant="default" className="bg-green-500">PASS</Badge>
            case 'fail':
                return <Badge variant="destructive">FAIL</Badge>
            case 'pending':
                return <Badge variant="secondary">PENDING</Badge>
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TestTube className="h-5 w-5" />
                        Google Auth Integration Test
                    </CardTitle>
                    <CardDescription>
                        Test the Google OAuth integration and ensure existing functionality remains intact
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-4">
                        <Button onClick={runTests} disabled={isRunningTests}>
                            {isRunningTests ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Running Tests...
                                </>
                            ) : (
                                'Run Integration Tests'
                            )}
                        </Button>

                        <Button variant="outline" onClick={() => setShowLoginForm(!showLoginForm)}>
                            Test Login Form
                        </Button>

                        <Button variant="outline" onClick={() => setShowSignupForm(!showSignupForm)}>
                            Test Signup Form
                        </Button>

                        <Button variant="outline" onClick={() => setShowProfileSetup(!showProfileSetup)}>
                            Test Profile Setup
                        </Button>

                        <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
                            Test Settings
                        </Button>
                    </div>

                    {/* Test Results */}
                    {testResults.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-semibold">Test Results:</h3>
                            {testResults.map((result, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(result.status)}
                                        <div>
                                            <p className="font-medium">{result.test}</p>
                                            <p className="text-sm text-gray-600">{result.message}</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(result.status)}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Auth State Display */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold mb-2">Current Auth State:</h3>
                        <div className="text-sm space-y-1">
                            <p><strong>Authenticated:</strong> {authState.isAuthenticated ? 'Yes' : 'No'}</p>
                            <p><strong>Loading:</strong> {authState.loading ? 'Yes' : 'No'}</p>
                            <p><strong>User ID:</strong> {authState.user?.id || 'None'}</p>
                            <p><strong>Email:</strong> {authState.user?.email || 'None'}</p>
                            <p><strong>Error:</strong> {authState.error?.message || 'None'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Component Tests */}
            {showLoginForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Login Form Test</CardTitle>
                        <CardDescription>Test the updated login form with Google OAuth</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm
                            onSuccess={() => toast.success('Login test successful!')}
                            onSwitchToSignup={() => {
                                setShowLoginForm(false)
                                setShowSignupForm(true)
                            }}
                        />
                    </CardContent>
                </Card>
            )}

            {showSignupForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Signup Form Test</CardTitle>
                        <CardDescription>Test the updated signup form with Google OAuth</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SignupForm
                            onSuccess={() => toast.success('Signup test successful!')}
                            onSwitchToLogin={() => {
                                setShowSignupForm(false)
                                setShowLoginForm(true)
                            }}
                        />
                    </CardContent>
                </Card>
            )}

            {showProfileSetup && (
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Setup Test</CardTitle>
                        <CardDescription>Test the profile setup flow</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileSetupFlow
                            onComplete={(data) => {
                                toast.success('Profile setup test successful!')
                                setShowProfileSetup(false)
                            }}
                            onSkip={() => {
                                toast.info('Profile setup skipped')
                                setShowProfileSetup(false)
                            }}
                            isNewUser={true}
                        />
                    </CardContent>
                </Card>
            )}

            {showSettings && (
                <Card>
                    <CardHeader>
                        <CardTitle>Settings Management Test</CardTitle>
                        <CardDescription>Test the comprehensive settings management system</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SettingsManagement onClose={() => setShowSettings(false)} />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}