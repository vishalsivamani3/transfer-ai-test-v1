'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy
} from '@dnd-kit/sortable'
import {
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  BookOpen,
  Calendar,
  Target,
  Plus,
  Trash2,
  Edit3,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Star,
  GraduationCap
} from 'lucide-react'
import { toast } from 'sonner'
import {
  createStudentPlan,
  getStudentPlans,
  getStudentPlanWithDetails,
  addCourseToPlan,
  removeCourseFromPlan,
  updateCoursePosition,
  moveCourseBetweenSemesters,
  updatePlanStatus,
  deleteStudentPlan,
  fetchCourses,
  type StudentPlan,
  type PlanSemester,
  type PlanCourse,
  type Course,
  type CreatePlanData
} from '@/lib/queries'

interface SemesterPlannerProps {
  userId: string
}

interface DraggedItem {
  id: string
  type: 'course' | 'semester-course'
  courseId?: string
  semesterId?: string
  planId?: string
}

export default function SemesterPlanner({ userId }: SemesterPlannerProps) {
  const [plans, setPlans] = useState<StudentPlan[]>([])
  const [currentPlan, setCurrentPlan] = useState<StudentPlan | null>(null)
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null)
  const [showCreatePlan, setShowCreatePlan] = useState(false)
  const [newPlanData, setNewPlanData] = useState<CreatePlanData>({
    planName: 'My Transfer Plan',
    transferTimeline: '2-year',
    targetMajor: '',
    targetUniversities: []
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    loadData()
  }, [userId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [plansData, coursesData] = await Promise.all([
        getStudentPlans(userId),
        fetchCourses({})
      ])

      setPlans(plansData)
      setAvailableCourses(coursesData)

      // Load the first plan as current plan
      if (plansData.length > 0) {
        const planDetails = await getStudentPlanWithDetails(plansData[0].id)
        setCurrentPlan(planDetails)
      }
    } catch (err) {
      setError('Failed to load planner data')
      console.error('Error loading planner data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlan = async () => {
    try {
      const newPlan = await createStudentPlan(userId, newPlanData)
      if (newPlan) {
        const planWithDetails = await getStudentPlanWithDetails(newPlan.id)
        setPlans(prev => [newPlan, ...prev])
        setCurrentPlan(planWithDetails)
        setShowCreatePlan(false)
        toast.success('Plan created successfully!')
      } else {
        setError('Failed to create plan')
      }
    } catch (error) {
      console.error('Error creating plan:', error)
      setError('Failed to create plan')
    }
  }

  const handlePlanSelect = async (planId: string) => {
    try {
      const planDetails = await getStudentPlanWithDetails(planId)
      setCurrentPlan(planDetails)
    } catch (error) {
      console.error('Error loading plan details:', error)
      setError('Failed to load plan details')
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setDraggedItem({
      id: active.id as string,
      type: active.data.current?.type || 'course',
      courseId: active.data.current?.courseId,
      semesterId: active.data.current?.semesterId,
      planId: active.data.current?.planId
    })
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) return

    // Handle dropping a course into a semester
    if (active.data.current?.type === 'course' && over.data.current?.type === 'semester') {
      const courseId = active.data.current.courseId
      const semesterId = over.data.current.semesterId
      const planId = currentPlan?.id

      if (courseId && semesterId && planId) {
        handleAddCourseToSemester(planId, semesterId, courseId)
      }
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setDraggedItem(null)
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    if (activeId === overId) {
      setDraggedItem(null)
      return
    }

    // Handle reordering within the same semester
    if (active.data.current?.type === 'semester-course' && over.data.current?.type === 'semester-course') {
      const activeSemesterId = active.data.current.semesterId
      const overSemesterId = over.data.current.semesterId

      if (activeSemesterId === overSemesterId) {
        // Reorder within same semester
        await handleReorderInSemester(activeSemesterId, activeId, overId)
      } else {
        // Move between semesters
        await handleMoveBetweenSemesters(activeId, activeSemesterId, overSemesterId, overId)
      }
    }

    setDraggedItem(null)
  }

  const handleAddCourseToSemester = async (planId: string, semesterId: string, courseId: string) => {
    try {
      const semester = currentPlan?.semesters?.find(s => s.id === semesterId)
      const positionOrder = semester?.courses?.length || 0

      const success = await addCourseToPlan(planId, semesterId, courseId, positionOrder)
      if (success) {
        // Reload current plan
        const updatedPlan = await getStudentPlanWithDetails(planId)
        setCurrentPlan(updatedPlan)
        toast.success('Course added to semester!')
      } else {
        setError('Failed to add course to semester')
      }
    } catch (error) {
      console.error('Error adding course to semester:', error)
      setError('Failed to add course to semester')
    }
  }

  const handleReorderInSemester = async (semesterId: string, activeId: string, overId: string) => {
    try {
      const semester = currentPlan?.semesters?.find(s => s.id === semesterId)
      if (!semester?.courses) return

      const oldIndex = semester.courses.findIndex(c => c.id === activeId)
      const newIndex = semester.courses.findIndex(c => c.id === overId)

      if (oldIndex !== -1 && newIndex !== -1) {
        const course = semester.courses[oldIndex]
        const success = await updateCoursePosition(
          currentPlan!.id,
          semesterId,
          course.courseId,
          newIndex
        )

        if (success) {
          const updatedPlan = await getStudentPlanWithDetails(currentPlan!.id)
          setCurrentPlan(updatedPlan)
        }
      }
    } catch (error) {
      console.error('Error reordering course:', error)
    }
  }

  const handleMoveBetweenSemesters = async (
    courseId: string,
    fromSemesterId: string,
    toSemesterId: string,
    overId: string
  ) => {
    try {
      const toSemester = currentPlan?.semesters?.find(s => s.id === toSemesterId)
      const newPosition = toSemester?.courses?.findIndex(c => c.id === overId) || 0

      const success = await moveCourseBetweenSemesters(
        currentPlan!.id,
        courseId,
        fromSemesterId,
        toSemesterId,
        newPosition
      )

      if (success) {
        const updatedPlan = await getStudentPlanWithDetails(currentPlan!.id)
        setCurrentPlan(updatedPlan)
        toast.success('Course moved to new semester!')
      }
    } catch (error) {
      console.error('Error moving course between semesters:', error)
    }
  }

  const handleRemoveCourse = async (planId: string, semesterId: string, courseId: string) => {
    try {
      const success = await removeCourseFromPlan(planId, semesterId, courseId)
      if (success) {
        const updatedPlan = await getStudentPlanWithDetails(planId)
        setCurrentPlan(updatedPlan)
        toast.success('Course removed from semester!')
      } else {
        setError('Failed to remove course')
      }
    } catch (error) {
      console.error('Error removing course:', error)
      setError('Failed to remove course')
    }
  }

  const getSemesterColor = (semesterType: string) => {
    switch (semesterType) {
      case 'fall': return 'bg-orange-50 border-orange-200'
      case 'spring': return 'bg-green-50 border-green-200'
      case 'summer': return 'bg-blue-50 border-blue-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const getSemesterIcon = (semesterType: string) => {
    switch (semesterType) {
      case 'fall': return '🍂'
      case 'spring': return '🌸'
      case 'summer': return '☀️'
      default: return '📚'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Semester Planner</CardTitle>
          <CardDescription>Loading your transfer plan...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Semester Planner
              </CardTitle>
              <CardDescription>
                Plan your courses semester by semester for a successful transfer
              </CardDescription>
            </div>
            <Dialog open={showCreatePlan} onOpenChange={setShowCreatePlan}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Plan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Transfer Plan</DialogTitle>
                  <DialogDescription>
                    Set up your semester-by-semester course plan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="planName">Plan Name</Label>
                    <Input
                      id="planName"
                      value={newPlanData.planName}
                      onChange={(e) => setNewPlanData({ ...newPlanData, planName: e.target.value })}
                      placeholder="My Transfer Plan"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline">Transfer Timeline</Label>
                    <Select
                      value={newPlanData.transferTimeline}
                      onValueChange={(value: '1-year' | '2-year') => 
                        setNewPlanData({ ...newPlanData, transferTimeline: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-year">1 Year Transfer</SelectItem>
                        <SelectItem value="2-year">2 Year Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="targetMajor">Target Major</Label>
                    <Input
                      id="targetMajor"
                      value={newPlanData.targetMajor}
                      onChange={(e) => setNewPlanData({ ...newPlanData, targetMajor: e.target.value })}
                      placeholder="Computer Science"
                    />
                  </div>
                  <Button onClick={handleCreatePlan} className="w-full">
                    Create Plan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Plan Selection */}
      {plans.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium">Current Plan:</Label>
              <Select
                value={currentPlan?.id || ''}
                onValueChange={handlePlanSelect}
              >
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {plans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.planName} ({plan.transferTimeline})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {currentPlan && (
                <Badge variant={currentPlan.planStatus === 'active' ? 'default' : 'secondary'}>
                  {currentPlan.planStatus}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Planner */}
      {currentPlan ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Available Courses
                </CardTitle>
                <CardDescription>
                  Drag courses to add them to your plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableCourses.map(course => (
                    <SortableCourseCard
                      key={course.id}
                      course={course}
                      type="course"
                      courseId={course.id}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Semester Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {currentPlan.planName}
                </CardTitle>
                <CardDescription>
                  {currentPlan.transferTimeline} transfer plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentPlan.semesters?.map(semester => (
                    <SemesterCard
                      key={semester.id}
                      semester={semester}
                      planId={currentPlan.id}
                      onRemoveCourse={handleRemoveCourse}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <DragOverlay>
            {draggedItem && (
              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">
                    {availableCourses.find(c => c.id === draggedItem.courseId)?.courseCode || 'Course'}
                  </span>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No plans created</h3>
            <p className="text-gray-600 mb-4">
              Create your first transfer plan to start planning your courses semester by semester.
            </p>
            <Button onClick={() => setShowCreatePlan(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Plan
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Sortable Course Card Component
function SortableCourseCard({ course, type, courseId, semesterId, planId }: {
  course: Course
  type: 'course' | 'semester-course'
  courseId: string
  semesterId?: string
  planId?: string
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: course.id,
    data: {
      type,
      courseId,
      semesterId,
      planId
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border border-gray-200 rounded-lg p-3 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="font-medium text-sm">{course.courseCode}</div>
          <div className="text-xs text-gray-600">{course.courseName}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {course.credits} credits
            </Badge>
            {course.professorRating && (
              <div className="flex items-center gap-1 text-xs text-yellow-600">
                <Star className="h-3 w-3" />
                {course.professorRating.toFixed(1)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Semester Card Component
function SemesterCard({ semester, planId, onRemoveCourse }: {
  semester: PlanSemester
  planId: string
  onRemoveCourse: (planId: string, semesterId: string, courseId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: semester.id,
    data: {
      type: 'semester',
      semesterId: semester.id
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getSemesterColor = (semesterType: string) => {
    switch (semesterType) {
      case 'fall': return 'bg-orange-50 border-orange-200'
      case 'spring': return 'bg-green-50 border-green-200'
      case 'summer': return 'bg-blue-50 border-blue-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  const getSemesterIcon = (semesterType: string) => {
    switch (semesterType) {
      case 'fall': return '🍂'
      case 'spring': return '🌸'
      case 'summer': return '☀️'
      default: return '📚'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`border-2 border-dashed rounded-lg p-4 ${getSemesterColor(semester.semesterType)}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getSemesterIcon(semester.semesterType)}</span>
          <h3 className="font-semibold">{semester.semesterName}</h3>
        </div>
        <Badge variant="outline">
          {semester.totalCredits} credits
        </Badge>
      </div>

      <SortableContext
        items={semester.courses?.map(c => c.id) || []}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 min-h-[100px]">
          {semester.courses?.map(course => (
            <SortableCourseCard
              key={course.id}
              course={course.course!}
              type="semester-course"
              courseId={course.courseId}
              semesterId={semester.id}
              planId={planId}
            />
          ))}
        </div>
      </SortableContext>

      {semester.courses?.length === 0 && (
        <div className="text-center text-gray-500 text-sm py-8">
          Drop courses here
        </div>
      )}
    </div>
  )
} 