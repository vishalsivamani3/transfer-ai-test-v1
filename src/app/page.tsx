'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import {
    User,
    GraduationCap,
    BookOpen,
    Target,
    TrendingUp,
    Clock,
    Star,
    CheckCircle,
    AlertCircle,
    Plus,
    School,
    FileText,
    ArrowLeft
} from 'lucide-react'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { User as UserType, StudentProfile, DashboardData, OnboardingData, AuthFormData } from '@/types'
import {
    formatGPA,
    calculateProgress,
    getAcademicYearLabel,
    getTimelineLabel,
    generateTransferPathways,
    generateCourseRecommendations
} from '@/lib/utils'
import { TransferPathwaysTable } from '@/components/TransferPathwaysTable'
import CourseDashboard from '@/components/CourseDashboard'
import StudentProfileForm from '@/components/StudentProfileForm'
import SemesterPlanner from '@/components/SemesterPlanner'
import DashboardLayout from '@/components/DashboardLayout'
import AssistDataSearch from '@/components/AssistDataSearch'
import { TransferDataProvider } from '@/contexts/TransferDataContext'
import { useAuth } from '@/contexts/AuthContext'
import IntegratedCourseDashboard from '@/components/IntegratedCourseDashboard'
import IntegratedSemesterPlanner from '@/components/IntegratedSemesterPlanner'
import IntegratedTransferPathways from '@/components/IntegratedTransferPathways'
import IntegratedOverview from '@/components/IntegratedOverview'
import IntegratedProfileManagement from '@/components/IntegratedProfileManagement'
import TransferPathwayBrowser from '@/components/TransferPathwayBrowser'
import TransferApplicationTracker from '@/components/TransferApplicationTracker'
import GPACalculator from '@/components/GPACalculator'
import FinancialCostCalculator from '@/components/FinancialCostCalculator'
import BudgetingTableau from '@/components/BudgetingTableau'
import CourseAffordabilityInsights from '@/components/CourseAffordabilityInsights'
import {
    colleges as assistColleges,
    transferAgreements as assistTransferAgreements,
    getTransferAgreementsByCollege,
    getCollegesByType,
    getDataStatistics
} from '@/data/assist/utils'

export default function TransferAI() {
    const { state: authState, actions: authActions } = useAuth()
    const [user, setUser] = useState<UserType | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentView, setCurrentView] = useState<'login' | 'signup' | 'onboarding' | 'dashboard' | 'docs'>('login')
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        console.log('TransferAI component mounted')
        checkSession()
    }, [])

    // Update user state when auth state changes
    useEffect(() => {
        if (authState.user) {
            const userData: UserType = {
                id: authState.user.id,
                email: authState.user.email || '',
                user_metadata: {
                    firstName: authState.user.user_metadata?.firstName || '',
                    lastName: authState.user.user_metadata?.lastName || '',
                    currentCollege: authState.user.user_metadata?.currentCollege || '',
                    academicYear: authState.user.user_metadata?.academicYear || ''
                }
            }
            setUser(userData)
            if (authState.session?.access_token) {
                loadDashboardData(authState.session.access_token, userData)
            }
        } else {
            setUser(null)
        }
    }, [authState.user, authState.session])

    const checkSession = async () => {
        try {
            console.log('Checking session...')
            const { data: { session } } = await supabase.auth.getSession()
            console.log('Session data:', session)
            if (session?.user) {
                // Convert Supabase User to our UserType
                const userData: UserType = {
                    id: session.user.id,
                    email: session.user.email || '',
                    user_metadata: {
                        firstName: session.user.user_metadata?.firstName || '',
                        lastName: session.user.user_metadata?.lastName || '',
                        currentCollege: session.user.user_metadata?.currentCollege || '',
                        academicYear: session.user.user_metadata?.academicYear || ''
                    }
                }
                console.log('Setting user data:', userData)
                setUser(userData)
                await loadDashboardData(session.access_token, userData)
            } else {
                console.log('No session found, showing login')
            }
        } catch (error) {
            console.error('Session check error:', error)
            setError('Failed to check session')
        } finally {
            setLoading(false)
        }
    }

    const loadDashboardData = async (accessToken: string, userData?: UserType) => {
        try {
            console.log('Loading dashboard data...')
            const currentUser = userData || user
            // Mock dashboard data for demo
            const mockProfile: StudentProfile = {
                userId: currentUser?.id || '',
                email: currentUser?.email || '',
                firstName: currentUser?.user_metadata?.firstName || 'Student',
                lastName: currentUser?.user_metadata?.lastName || '',
                currentCollege: currentUser?.user_metadata?.currentCollege || 'Community College',
                academicYear: currentUser?.user_metadata?.academicYear || 'sophomore',
                onboardingCompleted: true,
                intendedMajor: 'Computer Science',
                targetUniversities: ['UCLA', 'UC Berkeley', 'USC'],
                preferredTransferTimeline: '2-year',
                currentGPA: 3.45,
                completedCredits: 24,
                transferGoals: ['Maximize transfer credits', 'Maintain high GPA'],
                careerInterests: ['Technology/Software', 'Engineering'],
                completedCourses: [],
                currentCourses: [],
                plannedCourses: []
            }

            const mockData: DashboardData = {
                profile: mockProfile,
                analysis: {},
                courseRecommendations: generateCourseRecommendations(mockProfile),
                progressMetrics: {
                    creditsCompleted: 24,
                    targetCredits: 60,
                    gpa: 3.45,
                    coursesInProgress: 4,
                    transferPathwaysAnalyzed: 3
                },
                transferPathways: generateTransferPathways(mockProfile)
            }

            setDashboardData(mockData)
            setCurrentView(mockData.profile.onboardingCompleted ? 'dashboard' : 'onboarding')
        } catch (error) {
            console.error('Dashboard load error:', error)
        }
    }

    const handleSignup = async (formData: AuthFormData) => {
        try {
            setLoading(true)

            // Mock signup for demo
            const mockUser: UserType = {
                id: 'mock-user-id',
                email: formData.email,
                user_metadata: {
                    firstName: formData.firstName || '',
                    lastName: formData.lastName || '',
                    currentCollege: formData.currentCollege || '',
                    academicYear: formData.academicYear || 'freshman'
                }
            }

            toast.success('Account created successfully!')
            setUser(mockUser)
            setCurrentView('onboarding')
        } catch (error) {
            console.error('Signup error:', error)
            setError('Network error during signup')
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = async (email: string, password: string) => {
        try {
            setLoading(true)

            // Mock login for demo
            const mockUser: UserType = {
                id: 'mock-user-id',
                email: email,
                user_metadata: {
                    firstName: 'Demo',
                    lastName: 'Student',
                    currentCollege: 'Santa Monica College',
                    academicYear: 'sophomore'
                }
            }

            setUser(mockUser)
            await loadDashboardData('mock-token', mockUser)
        } catch (error) {
            console.error('Login error:', error)
            setError('Login failed')
        } finally {
            setLoading(false)
        }
    }

    const handleCompleteOnboarding = async (onboardingData: OnboardingData) => {
        try {
            setLoading(true)

            toast.success('Onboarding completed!')
            await loadDashboardData('mock-token', user || undefined)
        } catch (error) {
            console.error('Onboarding error:', error)
            setError('Failed to complete onboarding')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await authActions.signOut()
        setUser(null)
        setDashboardData(null)
        setCurrentView('login')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading Transfer.ai...</p>
                </div>
            </div>
        )
    }

    try {
        // Documentation view
        if (currentView === 'docs') {
            return (
                <div>
                    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between items-center h-16">
                                <Button
                                    variant="outline"
                                    onClick={() => setCurrentView(user ? 'dashboard' : 'login')}
                                    className="flex items-center"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to App
                                </Button>
                                <div className="flex items-center">
                                    <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
                                    <span className="text-2xl font-bold text-blue-600">Transfer.ai</span>
                                    <Badge variant="outline" className="ml-3">Documentation</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                    <UserJourneyDocs />
                </div>
            )
        }

        if (!user) {
            return <AuthView
                currentView={currentView}
                setCurrentView={setCurrentView}
                onSignup={handleSignup}
                onLogin={handleLogin}
                error={error}
                setError={setError}
            />
        }

        if (currentView === 'onboarding') {
            return <OnboardingView
                user={user}
                onComplete={handleCompleteOnboarding}
                error={error}
            />
        }

        if (!dashboardData) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading dashboard data...</p>
                    </div>
                </div>
            )
        }

        return (
            <TransferDataProvider>
                <DashboardView
                    user={user}
                    dashboardData={dashboardData}
                    onLogout={handleLogout}
                    refreshDashboard={() => loadDashboardData('', user || undefined)}
                    setCurrentView={setCurrentView}
                />
            </TransferDataProvider>
        )
    } catch (error) {
        console.error('Render error:', error)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h1>
                    <p className="text-gray-600 mb-4">Please refresh the page or try again later.</p>
                    <Button onClick={() => window.location.reload()}>
                        Refresh Page
                    </Button>
                </div>
            </div>
        )
    }
}

function AuthView({ currentView, setCurrentView, onSignup, onLogin, error, setError }: any) {
    const [formData, setFormData] = useState<AuthFormData>({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        currentCollege: '',
        academicYear: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (currentView === 'signup') {
            onSignup(formData)
        } else {
            onLogin(formData.email, formData.password)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md space-y-4">
                {/* Documentation Access */}
                <div className="text-center">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentView('docs')}
                        className="mb-4"
                    >
                        <FileText className="h-4 w-4 mr-2" />
                        View Documentation & User Journey
                    </Button>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center mb-4">
                            <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
                            <span className="text-2xl font-bold text-blue-600">Transfer.ai</span>
                        </div>
                        <CardTitle>
                            {currentView === 'signup' ? 'Create Your Account' : 'Welcome Back'}
                        </CardTitle>
                        <p className="text-gray-600">
                            {currentView === 'signup'
                                ? 'Start your journey to your dream university'
                                : 'Continue your transfer journey'
                            }
                        </p>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {currentView === 'signup' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="currentCollege">Current College</Label>
                                        <Input
                                            id="currentCollege"
                                            placeholder="e.g., Santa Monica College"
                                            value={formData.currentCollege}
                                            onChange={(e) => setFormData({ ...formData, currentCollege: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="academicYear">Academic Year</Label>
                                        <Select onValueChange={(value) => setFormData({ ...formData, academicYear: value })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your current year" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="freshman">Freshman</SelectItem>
                                                <SelectItem value="sophomore">Sophomore</SelectItem>
                                                <SelectItem value="returning">Returning Student</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                {currentView === 'signup' ? 'Create Account' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentView(currentView === 'signup' ? 'login' : 'signup')
                                    setError('')
                                }}
                                className="text-blue-600 hover:underline"
                            >
                                {currentView === 'signup'
                                    ? 'Already have an account? Sign in'
                                    : "Don't have an account? Sign up"
                                }
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function OnboardingView({ user, onComplete, error }: any) {
    const [step, setStep] = useState(1)
    const [onboardingData, setOnboardingData] = useState<OnboardingData>({
        intendedMajor: '',
        targetUniversities: [],
        preferredTransferTimeline: '',
        currentGPA: 0,
        completedCredits: 0,
        transferGoals: [],
        careerInterests: []
    })

    const handleNext = () => {
        if (step < 4) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleComplete = () => {
        onComplete(onboardingData)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome to Transfer.ai, {user.user_metadata.firstName}!
                    </h1>
                    <p className="text-gray-600">Let's personalize your transfer journey</p>
                    <Progress value={(step / 4) * 100} className="mt-4" />
                </div>

                <Card>
                    <CardContent className="p-6">
                        {error && (
                            <Alert className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {step === 1 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold">Academic Goals</h2>

                                <div>
                                    <Label htmlFor="intendedMajor">Intended Major</Label>
                                    <Input
                                        id="intendedMajor"
                                        placeholder="e.g., Computer Science, Business, Psychology"
                                        value={onboardingData.intendedMajor}
                                        onChange={(e) => setOnboardingData({ ...onboardingData, intendedMajor: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label>Target Universities (select up to 5)</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {['UCLA', 'UC Berkeley', 'USC', 'CSUF', 'CSUN', 'SDSU'].map(uni => (
                                            <label key={uni} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={onboardingData.targetUniversities.includes(uni)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setOnboardingData({
                                                                ...onboardingData,
                                                                targetUniversities: [...onboardingData.targetUniversities, uni]
                                                            })
                                                        } else {
                                                            setOnboardingData({
                                                                ...onboardingData,
                                                                targetUniversities: onboardingData.targetUniversities.filter(u => u !== uni)
                                                            })
                                                        }
                                                    }}
                                                />
                                                <span>{uni}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label>Preferred Transfer Timeline</Label>
                                    <Select onValueChange={(value) => setOnboardingData({ ...onboardingData, preferredTransferTimeline: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="When do you want to transfer?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1-year">1 Year (Next Fall)</SelectItem>
                                            <SelectItem value="2-year">2 Years</SelectItem>
                                            <SelectItem value="flexible">Flexible Timeline</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold">Academic Standing</h2>

                                <div>
                                    <Label htmlFor="currentGPA">Current GPA</Label>
                                    <Input
                                        id="currentGPA"
                                        type="number"
                                        step="0.01"
                                        max="4.0"
                                        placeholder="e.g., 3.25"
                                        value={onboardingData.currentGPA || ''}
                                        onChange={(e) => setOnboardingData({ ...onboardingData, currentGPA: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="completedCredits">Completed Credits</Label>
                                    <Input
                                        id="completedCredits"
                                        type="number"
                                        placeholder="e.g., 24"
                                        value={onboardingData.completedCredits || ''}
                                        onChange={(e) => setOnboardingData({ ...onboardingData, completedCredits: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold">Transfer Goals</h2>

                                <div>
                                    <Label>What are your main transfer goals? (Check all that apply)</Label>
                                    <div className="grid grid-cols-1 gap-2 mt-2">
                                        {[
                                            'Maximize transfer credits',
                                            'Maintain high GPA',
                                            'Complete prerequisites efficiently',
                                            'Get guaranteed admission',
                                            'Minimize time to degree',
                                            'Explore different majors'
                                        ].map(goal => (
                                            <label key={goal} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={onboardingData.transferGoals.includes(goal)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setOnboardingData({
                                                                ...onboardingData,
                                                                transferGoals: [...onboardingData.transferGoals, goal]
                                                            })
                                                        } else {
                                                            setOnboardingData({
                                                                ...onboardingData,
                                                                transferGoals: onboardingData.transferGoals.filter(g => g !== goal)
                                                            })
                                                        }
                                                    }}
                                                />
                                                <span>{goal}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold">Career Interests</h2>

                                <div>
                                    <Label>What career fields interest you? (Check all that apply)</Label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {[
                                            'Technology/Software',
                                            'Healthcare/Medicine',
                                            'Business/Finance',
                                            'Education',
                                            'Engineering',
                                            'Arts/Creative',
                                            'Law/Government',
                                            'Science/Research'
                                        ].map(career => (
                                            <label key={career} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={onboardingData.careerInterests.includes(career)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setOnboardingData({
                                                                ...onboardingData,
                                                                careerInterests: [...onboardingData.careerInterests, career]
                                                            })
                                                        } else {
                                                            setOnboardingData({
                                                                ...onboardingData,
                                                                careerInterests: onboardingData.careerInterests.filter(c => c !== career)
                                                            })
                                                        }
                                                    }}
                                                />
                                                <span>{career}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Alert>
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        You're all set! Transfer.ai will analyze your profile and create personalized recommendations.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                        <div className="flex justify-between mt-8">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={step === 1}
                            >
                                Back
                            </Button>

                            {step < 4 ? (
                                <Button onClick={handleNext}>
                                    Next
                                </Button>
                            ) : (
                                <Button onClick={handleComplete}>
                                    Complete Setup
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function DashboardView({ user, dashboardData, onLogout, refreshDashboard, setCurrentView }: any) {
    const [activeTab, setActiveTab] = useState('overview')

    return (
        <DashboardLayout
            user={user}
            onLogout={onLogout}
            activeTab={activeTab}
            onTabChange={setActiveTab}
        >

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <IntegratedOverview
                    user={user}
                    dashboardData={dashboardData}
                    onNavigate={setActiveTab}
                />
            )}

            {activeTab === 'profile' && (
                <IntegratedProfileManagement user={user} />
            )}

            {activeTab === 'courses' && (
                <IntegratedCourseDashboard
                    studentInstitution={user?.user_metadata?.currentCollege}
                    userId={user?.id}
                />
            )}



            {activeTab === 'planner' && (
                user?.id ? (
                    <IntegratedSemesterPlanner userId={user.id} />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Please log in to access the semester planner.</p>
                    </div>
                )
            )}

            {activeTab === 'applications' && (
                user?.id ? (
                    <TransferApplicationTracker userId={user.id} />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Please log in to track your transfer applications.</p>
                    </div>
                )
            )}

            {activeTab === 'pathways' && (
                <TransferPathwayBrowser userId={user?.id} />
            )}

            {activeTab === 'gpa-calculator' && (
                <GPACalculatorTab />
            )}

            {activeTab === 'financial-calculator' && (
                <FinancialCalculatorTab />
            )}
        </DashboardLayout>
    )
}

function OverviewTab({ dashboardData }: any) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Target className="h-5 w-5 mr-2" />
                        Transfer Progress
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Credits toward transfer</span>
                                <span>
                                    {dashboardData?.progressMetrics?.creditsCompleted || 0} / {dashboardData?.progressMetrics?.targetCredits || 60}
                                </span>
                            </div>
                            <Progress
                                value={calculateProgress(
                                    dashboardData?.progressMetrics?.creditsCompleted || 0,
                                    dashboardData?.progressMetrics?.targetCredits || 60
                                )}
                                className="h-2"
                            />
                        </div>
                        <div className="text-sm text-gray-600">
                            <p>Target Timeline: {getTimelineLabel(dashboardData?.profile?.preferredTransferTimeline || '')}</p>
                            <p>Intended Major: {dashboardData?.profile?.intendedMajor || 'Not set'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Recent Activity
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Profile setup completed</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <AlertCircle className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">Transfer analysis in progress</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Course recommendations available</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Target Universities</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {dashboardData?.profile?.targetUniversities?.map((uni: string) => (
                            <Badge key={uni} variant="secondary" className="text-center py-2">
                                {uni}
                            </Badge>
                        )) || <p className="text-gray-500">No target universities set</p>}
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <School className="h-5 w-5 mr-2" />
                        Available Transfer Data
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{getDataStatistics().colleges}</div>
                            <div className="text-sm text-gray-600">California Colleges</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{getDataStatistics().courses}</div>
                            <div className="text-sm text-gray-600">Transferable Courses</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">{getDataStatistics().transferAgreements}</div>
                            <div className="text-sm text-gray-600">Transfer Agreements</div>
                        </div>
                        <div className="text-center p-3 border rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">{getDataStatistics().geRequirements}</div>
                            <div className="text-sm text-gray-600">GE Requirements</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}




function GPACalculatorTab() {
    return (
        <div className="space-y-6">
            <GPACalculator />
        </div>
    )
}

function FinancialCalculatorTab() {
    return (
        <div className="space-y-6">
            <FinancialCostCalculator />
            <BudgetingTableau />
            <CourseAffordabilityInsights />
        </div>
    )
}

function ProfileTab({ user }: { user: UserType }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Student Profile</h2>
                    <p className="text-muted-foreground">
                        Manage your academic profile, goals, and transfer preferences
                    </p>
                </div>
            </div>

            <StudentProfileForm userId={user.id} userEmail={user.email} />
        </div>
    )
}

function TransferPathwaysTab({ user }: { user: UserType }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Transfer Pathways</h2>
                    <p className="text-muted-foreground">
                        Explore and filter transfer opportunities by state, major, and requirements
                    </p>
                </div>
            </div>

            <TransferPathwaysTable userId={user.id} />
        </div>
    )
}

function UserJourneyDocs() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="prose prose-lg max-w-none">
                <h1>Transfer.ai User Journey Documentation</h1>

                <h2>Overview</h2>
                <p>
                    Transfer.ai is a comprehensive platform designed to help community college students
                    optimize their transfer journey to four-year universities. Our platform centralizes
                    key functions that students need to successfully transfer and thrive at their target institutions.
                </p>

                <h2>Key Features</h2>

                <h3>1. Course Selection Optimization</h3>
                <ul>
                    <li>RateMyProfessor integration for professor ratings</li>
                    <li>Convenient time slot recommendations</li>
                    <li>Major-specific course requirements</li>
                    <li>Transfer credit validation</li>
                </ul>

                <h3>2. Guaranteed Transfer Routes</h3>
                <ul>
                    <li>State-specific transfer agreements</li>
                    <li>Articulation agreement tracking</li>
                    <li>Guaranteed admission pathways</li>
                    <li>Credit transfer validation</li>
                </ul>

                <h3>3. Transfer Requisites Monitoring</h3>
                <ul>
                    <li>Degree program requirements</li>
                    <li>Major-specific prerequisites</li>
                    <li>Pre-professional track guidance</li>
                    <li>Progress tracking</li>
                </ul>

                <h3>4. Comprehensive Transfer Lists</h3>
                <ul>
                    <li>1-year and 2-year transfer options</li>
                    <li>University-specific requirements</li>
                    <li>Credit cross-matching</li>
                    <li>Admission probability analysis</li>
                </ul>

                <h2>User Journey</h2>

                <h3>1. Onboarding</h3>
                <p>
                    New users complete a comprehensive onboarding process that captures their academic
                    goals, target universities, current standing, and career interests. This information
                    is used to personalize their experience and generate relevant recommendations.
                </p>

                <h3>2. Dashboard Overview</h3>
                <p>
                    The main dashboard provides a comprehensive view of the student's progress, including
                    completed credits, current GPA, courses in progress, and transfer pathway analysis.
                </p>

                <h3>3. Course Management</h3>
                <p>
                    Students can view recommended courses based on their major and transfer goals,
                    track completed and planned courses, and receive personalized course suggestions.
                </p>

                <h3>4. Transfer Analysis</h3>
                <p>
                    The platform analyzes transfer pathways to target universities, showing requirements
                    met, estimated transfer credits, and admission probability for each pathway.
                </p>

                <h3>5. Recommendations</h3>
                <p>
                    Personalized recommendations help students optimize their course selection, maintain
                    competitive GPAs, and follow the most efficient transfer pathways.
                </p>

                <h2>Technical Architecture</h2>
                <p>
                    Built with Next.js, TypeScript, and Supabase, Transfer.ai provides a modern,
                    scalable platform with real-time data synchronization and secure user authentication.
                </p>
            </div>
        </div>
    )
} 