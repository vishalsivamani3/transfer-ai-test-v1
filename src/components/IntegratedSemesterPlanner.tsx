'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
    Calendar,
    Plus,
    Trash2,
    Edit,
    Target,
    BookOpen,
    TrendingUp,
    CheckCircle,
    AlertCircle,
    Clock,
    GraduationCap,
    School,
    ArrowRight,
    GripVertical,
    User
} from 'lucide-react'
import { toast } from 'sonner'
import { useTransferData, SemesterPlan, Semester, PlannedCourse, AssistCourse } from '@/contexts/TransferDataContext'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter, useDroppable, useDraggable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PathwayCloner from './PathwayCloner'
import StudentProfileSetup from './StudentProfileSetup'

interface IntegratedSemesterPlannerProps {
    userId?: string
}

// Sortable Course Item Component
function SortableCourseItem({ course, onRemove }: { course: PlannedCourse; onRemove: (courseId: number) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: course.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-white border rounded-lg p-3 shadow-sm"
            {...attributes}
            {...listeners}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <h4 className="font-medium text-sm">{course.course.courseCode}</h4>
                        <Badge variant="outline" className="text-xs">
                            {course.credits} units
                        </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{course.course.courseTitle}</p>
                    <p className="text-xs text-gray-500">{course.course.college.name}</p>
                    {course.transferable && (
                        <Badge variant="secondary" className="text-xs mt-1">
                            Transferable
                        </Badge>
                    )}
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemove(course.courseId)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            </div>
        </div>
    )
}

// Draggable Course Item Component
function DraggableCourseItem({ course }: { course: AssistCourse }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useDraggable({
        id: course.id.toString(),
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-gray-50 border rounded-lg p-3 cursor-move hover:bg-gray-100 transition-colors"
            {...attributes}
            {...listeners}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-sm">{course.courseCode}</h4>
                <Badge variant="outline" className="text-xs">
                    {course.units} units
                </Badge>
            </div>
            <p className="text-xs text-gray-600 mb-1">{course.courseTitle}</p>
            <p className="text-xs text-gray-500">{course.college.name}</p>
            {course.transferAgreements.length > 0 && (
                <Badge variant="secondary" className="text-xs mt-1">
                    Transferable
                </Badge>
            )}
        </div>
    )
}

// Selected Courses Drop Zone Component
function SelectedCoursesDropZone() {
    const { state, actions } = useTransferData()
    const { setNodeRef, isOver } = useDroppable({
        id: 'selected-courses',
    })

    return (
        <Card
            ref={setNodeRef}
            className={`transition-colors ${isOver ? 'border-green-500 bg-green-50' : ''}`}
        >
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Selected Courses ({state.selectedCourses.length})
                </CardTitle>
                <CardDescription>
                    Drag these courses to your semester plan or drag courses back here to remove from semesters
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {state.selectedCourses.map((course) => (
                        <DraggableCourseItem key={course.id} course={course} />
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

// Semester Card Component
function SemesterCard({ semester, onAddCourse, onRemoveCourse }: {
    semester: Semester
    onAddCourse: (course: AssistCourse) => void
    onRemoveCourse: (courseId: number) => void
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: semester.id,
    })

    return (
        <Card
            ref={setNodeRef}
            className={`transition-colors ${isOver ? 'border-blue-500 bg-blue-50' : ''}`}
        >
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-lg">{semester.name}</CardTitle>
                        <CardDescription>
                            {semester.credits} credits • {semester.transferableCredits} transferable
                        </CardDescription>
                    </div>
                    <Badge variant="outline">
                        {semester.courses.length} courses
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="min-h-[200px]">
                {semester.courses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Drop courses here</p>
                        <p className="text-xs">or drag from the course browser</p>
                    </div>
                ) : (
                    <SortableContext items={semester.courses.map(c => c.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            {semester.courses.map((course) => (
                                <SortableCourseItem
                                    key={course.id}
                                    course={course}
                                    onRemove={onRemoveCourse}
                                />
                            ))}
                        </div>
                    </SortableContext>
                )}
            </CardContent>
        </Card>
    )
}

export default function IntegratedSemesterPlanner({ userId }: IntegratedSemesterPlannerProps) {
    const { state, actions } = useTransferData()
    const [showCreatePlan, setShowCreatePlan] = useState(false)
    const [newPlanData, setNewPlanData] = useState({
        name: 'My Transfer Plan',
        targetMajor: '',
        targetUniversities: [] as string[],
        timeline: '2-year' as '1-year' | '2-year'
    })
    const [activeId, setActiveId] = useState<string | null>(null)
    const [showProfileSetup, setShowProfileSetup] = useState(false)

    // Load semester plans on mount
    useEffect(() => {
        if (userId) {
            actions.loadSemesterPlans(userId)
        }
    }, [userId])

    // Create new semester plan
    const handleCreatePlan = () => {
        if (!newPlanData.name.trim() || !newPlanData.targetMajor.trim()) {
            toast.error('Please fill in all required fields')
            return
        }

        const semesters: Semester[] = []
        const currentYear = new Date().getFullYear()

        if (newPlanData.timeline === '1-year') {
            semesters.push(
                {
                    id: `sem-${Date.now()}-1`,
                    planId: '',
                    name: 'Fall Semester',
                    year: currentYear,
                    term: 'Fall',
                    courses: [],
                    credits: 0,
                    transferableCredits: 0
                },
                {
                    id: `sem-${Date.now()}-2`,
                    planId: '',
                    name: 'Spring Semester',
                    year: currentYear + 1,
                    term: 'Spring',
                    courses: [],
                    credits: 0,
                    transferableCredits: 0
                }
            )
        } else {
            semesters.push(
                {
                    id: `sem-${Date.now()}-1`,
                    planId: '',
                    name: 'Fall Year 1',
                    year: currentYear,
                    term: 'Fall',
                    courses: [],
                    credits: 0,
                    transferableCredits: 0
                },
                {
                    id: `sem-${Date.now()}-2`,
                    planId: '',
                    name: 'Spring Year 1',
                    year: currentYear + 1,
                    term: 'Spring',
                    courses: [],
                    credits: 0,
                    transferableCredits: 0
                },
                {
                    id: `sem-${Date.now()}-3`,
                    planId: '',
                    name: 'Fall Year 2',
                    year: currentYear + 1,
                    term: 'Fall',
                    courses: [],
                    credits: 0,
                    transferableCredits: 0
                },
                {
                    id: `sem-${Date.now()}-4`,
                    planId: '',
                    name: 'Spring Year 2',
                    year: currentYear + 2,
                    term: 'Spring',
                    courses: [],
                    credits: 0,
                    transferableCredits: 0
                }
            )
        }

        const newPlan: Omit<SemesterPlan, 'id' | 'createdAt' | 'updatedAt'> = {
            name: newPlanData.name,
            targetMajor: newPlanData.targetMajor,
            targetUniversities: newPlanData.targetUniversities,
            timeline: newPlanData.timeline,
            semesters,
            totalCredits: 0,
            transferableCredits: 0,
            status: 'draft'
        }

        actions.createSemesterPlan(newPlan)
        setShowCreatePlan(false)
        setNewPlanData({
            name: 'My Transfer Plan',
            targetMajor: '',
            targetUniversities: [],
            timeline: '2-year'
        })
        toast.success('Semester plan created successfully!')
    }

    // Handle drag start
    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string)
    }

    // Handle drag end
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveId(null)

        if (!over || !state.activeSemesterPlan) return

        // Check if dragging from selected courses to a semester
        const activeCourse = state.selectedCourses.find(c => c.id.toString() === active.id)
        if (activeCourse) {
            // Find the semester that was dropped on
            const semesterId = over.id as string
            actions.addCourseToSemester(semesterId, activeCourse)
            actions.removeSelectedCourse(activeCourse.id)
            toast.success(`Added ${activeCourse.courseCode} to semester`)
            return
        }

        // Check if dragging a course between semesters or back to selected courses
        const activePlannedCourse = state.activeSemesterPlan.semesters
            .flatMap(sem => sem.courses)
            .find(c => c.id.toString() === active.id)

        if (activePlannedCourse) {
            const targetId = over.id as string

            // Find the source semester
            const sourceSemester = state.activeSemesterPlan.semesters.find(sem =>
                sem.courses.some(c => c.id.toString() === active.id)
            )

            if (targetId === 'selected-courses') {
                // Move course back to selected courses
                if (sourceSemester) {
                    actions.removeCourseFromSemester(sourceSemester.id, activePlannedCourse.courseId)
                    actions.addSelectedCourse(activePlannedCourse.course)
                    toast.success(`Moved ${activePlannedCourse.course.courseCode} back to selected courses`)
                }
            } else if (sourceSemester && sourceSemester.id !== targetId) {
                // Move course from source semester to target semester
                actions.removeCourseFromSemester(sourceSemester.id, activePlannedCourse.courseId)
                actions.addCourseToSemester(targetId, activePlannedCourse.course)
                toast.success(`Moved ${activePlannedCourse.course.courseCode} to ${state.activeSemesterPlan.semesters.find(s => s.id === targetId)?.name}`)
            }
        }
    }

    // Add course to semester
    const handleAddCourseToSemester = (semesterId: string, course: AssistCourse) => {
        actions.addCourseToSemester(semesterId, course)
        toast.success(`Added ${course.courseCode} to semester`)
    }

    // Remove course from semester
    const handleRemoveCourseFromSemester = (semesterId: string, courseId: number) => {
        actions.removeCourseFromSemester(semesterId, courseId)
        toast.success('Course removed from semester')
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Semester Planner</h2>
                    <p className="text-muted-foreground">
                        Plan your transfer journey with drag & drop course scheduling
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowProfileSetup(true)}>
                        <User className="h-4 w-4 mr-2" />
                        Set Up Profile
                    </Button>
                    <Dialog open={showCreatePlan} onOpenChange={setShowCreatePlan}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Create New Plan
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Semester Plan</DialogTitle>
                                <DialogDescription>
                                    Set up a new transfer plan with your target major and timeline
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="plan-name">Plan Name</Label>
                                    <Input
                                        id="plan-name"
                                        value={newPlanData.name}
                                        onChange={(e) => setNewPlanData({ ...newPlanData, name: e.target.value })}
                                        placeholder="My Transfer Plan"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="target-major">Target Major</Label>
                                    <Input
                                        id="target-major"
                                        value={newPlanData.targetMajor}
                                        onChange={(e) => setNewPlanData({ ...newPlanData, targetMajor: e.target.value })}
                                        placeholder="e.g., Computer Science"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="timeline">Transfer Timeline</Label>
                                    <Select value={newPlanData.timeline} onValueChange={(value: any) => setNewPlanData({ ...newPlanData, timeline: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1-year">1 Year</SelectItem>
                                            <SelectItem value="2-year">2 Years</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="target-universities">Target Universities (optional)</Label>
                                    <Textarea
                                        id="target-universities"
                                        value={newPlanData.targetUniversities.join(', ')}
                                        onChange={(e) => setNewPlanData({
                                            ...newPlanData,
                                            targetUniversities: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                        })}
                                        placeholder="e.g., UC Berkeley, UCLA, Stanford"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setShowCreatePlan(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreatePlan}>
                                        Create Plan
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Pathway Cloner */}
            {userId && (
                <PathwayCloner
                    userId={userId}
                    onPathwayCloned={(pathway, courses) => {
                        toast.success(`Successfully cloned ${pathway.major} pathway with ${courses.length} courses!`)
                    }}
                />
            )}

            {/* Active Plan Info */}
            {state.activeSemesterPlan && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5" />
                            {state.activeSemesterPlan.name}
                        </CardTitle>
                        <CardDescription>
                            {state.activeSemesterPlan.targetMajor} • {state.activeSemesterPlan.timeline} timeline
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{state.activeSemesterPlan.totalCredits}</div>
                                <div className="text-sm text-gray-600">Total Credits</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{state.activeSemesterPlan.transferableCredits}</div>
                                <div className="text-sm text-gray-600">Transferable Credits</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{state.activeSemesterPlan.semesters.length}</div>
                                <div className="text-sm text-gray-600">Semesters</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {state.activeSemesterPlan.semesters.reduce((sum, sem) => sum + sem.courses.length, 0)}
                                </div>
                                <div className="text-sm text-gray-600">Total Courses</div>
                            </div>
                        </div>

                        {/* Pathway Status */}
                        {state.activeSemesterPlan.semesters.some(sem =>
                            sem.courses.some(course => course.transferPathways.length > 0)
                        ) && (
                                <div className="mt-4 pt-4 border-t">
                                    <h4 className="font-medium mb-2">Following Transfer Pathways:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from(new Set(
                                            state.activeSemesterPlan.semesters
                                                .flatMap(sem => sem.courses)
                                                .flatMap(course => course.transferPathways)
                                                .map(pathway => pathway.major)
                                        )).map(major => (
                                            <Badge key={major} variant="secondary" className="flex items-center gap-1">
                                                <GraduationCap className="h-3 w-3" />
                                                {major}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </CardContent>
                </Card>
            )}


            {/* Drag and Drop Context */}
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* Selected Courses (Draggable) */}
                {state.selectedCourses.length > 0 && (
                    <SelectedCoursesDropZone />
                )}

                {/* Semester Plan */}
                {state.activeSemesterPlan ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {state.activeSemesterPlan.semesters.map((semester) => (
                            <SemesterCard
                                key={semester.id}
                                semester={semester}
                                onAddCourse={(course) => handleAddCourseToSemester(semester.id, course)}
                                onRemoveCourse={(courseId) => handleRemoveCourseFromSemester(semester.id, courseId)}
                            />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Active Semester Plan</h3>
                            <p className="text-gray-600 mb-4">Create a new semester plan to start planning your transfer journey</p>
                            <Button onClick={() => setShowCreatePlan(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Plan
                            </Button>
                        </CardContent>
                    </Card>
                )}

                <DragOverlay>
                    {activeId ? (
                        <div className="bg-white border rounded-lg p-3 shadow-lg">
                            <p className="font-medium text-sm">Dragging course...</p>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Student Profile Setup Dialog */}
            <Dialog open={showProfileSetup} onOpenChange={setShowProfileSetup}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Academic Profile Setup</DialogTitle>
                        <DialogDescription>
                            Set up your academic profile to get better course recommendations and avoid prerequisite issues
                        </DialogDescription>
                    </DialogHeader>
                    <StudentProfileSetup onComplete={() => setShowProfileSetup(false)} />
                </DialogContent>
            </Dialog>
        </div>
    )
}