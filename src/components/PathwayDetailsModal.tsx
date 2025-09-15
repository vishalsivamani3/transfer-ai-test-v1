'use client'

import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
    GraduationCap,
    Target,
    BookOpen,
    Clock,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Info,
    ExternalLink,
    Calendar,
    Award,
    Users
} from 'lucide-react'

interface TransferPathway {
    id: string
    targetUniversity: string
    targetUniversityCode: string
    major: string
    majorCode: string
    state: string
    guaranteedTransfer: boolean
    requirementsMet: number
    totalRequirements: number
    estimatedTransferCredits: number
    timeline: string
    acceptanceRate: number
    minGPA: number
    applicationDeadline: string
    requiredCourses: string[]
    recommendedCourses: string[]
    igetcRequirements: string[]
    tagEligibility: { isEligible: boolean }
    specialRequirements: string[]
}

interface PathwayDetailsModalProps {
    pathway: TransferPathway
    children: React.ReactNode
}

export default function PathwayDetailsModal({ pathway, children }: PathwayDetailsModalProps) {
    const progressPercentage = (pathway.requirementsMet / pathway.totalRequirements) * 100

    const formatDeadline = (deadline: string) => {
        return new Date(deadline).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getGPAStatus = (gpa: number) => {
        if (gpa >= 3.5) return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-50' }
        if (gpa >= 3.0) return { status: 'good', color: 'text-blue-600', bg: 'bg-blue-50' }
        if (gpa >= 2.5) return { status: 'acceptable', color: 'text-yellow-600', bg: 'bg-yellow-50' }
        return { status: 'needs improvement', color: 'text-red-600', bg: 'bg-red-50' }
    }

    const gpaStatus = getGPAStatus(pathway.minGPA)

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                        Transfer Pathway Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Pathway Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{pathway.targetUniversity}</span>
                                <Badge variant={pathway.guaranteedTransfer ? "default" : "secondary"}>
                                    {pathway.guaranteedTransfer ? "Guaranteed Transfer" : "Competitive"}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                {pathway.major} • {pathway.targetUniversityCode}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">{pathway.minGPA}</div>
                                    <div className="text-sm text-gray-600">Min GPA</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">{pathway.acceptanceRate.toFixed(1)}%</div>
                                    <div className="text-sm text-gray-600">Acceptance Rate</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">{pathway.estimatedTransferCredits}</div>
                                    <div className="text-sm text-gray-600">Transfer Credits</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">{pathway.timeline}</div>
                                    <div className="text-sm text-gray-600">Timeline</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requirements Progress */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Requirements Progress
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Requirements Met</span>
                                        <span>{pathway.requirementsMet} / {pathway.totalRequirements}</span>
                                    </div>
                                    <Progress value={progressPercentage} className="h-2" />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                        Application Deadline: {formatDeadline(pathway.applicationDeadline)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Required Courses */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Required Courses
                            </CardTitle>
                            <CardDescription>
                                Core courses needed for this transfer pathway
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {pathway.requiredCourses.map((course, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="font-mono text-sm">{course}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommended Courses */}
                    {pathway.recommendedCourses.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Recommended Courses
                                </CardTitle>
                                <CardDescription>
                                    Additional courses to strengthen your application
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {pathway.recommendedCourses.map((course, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                                            <Info className="h-4 w-4 text-blue-600" />
                                            <span className="font-mono text-sm">{course}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* IGETC Requirements */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                IGETC Requirements
                            </CardTitle>
                            <CardDescription>
                                General Education requirements for UC transfer
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {pathway.igetcRequirements.map((requirement, index) => (
                                    <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                                        <CheckCircle className="h-4 w-4 text-purple-600" />
                                        <span className="text-sm">{requirement}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Special Requirements */}
                    {pathway.specialRequirements.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5" />
                                    Special Requirements
                                </CardTitle>
                                <CardDescription>
                                    Additional requirements for this pathway
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {pathway.specialRequirements.map((requirement, index) => (
                                        <div key={index} className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
                                            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                                            <span className="text-sm">{requirement}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* GPA Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                GPA Requirements
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`p-4 rounded-lg ${gpaStatus.bg}`}>
                                <div className="flex items-center gap-2">
                                    <div className={`text-2xl font-bold ${gpaStatus.color}`}>
                                        {pathway.minGPA}
                                    </div>
                                    <div>
                                        <div className={`font-medium ${gpaStatus.color}`}>
                                            Minimum GPA Required
                                        </div>
                                        <div className="text-sm text-gray-600 capitalize">
                                            {gpaStatus.status} competitiveness
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                        <Button className="flex-1">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View University Website
                        </Button>
                        <Button variant="outline" className="flex-1">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Add to My Pathways
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
