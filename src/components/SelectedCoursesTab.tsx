'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  BookOpen,
  Star,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Edit3,
  Calendar,
  Target
} from 'lucide-react'
import { toast } from 'sonner'
import {
  getStudentCourses,
  updateStudentCourseStatus,
  removeStudentCourse,
  updateCoursePriority,
  type StudentCourseWithDetails
} from '@/lib/queries'

interface SelectedCoursesTabProps {
  userId: string
}

export default function SelectedCoursesTab({ userId }: SelectedCoursesTabProps) {
  const [selectedCourses, setSelectedCourses] = useState<StudentCourseWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingCourse, setEditingCourse] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    status: '',
    grade: '',
    notes: '',
    priority: 1
  })

  useEffect(() => {
    loadSelectedCourses()
  }, [userId])

  const loadSelectedCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const courses = await getStudentCourses(userId)
      setSelectedCourses(courses)
    } catch (err) {
      setError('Failed to load selected courses')
      console.error('Error loading selected courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (courseId: string, status: 'selected' | 'enrolled' | 'completed' | 'dropped') => {
    try {
      const success = await updateStudentCourseStatus(userId, courseId, status)
      if (success) {
        setSelectedCourses(prev => prev.map(course => 
          course.courseId === courseId 
            ? { ...course, status }
            : course
        ))
        toast.success('Course status updated successfully')
      } else {
        setError('Failed to update course status')
      }
    } catch (error) {
      console.error('Error updating course status:', error)
      setError('Failed to update course status')
    }
  }

  const handleRemoveCourse = async (courseId: string) => {
    try {
      const success = await removeStudentCourse(userId, courseId)
      if (success) {
        setSelectedCourses(prev => prev.filter(course => course.courseId !== courseId))
        toast.success('Course removed from selections')
      } else {
        setError('Failed to remove course')
      }
    } catch (error) {
      console.error('Error removing course:', error)
      setError('Failed to remove course')
    }
  }

  const handlePriorityUpdate = async (courseId: string, priority: number) => {
    try {
      const success = await updateCoursePriority(userId, courseId, priority)
      if (success) {
        setSelectedCourses(prev => prev.map(course => 
          course.courseId === courseId 
            ? { ...course, priority }
            : course
        ))
        toast.success('Course priority updated')
      } else {
        setError('Failed to update course priority')
      }
    } catch (error) {
      console.error('Error updating course priority:', error)
      setError('Failed to update course priority')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selected': return 'bg-blue-100 text-blue-800'
      case 'enrolled': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      case 'dropped': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'selected': return Target
      case 'enrolled': return BookOpen
      case 'completed': return CheckCircle
      case 'dropped': return XCircle
      default: return AlertCircle
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatClassTimes = (classTimes: any[] | undefined) => {
    if (!classTimes || classTimes.length === 0) return 'TBA'
    return classTimes.map(time =>
      `${time.days} ${time.startTime}-${time.endTime} (${time.type})`
    ).join(', ')
  }

  const getAvailabilityStatus = (course: any) => {
    if (!course.capacity) return { status: 'unknown', text: 'Unknown', icon: AlertCircle }
    if (course.enrolled < course.capacity) {
      return { status: 'available', text: `${course.capacity - course.enrolled} seats`, icon: CheckCircle }
    }
    return { status: 'full', text: `Waitlist: ${course.waitlistCount}`, icon: XCircle }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Selected Courses</CardTitle>
          <CardDescription>Loading your course selections...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Selected Courses
          </CardTitle>
          <CardDescription>
            Manage your course selections and track your academic progress
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Selected</p>
                <p className="text-2xl font-bold">
                  {selectedCourses.filter(c => c.status === 'selected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Enrolled</p>
                <p className="text-2xl font-bold">
                  {selectedCourses.filter(c => c.status === 'enrolled').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">
                  {selectedCourses.filter(c => c.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold">
                  {selectedCourses.reduce((sum, c) => sum + c.course.credits, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Selected Courses Table */}
      {selectedCourses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses selected</h3>
            <p className="text-gray-600 mb-4">
              Start by browsing courses and adding them to your selections.
            </p>
            <Button onClick={() => window.location.href = '#courses'}>
              Browse Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Selected Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCourses
                  .sort((a, b) => a.priority - b.priority)
                  .map((selectedCourse) => {
                    const course = selectedCourse.course
                    const availability = getAvailabilityStatus(course)
                    const StatusIcon = getStatusIcon(selectedCourse.status)
                    
                    return (
                      <TableRow key={selectedCourse.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course.courseCode}: {course.courseName}</div>
                            <div className="text-sm text-gray-600">{course.department}</div>
                            <div className="text-xs text-gray-500">{course.credits} credits</div>
                            {course.professorName && (
                              <div className="text-xs text-gray-500">
                                Prof. {course.professorName}
                                {course.professorRating && (
                                  <span className="ml-2 text-yellow-600">
                                    ★ {course.professorRating.toFixed(1)}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(selectedCourse.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {selectedCourse.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={selectedCourse.priority.toString()}
                            onValueChange={(value) => handlePriorityUpdate(selectedCourse.courseId, parseInt(value))}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>{formatClassTimes(course.classTimes)}</span>
                          </div>
                          {course.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <MapPin className="h-3 w-3" />
                              <span>{course.location}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <availability.icon className={`h-4 w-4 ${
                              availability.status === 'available' ? 'text-green-600' :
                              availability.status === 'full' ? 'text-red-600' : 'text-gray-400'
                            }`} />
                            <span className="text-sm">{availability.text}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {formatDate(selectedCourse.selectionDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Select
                              value={selectedCourse.status}
                              onValueChange={(value: any) => handleStatusUpdate(selectedCourse.courseId, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="selected">Selected</SelectItem>
                                <SelectItem value="enrolled">Enrolled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="dropped">Dropped</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveCourse(selectedCourse.courseId)}
                              title="Remove from selections"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 