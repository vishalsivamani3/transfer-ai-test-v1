'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Calculator,
    TrendingUp,
    Award,
    Target,
    BookOpen,
    GraduationCap,
    Star,
    CheckCircle,
    AlertCircle
} from 'lucide-react'

// UC GPA System - Grade Point Values
const UC_GRADE_POINTS = {
    'A+': 4.0,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
    'D+': 1.3,
    'D': 1.0,
    'D-': 0.7,
    'F': 0.0,
    'P': null, // Pass/No Pass - doesn't count toward GPA
    'NP': null, // No Pass - doesn't count toward GPA
    'I': null, // Incomplete - doesn't count toward GPA
    'W': null, // Withdrawal - doesn't count toward GPA
}

const GRADE_OPTIONS = Object.keys(UC_GRADE_POINTS)

interface CourseGrade {
    id: string
    courseCode: string
    courseTitle: string
    units: number
    grade: string
    semester: string
}

interface SemesterGPA {
    semester: string
    courses: CourseGrade[]
    totalUnits: number
    gradePoints: number
    gpa: number
}

interface GPACalculatorProps {
    semesterPlan?: any // Optional semester plan data
}

export default function GPACalculator({ semesterPlan }: GPACalculatorProps) {
    const [courses, setCourses] = useState<CourseGrade[]>([])
    const [semesterGPAs, setSemesterGPAs] = useState<SemesterGPA[]>([])
    const [cumulativeGPA, setCumulativeGPA] = useState(0)
    const [totalUnits, setTotalUnits] = useState(0)
    const [targetGPA, setTargetGPA] = useState(3.0)

    // Calculate GPA for a single semester
    const calculateSemesterGPA = (semesterCourses: CourseGrade[]): SemesterGPA => {
        const validCourses = semesterCourses.filter(course =>
            UC_GRADE_POINTS[course.grade as keyof typeof UC_GRADE_POINTS] !== null
        )

        const totalUnits = validCourses.reduce((sum, course) => sum + course.units, 0)
        const gradePoints = validCourses.reduce((sum, course) => {
            const gradePoint = UC_GRADE_POINTS[course.grade as keyof typeof UC_GRADE_POINTS] || 0
            return sum + (gradePoint * course.units)
        }, 0)

        const gpa = totalUnits > 0 ? gradePoints / totalUnits : 0

        return {
            semester: semesterCourses[0]?.semester || 'Unknown',
            courses: semesterCourses,
            totalUnits,
            gradePoints,
            gpa
        }
    }

    // Calculate cumulative GPA
    const calculateCumulativeGPA = (allCourses: CourseGrade[]): { gpa: number; totalUnits: number } => {
        const validCourses = allCourses.filter(course =>
            UC_GRADE_POINTS[course.grade as keyof typeof UC_GRADE_POINTS] !== null
        )

        const totalUnits = validCourses.reduce((sum, course) => sum + course.units, 0)
        const totalGradePoints = validCourses.reduce((sum, course) => {
            const gradePoint = UC_GRADE_POINTS[course.grade as keyof typeof UC_GRADE_POINTS] || 0
            return sum + (gradePoint * course.units)
        }, 0)

        const gpa = totalUnits > 0 ? totalGradePoints / totalUnits : 0

        return { gpa, totalUnits }
    }

    // Update calculations when courses change
    useEffect(() => {
        if (courses.length === 0) {
            setSemesterGPAs([])
            setCumulativeGPA(0)
            setTotalUnits(0)
            return
        }

        // Group courses by semester
        const coursesBySemester = courses.reduce((acc, course) => {
            if (!acc[course.semester]) {
                acc[course.semester] = []
            }
            acc[course.semester].push(course)
            return acc
        }, {} as Record<string, CourseGrade[]>)

        // Calculate GPA for each semester
        const semesterGPAs = Object.entries(coursesBySemester).map(([semester, semesterCourses]) =>
            calculateSemesterGPA(semesterCourses)
        )

        setSemesterGPAs(semesterGPAs)

        // Calculate cumulative GPA
        const { gpa, totalUnits } = calculateCumulativeGPA(courses)
        setCumulativeGPA(gpa)
        setTotalUnits(totalUnits)
    }, [courses])

    // Add a new course
    const addCourse = () => {
        const newCourse: CourseGrade = {
            id: `course-${Date.now()}`,
            courseCode: '',
            courseTitle: '',
            units: 3,
            grade: 'A',
            semester: 'Fall 2024'
        }
        setCourses([...courses, newCourse])
    }

    // Update a course
    const updateCourse = (id: string, field: keyof CourseGrade, value: string | number) => {
        setCourses(courses.map(course =>
            course.id === id ? { ...course, [field]: value } : course
        ))
    }

    // Remove a course
    const removeCourse = (id: string) => {
        setCourses(courses.filter(course => course.id !== id))
    }

    // Get GPA status and color
    const getGPAStatus = (gpa: number) => {
        if (gpa >= 3.7) return { status: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' }
        if (gpa >= 3.3) return { status: 'Very Good', color: 'text-blue-600', bgColor: 'bg-blue-50' }
        if (gpa >= 3.0) return { status: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
        if (gpa >= 2.7) return { status: 'Satisfactory', color: 'text-orange-600', bgColor: 'bg-orange-50' }
        return { status: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-50' }
    }

    const gpaStatus = getGPAStatus(cumulativeGPA)
    const targetProgress = Math.min((cumulativeGPA / targetGPA) * 100, 100)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Calculator className="h-6 w-6" />
                        UC GPA Calculator
                    </h2>
                    <p className="text-muted-foreground">
                        Calculate your transfer GPA using the UC grading system for TAG programs
                    </p>
                </div>
            </div>

            {/* GPA Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Cumulative GPA */}
                <Card className={`${gpaStatus.bgColor} border-2`}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Cumulative GPA
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-1">
                            <span className={gpaStatus.color}>
                                {cumulativeGPA.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className={gpaStatus.color}>
                                {gpaStatus.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                {totalUnits} units
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Target GPA Progress */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Target Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold mb-2">
                            {targetGPA.toFixed(1)}
                        </div>
                        <Progress value={targetProgress} className="h-2 mb-2" />
                        <div className="text-sm text-muted-foreground">
                            {targetProgress.toFixed(1)}% of target
                        </div>
                    </CardContent>
                </Card>

                {/* TAG Requirements */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            TAG Requirements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                {cumulativeGPA >= 3.0 ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                )}
                                <span className="text-sm">3.0+ GPA</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {totalUnits >= 30 ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : (
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                )}
                                <span className="text-sm">30+ Units</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Target GPA Setting */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Set Target GPA
                    </CardTitle>
                    <CardDescription>
                        Set your target GPA for TAG program eligibility
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <Label htmlFor="target-gpa">Target GPA</Label>
                            <Input
                                id="target-gpa"
                                type="number"
                                step="0.1"
                                min="0"
                                max="4.0"
                                value={targetGPA}
                                onChange={(e) => setTargetGPA(parseFloat(e.target.value) || 0)}
                                className="mt-1"
                            />
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <p>UC TAG programs typically require:</p>
                            <ul className="list-disc list-inside mt-1">
                                <li>3.0+ GPA minimum</li>
                                <li>3.4+ GPA for competitive programs</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Course Input */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Add Courses
                    </CardTitle>
                    <CardDescription>
                        Add your completed courses to calculate your GPA
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {courses.map((course, index) => (
                            <div key={course.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 border rounded-lg">
                                <div>
                                    <Label htmlFor={`course-code-${course.id}`}>Course Code</Label>
                                    <Input
                                        id={`course-code-${course.id}`}
                                        value={course.courseCode}
                                        onChange={(e) => updateCourse(course.id, 'courseCode', e.target.value)}
                                        placeholder="e.g., MATH 150"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor={`course-title-${course.id}`}>Course Title</Label>
                                    <Input
                                        id={`course-title-${course.id}`}
                                        value={course.courseTitle}
                                        onChange={(e) => updateCourse(course.id, 'courseTitle', e.target.value)}
                                        placeholder="e.g., Calculus I"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`units-${course.id}`}>Units</Label>
                                    <Input
                                        id={`units-${course.id}`}
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={course.units}
                                        onChange={(e) => updateCourse(course.id, 'units', parseInt(e.target.value) || 0)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`grade-${course.id}`}>Grade</Label>
                                    <Select value={course.grade} onValueChange={(value) => updateCourse(course.id, 'grade', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GRADE_OPTIONS.map(grade => (
                                                <SelectItem key={grade} value={grade}>
                                                    {grade} ({UC_GRADE_POINTS[grade as keyof typeof UC_GRADE_POINTS] !== null ? UC_GRADE_POINTS[grade as keyof typeof UC_GRADE_POINTS] : 'No GPA'})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeCourse(course.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}

                        <Button onClick={addCourse} variant="outline" className="w-full">
                            <BookOpen className="h-4 w-4 mr-2" />
                            Add Course
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Semester Breakdown */}
            {semesterGPAs.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Semester Breakdown
                        </CardTitle>
                        <CardDescription>
                            GPA progression by semester
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {semesterGPAs.map((semester, index) => {
                                const semesterStatus = getGPAStatus(semester.gpa)
                                return (
                                    <div key={semester.semester} className={`p-4 rounded-lg border ${semesterStatus.bgColor}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium">{semester.semester}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-2xl font-bold ${semesterStatus.color}`}>
                                                    {semester.gpa.toFixed(2)}
                                                </span>
                                                <Badge variant="outline" className={semesterStatus.color}>
                                                    {semesterStatus.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {semester.totalUnits} units • {semester.courses.length} courses
                                        </div>
                                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {semester.courses.map(course => (
                                                <div key={course.id} className="text-xs bg-white/50 p-2 rounded">
                                                    <span className="font-medium">{course.courseCode}</span>
                                                    <span className="ml-2 text-muted-foreground">
                                                        {course.units} units • {course.grade}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* UC GPA Information */}
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    <strong>UC GPA Calculation Notes:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Only letter grades (A-F) count toward GPA calculation</li>
                        <li>Pass/No Pass courses do not affect GPA</li>
                        <li>Plus/minus grades use the exact UC grade point values</li>
                        <li>TAG programs require a minimum 3.0 GPA with 30+ transferable units</li>
                        <li>Some competitive programs may require higher GPAs (3.4+)</li>
                    </ul>
                </AlertDescription>
            </Alert>
        </div>
    )
}