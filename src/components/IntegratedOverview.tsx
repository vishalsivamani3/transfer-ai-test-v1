'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    BookOpen,
    Calendar,
    Target,
    TrendingUp,
    CheckCircle,
    Clock,
    GraduationCap,
    School,
    MapPin,
    Users,
    Award,
    AlertCircle,
    Star,
    ArrowRight,
    Plus,
    Edit
} from 'lucide-react'
import { useTransferData } from '@/contexts/TransferDataContext'
import { getDataStatistics, getCollegesByType } from '@/data/assist/utils'

interface IntegratedOverviewProps {
    user?: any
    dashboardData?: any
    onNavigate?: (tab: string) => void
}

export default function IntegratedOverview({ user, dashboardData, onNavigate }: IntegratedOverviewProps) {
    const { state } = useTransferData()
    const [assistStats, setAssistStats] = useState<any>(null)
    const [collegeTypes, setCollegeTypes] = useState<any>(null)

    // Load Assist data statistics
    useEffect(() => {
        const loadAssistStats = async () => {
            try {
                const stats = getDataStatistics()
                const types = getCollegesByType()
                setAssistStats(stats)
                setCollegeTypes(types)
            } catch (error) {
                console.error('Error loading Assist stats:', error)
            }
        }
        loadAssistStats()
    }, [])

    // Calculate user progress
    const calculateProgress = () => {
        const totalCourses = state.selectedCourses.length
        const totalCredits = state.selectedCourses.reduce((sum, course) => sum + (course.units || 3), 0)
        const transferableCredits = state.selectedCourses.reduce((sum, course) =>
            sum + (course.transferAgreements.length > 0 ? (course.units || 3) : 0), 0
        )

        const activePlan = state.activeSemesterPlan
        const plannedCredits = activePlan ? activePlan.totalCredits : 0
        const plannedTransferableCredits = activePlan ? activePlan.transferableCredits : 0

        return {
            totalCourses,
            totalCredits,
            transferableCredits,
            plannedCredits,
            plannedTransferableCredits,
            transferabilityRate: totalCredits > 0 ? (transferableCredits / totalCredits) * 100 : 0
        }
    }

    const progress = calculateProgress()

    // Get user's current college info
    const currentCollege = user?.user_metadata?.currentCollege || 'Not specified'
    const targetMajor = user?.user_metadata?.targetMajor || 'Not specified'
    const targetUniversities = user?.user_metadata?.targetUniversities || []

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back, {user?.user_metadata?.full_name || 'Student'}!
                    </h1>
                    <p className="text-muted-foreground">
                        Track your transfer progress and plan your academic journey
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <School className="h-3 w-3" />
                        {currentCollege}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {targetMajor}
                    </Badge>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onNavigate?.('selected')}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-muted-foreground truncate">Selected Courses</p>
                                <p className="text-2xl font-bold">{progress.totalCourses}</p>
                            </div>
                            <BookOpen className="h-6 w-6 text-blue-600 flex-shrink-0" />
                        </div>
                        <div className="space-y-1">
                            <Progress value={Math.min((progress.totalCourses / 20) * 100, 100)} className="h-1.5" />
                            <p className="text-xs text-muted-foreground truncate">Target: 20 courses</p>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onNavigate?.('courses')}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-muted-foreground truncate">Total Credits</p>
                                <p className="text-2xl font-bold">{progress.totalCredits}</p>
                            </div>
                            <Award className="h-6 w-6 text-green-600 flex-shrink-0" />
                        </div>
                        <div className="space-y-1">
                            <Progress value={Math.min((progress.totalCredits / 60) * 100, 100)} className="h-1.5" />
                            <p className="text-xs text-muted-foreground truncate">Target: 60 credits</p>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onNavigate?.('pathways')}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-muted-foreground truncate">Transferable</p>
                                <p className="text-2xl font-bold">{progress.transferableCredits}</p>
                            </div>
                            <TrendingUp className="h-6 w-6 text-purple-600 flex-shrink-0" />
                        </div>
                        <div className="space-y-1">
                            <Progress value={progress.transferabilityRate} className="h-1.5" />
                            <p className="text-xs text-muted-foreground truncate">
                                {progress.transferabilityRate.toFixed(1)}% transferable
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onNavigate?.('planner')}
                >
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-muted-foreground truncate">Semester Plans</p>
                                <p className="text-2xl font-bold">{state.semesterPlans.length}</p>
                            </div>
                            <Calendar className="h-6 w-6 text-orange-600 flex-shrink-0" />
                        </div>
                        <div className="space-y-1">
                            {state.activeSemesterPlan ? (
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                                    <p className="text-xs text-green-600 truncate">Active plan</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3 text-orange-600 flex-shrink-0" />
                                    <p className="text-xs text-orange-600 truncate">No active plan</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Course Selection Summary */}
                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onNavigate?.('selected')}
                >
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Star className="h-5 w-5" />
                            Course Selection
                        </CardTitle>
                        <CardDescription className="text-sm">
                            {progress.totalCourses} courses • {progress.totalCredits} credits
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {progress.totalCourses === 0 ? (
                            <div className="text-center py-6">
                                <BookOpen className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 text-sm mb-2">No courses selected</p>
                                <p className="text-xs text-gray-500">Click to browse courses</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-blue-600">{progress.totalCourses}</div>
                                        <div className="text-xs text-gray-600">Courses</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-green-600">{progress.transferableCredits}</div>
                                        <div className="text-xs text-gray-600">Transferable</div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span>Transferability</span>
                                        <span>{progress.transferabilityRate.toFixed(1)}%</span>
                                    </div>
                                    <Progress value={progress.transferabilityRate} className="h-1.5" />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Semester Plan Summary */}
                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onNavigate?.('planner')}
                >
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Calendar className="h-5 w-5" />
                            Semester Planning
                        </CardTitle>
                        <CardDescription className="text-sm">
                            {state.activeSemesterPlan ? 'Active plan in progress' : 'No active plan'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {!state.activeSemesterPlan ? (
                            <div className="text-center py-6">
                                <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600 text-sm mb-2">No semester plan</p>
                                <p className="text-xs text-gray-500">Click to create a plan</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-sm truncate">{state.activeSemesterPlan.name}</h3>
                                    <Badge variant="outline" className="text-xs">{state.activeSemesterPlan.timeline}</Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-blue-600">{state.activeSemesterPlan.semesters.length}</div>
                                        <div className="text-xs text-gray-600">Semesters</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xl font-bold text-green-600">{state.activeSemesterPlan.totalCredits}</div>
                                        <div className="text-xs text-gray-600">Planned</div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span>Transferable</span>
                                        <span>{state.activeSemesterPlan.transferableCredits}</span>
                                    </div>
                                    <Progress
                                        value={state.activeSemesterPlan.totalCredits > 0 ?
                                            (state.activeSemesterPlan.transferableCredits / state.activeSemesterPlan.totalCredits) * 100 : 0
                                        }
                                        className="h-1.5"
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Transfer Pathway Insights */}
            <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onNavigate?.('pathways')}
            >
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Target className="h-5 w-5" />
                        Transfer Insights
                    </CardTitle>
                    <CardDescription className="text-sm">
                        Analysis based on your courses and target universities
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                                {assistStats?.totalColleges || 0}
                            </div>
                            <div className="text-xs text-gray-600 mb-1">Available Colleges</div>
                            <div className="text-xs text-gray-500 truncate">
                                {collegeTypes?.UC?.length || 0} UC • {collegeTypes?.CSU?.length || 0} CSU • {collegeTypes?.CCC?.length || 0} CCC
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600 mb-1">
                                {assistStats?.totalCourses || 0}
                            </div>
                            <div className="text-xs text-gray-600 mb-1">Available Courses</div>
                            <div className="text-xs text-gray-500">
                                California colleges
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                                {assistStats?.totalTransferAgreements || 0}
                            </div>
                            <div className="text-xs text-gray-600 mb-1">Transfer Agreements</div>
                            <div className="text-xs text-gray-500">
                                Verified pathways
                            </div>
                        </div>
                    </div>

                    {targetUniversities.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium text-sm mb-2">Target Universities</h4>
                            <div className="flex flex-wrap gap-1">
                                {targetUniversities.slice(0, 3).map((university: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                        <GraduationCap className="h-3 w-3 mr-1" />
                                        {university}
                                    </Badge>
                                ))}
                                {targetUniversities.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                        +{targetUniversities.length - 3} more
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                    <CardDescription className="text-sm">Get started with your transfer planning</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Button
                            variant="outline"
                            className="h-16 flex flex-col items-center justify-center"
                            onClick={() => onNavigate?.('courses')}
                        >
                            <BookOpen className="h-5 w-5 mb-1" />
                            <span className="text-sm">Browse Courses</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-16 flex flex-col items-center justify-center"
                            onClick={() => onNavigate?.('planner')}
                        >
                            <Calendar className="h-5 w-5 mb-1" />
                            <span className="text-sm">Create Plan</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-16 flex flex-col items-center justify-center"
                            onClick={() => onNavigate?.('pathways')}
                        >
                            <Target className="h-5 w-5 mb-1" />
                            <span className="text-sm">Explore Pathways</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}