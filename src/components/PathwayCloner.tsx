'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import {
    BookOpen,
    Calendar,
    Target,
    Copy,
    CheckCircle,
    AlertCircle,
    Clock,
    MapPin,
    Users,
    Star,
    GraduationCap,
    ArrowRight,
    Plus,
    Trash2
} from 'lucide-react'
import { toast } from 'sonner'
import { TRANSFER_PATHWAYS, type TransferPathway } from '@/data/assist/transfer-pathways'
import { useTransferData, validatePrerequisites } from '@/contexts/TransferDataContext'
import { type AssistCourse } from '@/lib/api/types'

interface PathwayClonerProps {
    userId: string
    onPathwayCloned?: (pathway: TransferPathway, courses: AssistCourse[]) => void
}

interface CourseMapping {
    pathwayCourse: string
    availableCourse: AssistCourse | null
    isRequired: boolean
    isRecommended: boolean
    semester: string
}

export default function PathwayCloner({ userId, onPathwayCloned }: PathwayClonerProps) {
    const { state, actions } = useTransferData()
    const [selectedPathway, setSelectedPathway] = useState<TransferPathway | null>(null)
    const [courseMappings, setCourseMappings] = useState<CourseMapping[]>([])
    const [showCloner, setShowCloner] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedSemesters, setSelectedSemesters] = useState<Record<string, string>>({})

    // Load available courses when component mounts
    useEffect(() => {
        if (state.courses.length === 0) {
            actions.loadCourses()
        }
    }, [])

    // Generate course mappings when pathway is selected
    useEffect(() => {
        if (selectedPathway && state.courses.length > 0) {
            generateCourseMappings()
        }
    }, [selectedPathway, state.courses])

    const generateCourseMappings = () => {
        if (!selectedPathway) return

        const mappings: CourseMapping[] = []

        // Process required courses from all target universities
        selectedPathway.targetUniversities.forEach(uni => {
            uni.requirements.requiredCourses.forEach(courseName => {
                const availableCourse = findMatchingCourse(courseName)
                mappings.push({
                    pathwayCourse: courseName,
                    availableCourse,
                    isRequired: true,
                    isRecommended: false,
                    semester: 'Year 1, Fall'
                })
            })

            // Process recommended courses
            uni.requirements.recommendedCourses.forEach(courseName => {
                const availableCourse = findMatchingCourse(courseName)
                mappings.push({
                    pathwayCourse: courseName,
                    availableCourse,
                    isRequired: false,
                    isRecommended: true,
                    semester: 'Year 1, Spring'
                })
            })
        })

        // Process pathway steps courses
        selectedPathway.pathwaySteps.forEach(step => {
            step.courses.forEach(courseName => {
                // Avoid duplicates
                if (!mappings.find(m => m.pathwayCourse === courseName)) {
                    const availableCourse = findMatchingCourse(courseName)
                    mappings.push({
                        pathwayCourse: courseName,
                        availableCourse,
                        isRequired: false,
                        isRecommended: true,
                        semester: step.timeline
                    })
                }
            })
        })

        setCourseMappings(mappings)
    }

    const findMatchingCourse = (courseName: string): AssistCourse | null => {
        // Try to match by course code and title
        const normalizedName = courseName.toLowerCase()

        // First try exact matches
        let match = state.courses.find(course =>
            course.courseCode.toLowerCase() === normalizedName.split(' ')[0] ||
            course.courseTitle.toLowerCase().includes(normalizedName) ||
            normalizedName.includes(course.courseCode.toLowerCase())
        )

        // If no exact match, try partial matches
        if (!match) {
            const courseCode = normalizedName.split(' ')[0]
            match = state.courses.find(course =>
                course.courseCode.toLowerCase().startsWith(courseCode) ||
                course.courseTitle.toLowerCase().includes(courseCode)
            )
        }

        // If we found a match, validate prerequisites
        if (match && state.studentProfile) {
            const validation = validatePrerequisites(match, state.studentProfile)
            if (!validation.isValid) {
                // Return null if prerequisites are not met
                return null
            }
        }

        return match || null
    }

    const handlePathwaySelect = (pathwayId: string) => {
        const pathway = TRANSFER_PATHWAYS.find(p => p.id === pathwayId)
        setSelectedPathway(pathway || null)
    }

    const handleCourseMappingChange = (index: number, field: keyof CourseMapping, value: any) => {
        setCourseMappings(prev => prev.map((mapping, i) =>
            i === index ? { ...mapping, [field]: value } : mapping
        ))
    }

    const handleSemesterChange = (courseIndex: number, semester: string) => {
        setSelectedSemesters(prev => ({
            ...prev,
            [`${courseIndex}`]: semester
        }))
        handleCourseMappingChange(courseIndex, 'semester', semester)
    }

    const clonePathwayToPlanner = async () => {
        if (!selectedPathway || !state.activeSemesterPlan) {
            toast.error('Please select a pathway and ensure you have an active semester plan')
            return
        }

        setLoading(true)
        try {
            const coursesToAdd = courseMappings
                .filter(mapping => mapping.availableCourse && mapping.isRequired)
                .map(mapping => mapping.availableCourse!)

            // Create semester mappings
            const semesterMappings: Record<string, string> = {}
            courseMappings.forEach((mapping, index) => {
                if (mapping.availableCourse && mapping.isRequired) {
                    semesterMappings[mapping.availableCourse.id.toString()] = mapping.semester
                }
            })

            // Use the new clonePathwayToPlanner action
            actions.clonePathwayToPlanner(selectedPathway, coursesToAdd, semesterMappings)

            toast.success(`Successfully cloned ${selectedPathway.major} pathway to your semester planner!`)
            setShowCloner(false)

            if (onPathwayCloned) {
                onPathwayCloned(selectedPathway, coursesToAdd)
            }
        } catch (error) {
            console.error('Error cloning pathway:', error)
            toast.error('Failed to clone pathway. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const getPathwayStats = (pathway: TransferPathway) => {
        const totalRequired = pathway.targetUniversities.reduce((sum, uni) =>
            sum + uni.requirements.requiredCourses.length, 0
        )
        const totalRecommended = pathway.targetUniversities.reduce((sum, uni) =>
            sum + uni.requirements.recommendedCourses.length, 0
        )
        const avgGPA = pathway.targetUniversities.reduce((sum, uni) =>
            sum + uni.requirements.minGPA, 0
        ) / pathway.targetUniversities.length

        return { totalRequired, totalRecommended, avgGPA }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Clone Transfer Pathway</h2>
                    <p className="text-gray-600">Select a guaranteed transfer pathway and clone it to your semester planner</p>
                </div>
                <Dialog open={showCloner} onOpenChange={setShowCloner}>
                    <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                            <Copy className="h-4 w-4" />
                            Clone Pathway
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Clone Transfer Pathway to Semester Planner</DialogTitle>
                            <DialogDescription>
                                Select a transfer pathway and map its courses to your semester plan
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            {/* Pathway Selection */}
                            <div className="space-y-4">
                                <Label htmlFor="pathway-select">Select Transfer Pathway</Label>
                                <Select onValueChange={handlePathwaySelect}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a transfer pathway..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TRANSFER_PATHWAYS.map(pathway => {
                                            const stats = getPathwayStats(pathway)
                                            return (
                                                <SelectItem key={pathway.id} value={pathway.id}>
                                                    <div className="flex items-center justify-between w-full">
                                                        <div>
                                                            <div className="font-medium">{pathway.major}</div>
                                                            <div className="text-sm text-gray-500">
                                                                {pathway.targetSystem} • {pathway.targetUniversities.length} universities
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-gray-400">
                                                            {stats.totalRequired} required courses
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Selected Pathway Details */}
                            {selectedPathway && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <GraduationCap className="h-5 w-5" />
                                            {selectedPathway.major} Pathway
                                        </CardTitle>
                                        <CardDescription>
                                            {selectedPathway.targetSystem} Transfer Pathway
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Target className="h-4 w-4 text-blue-500" />
                                                <span className="text-sm">
                                                    {selectedPathway.targetUniversities.length} Target Universities
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4 text-green-500" />
                                                <span className="text-sm">
                                                    {getPathwayStats(selectedPathway).totalRequired} Required Courses
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                <span className="text-sm">
                                                    {getPathwayStats(selectedPathway).avgGPA.toFixed(1)} Avg GPA Required
                                                </span>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-2">
                                            <h4 className="font-medium">Target Universities:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedPathway.targetUniversities.map(uni => (
                                                    <Badge key={uni.code} variant="outline">
                                                        {uni.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Course Mappings */}
                            {selectedPathway && courseMappings.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Course Mappings</h3>
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {courseMappings.map((mapping, index) => (
                                            <Card key={index} className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h4 className="font-medium">{mapping.pathwayCourse}</h4>
                                                            {mapping.isRequired && (
                                                                <Badge variant="destructive" className="text-xs">Required</Badge>
                                                            )}
                                                            {mapping.isRecommended && (
                                                                <Badge variant="secondary" className="text-xs">Recommended</Badge>
                                                            )}
                                                        </div>

                                                        {mapping.availableCourse ? (
                                                            <div className="space-y-1">
                                                                <div className="text-sm text-green-600 flex items-center gap-1">
                                                                    <CheckCircle className="h-3 w-3" />
                                                                    Mapped to: {mapping.availableCourse.courseCode} - {mapping.availableCourse.courseTitle}
                                                                </div>
                                                                {state.studentProfile && (() => {
                                                                    const validation = validatePrerequisites(mapping.availableCourse!, state.studentProfile)
                                                                    if (validation.warnings.length > 0) {
                                                                        return (
                                                                            <div className="text-xs text-orange-600">
                                                                                ⚠️ {validation.warnings[0]}
                                                                            </div>
                                                                        )
                                                                    }
                                                                    return null
                                                                })()}
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-1">
                                                                <div className="text-sm text-red-600 flex items-center gap-1">
                                                                    <AlertCircle className="h-3 w-3" />
                                                                    No matching course found
                                                                </div>
                                                                {state.studentProfile && (() => {
                                                                    // Check if there's a course that exists but has unmet prerequisites
                                                                    const normalizedName = mapping.pathwayCourse.toLowerCase()
                                                                    const potentialMatch = state.courses.find(course =>
                                                                        course.courseCode.toLowerCase() === normalizedName.split(' ')[0] ||
                                                                        course.courseTitle.toLowerCase().includes(normalizedName) ||
                                                                        normalizedName.includes(course.courseCode.toLowerCase())
                                                                    )
                                                                    if (potentialMatch) {
                                                                        const validation = validatePrerequisites(potentialMatch, state.studentProfile)
                                                                        if (!validation.isValid) {
                                                                            return (
                                                                                <div className="text-xs text-red-600">
                                                                                    ❌ Missing prerequisites: {validation.missingPrerequisites.join(', ')}
                                                                                </div>
                                                                            )
                                                                        }
                                                                    }
                                                                    return null
                                                                })()}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Select
                                                            value={mapping.semester}
                                                            onValueChange={(value) => handleSemesterChange(index, value)}
                                                        >
                                                            <SelectTrigger className="w-40">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Year 1, Fall">Year 1, Fall</SelectItem>
                                                                <SelectItem value="Year 1, Spring">Year 1, Spring</SelectItem>
                                                                <SelectItem value="Year 2, Fall">Year 2, Fall</SelectItem>
                                                                <SelectItem value="Year 2, Spring">Year 2, Spring</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowCloner(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={clonePathwayToPlanner}
                                    disabled={loading || !selectedPathway || courseMappings.length === 0}
                                    className="flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Cloning...
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4" />
                                            Clone to Planner
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Quick Pathway Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TRANSFER_PATHWAYS.slice(0, 6).map(pathway => {
                    const stats = getPathwayStats(pathway)
                    return (
                        <Card key={pathway.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg">{pathway.major}</CardTitle>
                                <CardDescription>
                                    {pathway.targetSystem} Transfer Pathway
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Required Courses:</span>
                                    <Badge variant="outline">{stats.totalRequired}</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Target Universities:</span>
                                    <Badge variant="outline">{pathway.targetUniversities.length}</Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Avg GPA Required:</span>
                                    <Badge variant="outline">{stats.avgGPA.toFixed(1)}</Badge>
                                </div>
                                <Button
                                    size="sm"
                                    className="w-full"
                                    onClick={() => {
                                        setSelectedPathway(pathway)
                                        setShowCloner(true)
                                    }}
                                >
                                    Clone This Pathway
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}