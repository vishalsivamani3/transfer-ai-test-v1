'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    Info,
    Calculator,
    Target,
    BookOpen,
    Clock,
    Users,
    Award
} from 'lucide-react'
import { useTransferData } from '@/contexts/TransferDataContext'
import { AssistCourse } from '@/contexts/TransferDataContext'

interface AffordabilityAnalysis {
    course: AssistCourse
    costPerUnit: number
    totalCost: number
    affordabilityScore: number
    recommendations: string[]
    alternatives: AssistCourse[]
    financialImpact: {
        monthlyPayment: number
        totalSavings: number
        breakEvenPoint: number
    }
}

interface CostComparison {
    currentCollege: {
        name: string
        costPerUnit: number
        totalCost: number
    }
    targetColleges: {
        name: string
        costPerUnit: number
        totalCost: number
        savings: number
    }[]
}

export default function CourseAffordabilityInsights() {
    const { state } = useTransferData()
    const [affordabilityAnalysis, setAffordabilityAnalysis] = useState<AffordabilityAnalysis[]>([])
    const [costComparison, setCostComparison] = useState<CostComparison | null>(null)
    const [selectedCourse, setSelectedCourse] = useState<AssistCourse | null>(null)

    // Mock financial data - in real implementation, this would come from the financial calculator
    const financialData = {
        monthlyBudget: 2000,
        availableFunds: 5000,
        targetSavings: 10000,
        currentSavings: 3000
    }

    // Calculate affordability analysis for selected courses
    const calculateAffordabilityAnalysis = (courses: AssistCourse[]): AffordabilityAnalysis[] => {
        return courses.map(course => {
            const costPerUnit = 46 // Average cost per unit at community college
            const totalCost = (course.units || 3) * costPerUnit

            // Calculate affordability score (0-100)
            const affordabilityScore = Math.min(100, Math.max(0,
                ((financialData.monthlyBudget * 0.1) / totalCost) * 100
            ))

            // Generate recommendations
            const recommendations: string[] = []
            if (affordabilityScore < 50) {
                recommendations.push('Consider taking this course in a different semester')
                recommendations.push('Look for online or hybrid options to reduce costs')
                recommendations.push('Check if your college offers payment plans')
            } else if (affordabilityScore < 75) {
                recommendations.push('This course fits within your budget')
                recommendations.push('Consider taking with other low-cost courses')
            } else {
                recommendations.push('Excellent choice for your budget')
                recommendations.push('Consider taking additional courses this semester')
            }

            // Find alternative courses
            const alternatives = state.courses
                .filter(c => c.department === course.department && c.id !== course.id)
                .slice(0, 3)

            // Calculate financial impact
            const monthlyPayment = totalCost / 4 // Assuming 4-month semester
            const totalSavings = financialData.monthlyBudget - monthlyPayment
            const breakEvenPoint = totalCost / totalSavings

            return {
                course,
                costPerUnit,
                totalCost,
                affordabilityScore,
                recommendations,
                alternatives,
                financialImpact: {
                    monthlyPayment,
                    totalSavings,
                    breakEvenPoint
                }
            }
        })
    }

    // Calculate cost comparison between current and target colleges
    const calculateCostComparison = (): CostComparison => {
        const currentCollege = {
            name: 'Current Community College',
            costPerUnit: 46,
            totalCost: state.selectedCourses.reduce((sum, course) =>
                sum + ((course.units || 3) * 46), 0
            )
        }

        const targetColleges = [
            {
                name: 'UC Berkeley',
                costPerUnit: 14436 / 30, // Annual tuition / average units
                totalCost: state.selectedCourses.reduce((sum, course) =>
                    sum + ((course.units || 3) * (14436 / 30)), 0
                ),
                savings: 0
            },
            {
                name: 'UCLA',
                costPerUnit: 14436 / 30,
                totalCost: state.selectedCourses.reduce((sum, course) =>
                    sum + ((course.units || 3) * (14436 / 30)), 0
                ),
                savings: 0
            },
            {
                name: 'CSU Long Beach',
                costPerUnit: 5742 / 30,
                totalCost: state.selectedCourses.reduce((sum, course) =>
                    sum + ((course.units || 3) * (5742 / 30)), 0
                ),
                savings: 0
            }
        ].map(college => ({
            ...college,
            savings: currentCollege.totalCost - college.totalCost
        }))

        return {
            currentCollege,
            targetColleges
        }
    }

    useEffect(() => {
        if (state.selectedCourses.length > 0) {
            const analysis = calculateAffordabilityAnalysis(state.selectedCourses)
            setAffordabilityAnalysis(analysis)

            const comparison = calculateCostComparison()
            setCostComparison(comparison)
        }
    }, [state.selectedCourses])

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount)
    }

    const getAffordabilityColor = (score: number) => {
        if (score >= 75) return 'text-green-600'
        if (score >= 50) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getAffordabilityBadge = (score: number) => {
        if (score >= 75) return 'bg-green-100 text-green-800'
        if (score >= 50) return 'bg-yellow-100 text-yellow-800'
        return 'bg-red-100 text-red-800'
    }

    const getAffordabilityLabel = (score: number) => {
        if (score >= 75) return 'Highly Affordable'
        if (score >= 50) return 'Moderately Affordable'
        return 'Less Affordable'
    }

    if (state.selectedCourses.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Course Affordability Insights
                    </CardTitle>
                    <CardDescription>
                        Select courses to see affordability analysis and cost comparisons
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">No courses selected yet</p>
                        <p className="text-sm text-gray-500">Go to the course dashboard to select courses</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Course Affordability Insights
                    </CardTitle>
                    <CardDescription>
                        Analyze the financial impact of your selected courses and get personalized recommendations
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Financial Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(costComparison?.currentCollege.totalCost || 0)}
                                </div>
                                <div className="text-sm text-gray-600">Total Course Cost</div>
                                <div className="text-xs text-gray-500">Current Semester</div>
                            </div>

                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(financialData.availableFunds)}
                                </div>
                                <div className="text-sm text-gray-600">Available Funds</div>
                                <div className="text-xs text-gray-500">Current Balance</div>
                            </div>

                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                    {formatCurrency(financialData.monthlyBudget)}
                                </div>
                                <div className="text-sm text-gray-600">Monthly Budget</div>
                                <div className="text-xs text-gray-500">For Education</div>
                            </div>

                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">
                                    {formatCurrency(financialData.currentSavings)}
                                </div>
                                <div className="text-sm text-gray-600">Current Savings</div>
                                <div className="text-xs text-gray-500">Transfer Fund</div>
                            </div>
                        </div>

                        {/* Affordability Analysis */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Course Affordability Analysis</h3>
                            {affordabilityAnalysis.map((analysis, index) => (
                                <Card key={index} className="border-l-4 border-l-blue-500">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-medium">{analysis.course.courseCode} - {analysis.course.courseTitle}</h4>
                                                <p className="text-sm text-gray-600">{analysis.course.department} • {analysis.course.units} units</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold">{formatCurrency(analysis.totalCost)}</div>
                                                <Badge className={getAffordabilityBadge(analysis.affordabilityScore)}>
                                                    {getAffordabilityLabel(analysis.affordabilityScore)}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                            <div className="text-center">
                                                <div className="text-sm text-gray-600">Affordability Score</div>
                                                <div className={`text-2xl font-bold ${getAffordabilityColor(analysis.affordabilityScore)}`}>
                                                    {analysis.affordabilityScore.toFixed(0)}
                                                </div>
                                                <Progress value={analysis.affordabilityScore} className="h-2 mt-1" />
                                            </div>

                                            <div className="text-center">
                                                <div className="text-sm text-gray-600">Monthly Payment</div>
                                                <div className="text-lg font-medium">{formatCurrency(analysis.financialImpact.monthlyPayment)}</div>
                                                <div className="text-xs text-gray-500">Over 4 months</div>
                                            </div>

                                            <div className="text-center">
                                                <div className="text-sm text-gray-600">Budget Impact</div>
                                                <div className={`text-lg font-medium ${analysis.financialImpact.totalSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatCurrency(analysis.financialImpact.totalSavings)}
                                                </div>
                                                <div className="text-xs text-gray-500">Remaining budget</div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h5 className="font-medium text-sm">Recommendations:</h5>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                {analysis.recommendations.map((rec, i) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                                        {rec}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Cost Comparison */}
                        {costComparison && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Cost Comparison: Current vs Target Colleges</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Card className="border-l-4 border-l-green-500">
                                        <CardContent className="p-4">
                                            <div className="text-center">
                                                <div className="text-sm font-medium text-green-600 mb-1">Current College</div>
                                                <div className="text-lg font-bold">{formatCurrency(costComparison.currentCollege.totalCost)}</div>
                                                <div className="text-xs text-gray-500">Total for {state.selectedCourses.length} courses</div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {costComparison.targetColleges.map((college, index) => (
                                        <Card key={index} className="border-l-4 border-l-blue-500">
                                            <CardContent className="p-4">
                                                <div className="text-center">
                                                    <div className="text-sm font-medium text-blue-600 mb-1">{college.name}</div>
                                                    <div className="text-lg font-bold">{formatCurrency(college.totalCost)}</div>
                                                    <div className="text-xs text-gray-500">Same courses</div>
                                                    <div className={`text-xs font-medium mt-1 ${college.savings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                        {college.savings >= 0 ? 'Save' : 'Cost'} {formatCurrency(Math.abs(college.savings))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Financial Tips */}
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                <strong>Money-Saving Tips:</strong>
                                <ul className="mt-2 space-y-1 text-sm">
                                    <li>• Consider taking courses during summer sessions for lower costs</li>
                                    <li>• Look for open educational resources (OER) to reduce textbook costs</li>
                                    <li>• Apply for scholarships and grants specific to your major</li>
                                    <li>• Consider work-study programs to offset costs</li>
                                    <li>• Plan your course sequence to avoid unnecessary retakes</li>
                                </ul>
                            </AlertDescription>
                        </Alert>

                        {/* Budget Impact Summary */}
                        <Card className="bg-gray-50">
                            <CardHeader>
                                <CardTitle className="text-lg">Budget Impact Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium mb-3">Current Semester Impact</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Course Costs</span>
                                                <span className="font-medium">{formatCurrency(costComparison?.currentCollege.totalCost || 0)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Available Funds</span>
                                                <span className="font-medium text-green-600">{formatCurrency(financialData.availableFunds)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Remaining Funds</span>
                                                <span className={`font-medium ${(financialData.availableFunds - (costComparison?.currentCollege.totalCost || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {formatCurrency(financialData.availableFunds - (costComparison?.currentCollege.totalCost || 0))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium mb-3">Transfer Fund Progress</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Current Savings</span>
                                                <span className="font-medium">{formatCurrency(financialData.currentSavings)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Target Savings</span>
                                                <span className="font-medium">{formatCurrency(financialData.targetSavings)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Progress</span>
                                                <span className="font-medium">{((financialData.currentSavings / financialData.targetSavings) * 100).toFixed(1)}%</span>
                                            </div>
                                            <Progress value={(financialData.currentSavings / financialData.targetSavings) * 100} className="h-2" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}