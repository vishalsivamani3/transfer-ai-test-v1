'use client'

import React from 'react'
import {
    Target,
    GraduationCap,
    BookOpen,
    TrendingUp,
    Clock,
    Star,
    CheckCircle,
    AlertCircle,
    School,
    Calendar,
    MapPin,
    User
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface DashboardCardsProps {
    user?: any
    dashboardData?: any
    className?: string
}

export default function DashboardCards({ user, dashboardData, className }: DashboardCardsProps) {
    const profile = user?.user_metadata || {}
    const progressData = dashboardData?.progressMetrics || {}

    // Calculate responsive values based on profile data
    const targetCredits = profile.targetCredits || 60
    const completedCredits = progressData.creditsCompleted || 0
    const progressPercentage = Math.min((completedCredits / targetCredits) * 100, 100)

    const gpa = profile.currentGpa || 0
    const targetGpa = profile.targetGpa || 3.0
    const gpaProgress = Math.min((gpa / targetGpa) * 100, 100)

    const transferPathways = progressData.transferPathwaysAnalyzed || 0
    const coursesSelected = progressData.coursesSelected || 0
    const plansCreated = progressData.plansCreated || 0

    const cards = [
        {
            title: 'Transfer Progress',
            value: `${completedCredits}/${targetCredits}`,
            subtitle: 'Credits Completed',
            icon: Target,
            color: 'blue',
            progress: progressPercentage,
            badge: `${Math.round(progressPercentage)}%`,
            responsive: {
                sm: 'col-span-2',
                lg: 'col-span-1'
            }
        },
        {
            title: 'GPA Status',
            value: gpa.toFixed(2),
            subtitle: `Target: ${targetGpa}`,
            icon: GraduationCap,
            color: 'green',
            progress: gpaProgress,
            badge: gpa >= targetGpa ? 'On Track' : 'Needs Improvement',
            responsive: {
                sm: 'col-span-2',
                lg: 'col-span-1'
            }
        },
        {
            title: 'Transfer Pathways',
            value: transferPathways,
            subtitle: 'Analyzed',
            icon: TrendingUp,
            color: 'purple',
            badge: 'Active',
            responsive: {
                sm: 'col-span-1',
                lg: 'col-span-1'
            }
        },
        {
            title: 'Selected Courses',
            value: coursesSelected,
            subtitle: 'In Your Plan',
            icon: BookOpen,
            color: 'orange',
            badge: coursesSelected > 0 ? 'Selected' : 'None',
            responsive: {
                sm: 'col-span-1',
                lg: 'col-span-1'
            }
        },
        {
            title: 'Academic Status',
            value: profile.academicYear || 'Not Set',
            subtitle: 'Current Year',
            icon: School,
            color: 'indigo',
            badge: profile.academicYear ? 'Active' : 'Setup Required',
            responsive: {
                sm: 'col-span-2',
                lg: 'col-span-1'
            }
        },
        {
            title: 'Transfer Timeline',
            value: profile.preferredTransferTimeline || 'Not Set',
            subtitle: 'Target Transfer',
            icon: Calendar,
            color: 'pink',
            badge: profile.preferredTransferTimeline ? 'Planned' : 'Not Set',
            responsive: {
                sm: 'col-span-2',
                lg: 'col-span-1'
            }
        }
    ]

    const getColorClasses = (color: string) => {
        const colorMap = {
            blue: 'bg-blue-50 border-blue-200 text-blue-700',
            green: 'bg-green-50 border-green-200 text-green-700',
            purple: 'bg-purple-50 border-purple-200 text-purple-700',
            orange: 'bg-orange-50 border-orange-200 text-orange-700',
            indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
            pink: 'bg-pink-50 border-pink-200 text-pink-700'
        }
        return colorMap[color as keyof typeof colorMap] || colorMap.blue
    }

    const getIconColor = (color: string) => {
        const colorMap = {
            blue: 'text-blue-600',
            green: 'text-green-600',
            purple: 'text-purple-600',
            orange: 'text-orange-600',
            indigo: 'text-indigo-600',
            pink: 'text-pink-600'
        }
        return colorMap[color as keyof typeof colorMap] || colorMap.blue
    }

    return (
        <div className={cn("grid gap-4", className)}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {cards.map((card, index) => {
                    const Icon = card.icon
                    const colorClasses = getColorClasses(card.color)
                    const iconColor = getIconColor(card.color)

                    return (
                        <Card
                            key={index}
                            className={cn(
                                "transition-all duration-200 hover:shadow-md",
                                card.responsive.sm === 'col-span-2' ? 'sm:col-span-2' : 'sm:col-span-1',
                                card.responsive.lg === 'col-span-2' ? 'lg:col-span-2' : 'lg:col-span-1'
                            )}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className={cn("p-2 rounded-lg", colorClasses)}>
                                            <Icon className={cn("w-4 h-4", iconColor)} />
                                        </div>
                                        <CardTitle className="text-sm font-medium text-gray-900">
                                            {card.title}
                                        </CardTitle>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={cn("text-xs", colorClasses)}
                                    >
                                        {card.badge}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-2">
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-2xl font-bold text-gray-900">
                                            {card.value}
                                        </span>
                                        {card.progress !== undefined && (
                                            <span className="text-sm text-gray-500">
                                                {Math.round(card.progress)}%
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {card.subtitle}
                                    </p>
                                    {card.progress !== undefined && (
                                        <Progress
                                            value={card.progress}
                                            className="h-2"
                                        />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Quick Actions Card */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="font-medium text-sm">Browse Courses</p>
                                <p className="text-xs text-gray-500">Find your next class</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                            <Calendar className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="font-medium text-sm">Create Plan</p>
                                <p className="text-xs text-gray-500">Plan your semester</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                            <Target className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="font-medium text-sm">Transfer Analysis</p>
                                <p className="text-xs text-gray-500">Check your progress</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                            <User className="w-5 h-5 text-orange-600" />
                            <div>
                                <p className="font-medium text-sm">Update Profile</p>
                                <p className="text-xs text-gray-500">Keep info current</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 