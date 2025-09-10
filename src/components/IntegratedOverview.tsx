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
    Edit,
    User
} from 'lucide-react'
import { useTransferData } from '@/contexts/TransferDataContext'

interface IntegratedOverviewProps {
    user?: any
    dashboardData?: any
    onNavigate?: (tab: string) => void
}

export default function IntegratedOverview({ user, dashboardData, onNavigate }: IntegratedOverviewProps) {
    const { state } = useTransferData()

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
    const gpa = user?.user_metadata?.gpa || 'Not specified'
    const transferTimeline = user?.user_metadata?.transferTimeline || 'Not specified'
    const academicGoals = user?.user_metadata?.academicGoals || ''
    const interests = user?.user_metadata?.interests || []

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
                <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <School className="h-3 w-3" />
                        {currentCollege}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {targetMajor}
                    </Badge>
                    {gpa !== 'Not specified' && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            GPA: {gpa}
                        </Badge>
                    )}
                    {transferTimeline !== 'Not specified' && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {transferTimeline}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Quick Actions - Streamlined Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300"
                    onClick={() => onNavigate?.('courses')}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">Browse Courses</h3>
                                <p className="text-sm text-gray-600">Explore available courses and add to your plan</p>
                                <div className="mt-2 flex items-center gap-4 text-sm">
                                    <span className="text-blue-600 font-medium">{progress.totalCourses} selected</span>
                                    <span className="text-gray-500">{progress.totalCredits} credits</span>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-green-300"
                    onClick={() => onNavigate?.('planner')}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Calendar className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">Semester Planner</h3>
                                <p className="text-sm text-gray-600">Plan your courses across semesters</p>
                                <div className="mt-2 flex items-center gap-2">
                                    {state.activeSemesterPlan ? (
                                        <div className="flex items-center gap-1">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span className="text-sm text-green-600">Active plan</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4 text-orange-600" />
                                            <span className="text-sm text-orange-600">Create plan</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-300"
                    onClick={() => onNavigate?.('pathways')}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">Transfer Pathways</h3>
                                <p className="text-sm text-gray-600">Explore major-specific transfer programs</p>
                                <div className="mt-2 flex items-center gap-4 text-sm">
                                    <span className="text-purple-600 font-medium">{progress.transferableCredits} transferable</span>
                                    <span className="text-gray-500">{progress.transferabilityRate.toFixed(1)}% rate</span>
                                </div>
                            </div>
                            <ArrowRight className="h-5 w-5 text-gray-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Current Status & Next Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Current Progress */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <CheckCircle className="h-5 w-5" />
                            Your Progress
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Track your transfer preparation
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Courses Selected</span>
                                <span className="text-lg font-bold text-blue-600">{progress.totalCourses}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Total Credits</span>
                                <span className="text-lg font-bold text-green-600">{progress.totalCredits}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Transferable Credits</span>
                                <span className="text-lg font-bold text-purple-600">{progress.transferableCredits}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Transferability Rate</span>
                                    <span className="font-medium">{progress.transferabilityRate.toFixed(1)}%</span>
                                </div>
                                <Progress value={progress.transferabilityRate} className="h-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Next Steps */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ArrowRight className="h-5 w-5" />
                            Next Steps
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Recommended actions for your transfer journey
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-3">
                            {progress.totalCourses === 0 ? (
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <div className="p-2 bg-blue-100 rounded">
                                        <BookOpen className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Start by browsing courses</p>
                                        <p className="text-xs text-gray-600">Add courses to your selection</p>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => onNavigate?.('courses')}>
                                        Browse
                                    </Button>
                                </div>
                            ) : !state.activeSemesterPlan ? (
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                    <div className="p-2 bg-green-100 rounded">
                                        <Calendar className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Create a semester plan</p>
                                        <p className="text-xs text-gray-600">Organize your courses by semester</p>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => onNavigate?.('planner')}>
                                        Plan
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                    <div className="p-2 bg-purple-100 rounded">
                                        <TrendingUp className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Explore transfer pathways</p>
                                        <p className="text-xs text-gray-600">Find major-specific programs</p>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => onNavigate?.('pathways')}>
                                        Explore
                                    </Button>
                                </div>
                            )}

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="p-2 bg-gray-100 rounded">
                                    <User className="h-4 w-4 text-gray-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Update your profile</p>
                                    <p className="text-xs text-gray-600">Keep your goals and preferences current</p>
                                </div>
                                <Button size="sm" variant="outline" onClick={() => onNavigate?.('profile')}>
                                    Update
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>


            {/* Profile Summary */}
            {(academicGoals || interests.length > 0) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Your Academic Profile
                        </CardTitle>
                        <CardDescription>
                            Your goals and interests inform your transfer planning
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {academicGoals && (
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Academic Goals</h4>
                                    <p className="text-sm text-gray-600">{academicGoals}</p>
                                </div>
                            )}

                            {interests.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-sm mb-2">Areas of Interest</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {interests.map((interest, index) => (
                                            <Badge key={index} variant="secondary" className="text-xs">
                                                {interest}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

        </div>
    )
}