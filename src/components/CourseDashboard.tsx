'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  MapPin, 
  Users, 
  BookOpen,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { 
  fetchCourses, 
  getUniqueInstitutions, 
  getUniqueDepartments, 
  getUniqueSemesters,
  fetchProfessorRating,
  updateCourseWithProfessorRating,
  type Course,
  type CourseFilters
} from '@/lib/queries'

interface CourseDashboardProps {
  studentInstitution?: string
  onCourseSelect?: (course: Course) => void
}

export default function CourseDashboard({ studentInstitution, onCourseSelect }: CourseDashboardProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [filters, setFilters] = useState<CourseFilters>({
    institution: studentInstitution || '',
    department: '',
    courseCode: '',
    professorName: '',
    minRating: undefined,
    maxDifficulty: undefined,
    semester: '',
    academicYear: '',
    transferCredits: undefined,
    availableSeats: false
  })
  
  // Available filter options
  const [institutions, setInstitutions] = useState<string[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [semesters, setSemesters] = useState<string[]>([])
  
  // Search and sort
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'courseCode' | 'courseName' | 'professorRating' | 'difficulty' | 'enrolled'>('courseCode')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  // Apply filters and search
  useEffect(() => {
    applyFiltersAndSearch()
  }, [courses, filters, searchTerm, sortBy, sortOrder])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load courses and filter options in parallel
      const [coursesData, institutionsData, departmentsData, semestersData] = await Promise.all([
        fetchCourses(filters),
        getUniqueInstitutions(),
        getUniqueDepartments(),
        getUniqueSemesters()
      ])

      setCourses(coursesData)
      setInstitutions(institutionsData)
      setDepartments(departmentsData)
      setSemesters(semestersData)
    } catch (err) {
      setError('Failed to load course data. Please try again.')
      console.error('Error loading course data:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFiltersAndSearch = () => {
    let filtered = [...courses]

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(course =>
        course.courseCode.toLowerCase().includes(term) ||
        course.courseName.toLowerCase().includes(term) ||
        course.professorName?.toLowerCase().includes(term) ||
        course.department.toLowerCase().includes(term)
      )
    }

    // Apply filters
    if (filters.institution) {
      filtered = filtered.filter(course => course.institution === filters.institution)
    }
    if (filters.department) {
      filtered = filtered.filter(course => course.department === filters.department)
    }
    if (filters.courseCode) {
      filtered = filtered.filter(course => 
        course.courseCode.toLowerCase().includes(filters.courseCode!.toLowerCase())
      )
    }
    if (filters.professorName) {
      filtered = filtered.filter(course => 
        course.professorName?.toLowerCase().includes(filters.professorName!.toLowerCase())
      )
    }
    if (filters.minRating) {
      filtered = filtered.filter(course => 
        course.professorRating && course.professorRating >= filters.minRating!
      )
    }
    if (filters.maxDifficulty) {
      filtered = filtered.filter(course => 
        course.professorDifficulty && course.professorDifficulty <= filters.maxDifficulty!
      )
    }
    if (filters.semester) {
      filtered = filtered.filter(course => course.semester === filters.semester)
    }
    if (filters.academicYear) {
      filtered = filtered.filter(course => course.academicYear === filters.academicYear)
    }
    if (filters.transferCredits !== undefined) {
      filtered = filtered.filter(course => course.transferCredits === filters.transferCredits)
    }
    if (filters.availableSeats) {
      filtered = filtered.filter(course => 
        course.capacity && course.enrolled < course.capacity
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'courseCode':
          aValue = a.courseCode
          bValue = b.courseCode
          break
        case 'courseName':
          aValue = a.courseName
          bValue = b.courseName
          break
        case 'professorRating':
          aValue = a.professorRating || 0
          bValue = b.professorRating || 0
          break
        case 'difficulty':
          aValue = a.professorDifficulty || 0
          bValue = b.professorDifficulty || 0
          break
        case 'enrolled':
          aValue = a.enrolled
          bValue = b.enrolled
          break
        default:
          aValue = a.courseCode
          bValue = b.courseCode
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredCourses(filtered)
  }

  const handleFilterChange = (key: keyof CourseFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      institution: studentInstitution || '',
      department: '',
      courseCode: '',
      professorName: '',
      minRating: undefined,
      maxDifficulty: undefined,
      semester: '',
      academicYear: '',
      transferCredits: undefined,
      availableSeats: false
    })
    setSearchTerm('')
  }

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const refreshProfessorRating = async (course: Course) => {
    if (!course.professorName) return

    try {
      const rating = await fetchProfessorRating(course.professorName, course.institution)
      
      if (rating.rating) {
        // Update the course in the database
        await updateCourseWithProfessorRating(
          course.id,
          rating.rating,
          rating.difficulty || 0,
          rating.wouldTakeAgain || 0,
          rating.totalRatings || 0
        )

        // Update the course in local state
        setCourses(prev => prev.map(c => 
          c.id === course.id 
            ? { 
                ...c, 
                professorRating: rating.rating,
                professorDifficulty: rating.difficulty,
                professorWouldTakeAgain: rating.wouldTakeAgain,
                professorTotalRatings: rating.totalRatings || 0
              }
            : c
        ))
      }
    } catch (error) {
      console.error('Error refreshing professor rating:', error)
    }
  }

  const formatClassTimes = (classTimes: any[] | undefined) => {
    if (!classTimes || classTimes.length === 0) return 'TBA'
    
    return classTimes.map(time => 
      `${time.days} ${time.startTime}-${time.endTime} (${time.type})`
    ).join(', ')
  }

  const getAvailabilityStatus = (course: Course) => {
    if (!course.capacity) return { status: 'unknown', text: 'Unknown', icon: AlertCircle }
    if (course.enrolled < course.capacity) {
      return { status: 'available', text: `${course.capacity - course.enrolled} seats`, icon: CheckCircle }
    }
    return { status: 'full', text: `Waitlist: ${course.waitlistCount}`, icon: XCircle }
  }

  const getRatingColor = (rating: number | undefined) => {
    if (!rating) return 'text-gray-400'
    if (rating >= 4.0) return 'text-green-600'
    if (rating >= 3.0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDifficultyColor = (difficulty: number | undefined) => {
    if (!difficulty) return 'text-gray-400'
    if (difficulty <= 2.5) return 'text-green-600'
    if (difficulty <= 3.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Dashboard</CardTitle>
          <CardDescription>Loading courses...</CardDescription>
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
            Course Dashboard
          </CardTitle>
          <CardDescription>
            Browse available courses with professor ratings and class schedules
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search courses, professors, or departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Select value={filters.institution} onValueChange={(value) => handleFilterChange('institution', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All institutions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All institutions</SelectItem>
                  {institutions.map(institution => (
                    <SelectItem key={institution} value={institution}>{institution}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={filters.department} onValueChange={(value) => handleFilterChange('department', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All departments</SelectItem>
                  {departments.map(department => (
                    <SelectItem key={department} value={department}>{department}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Select value={filters.semester} onValueChange={(value) => handleFilterChange('semester', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All semesters</SelectItem>
                  {semesters.map(semester => (
                    <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minRating">Min Rating</Label>
              <Select value={filters.minRating?.toString() || ''} onValueChange={(value) => handleFilterChange('minRating', value ? parseFloat(value) : undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any rating</SelectItem>
                  <SelectItem value="3.0">3.0+</SelectItem>
                  <SelectItem value="3.5">3.5+</SelectItem>
                  <SelectItem value="4.0">4.0+</SelectItem>
                  <SelectItem value="4.5">4.5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxDifficulty">Max Difficulty</Label>
              <Select value={filters.maxDifficulty?.toString() || ''} onValueChange={(value) => handleFilterChange('maxDifficulty', value ? parseFloat(value) : undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any difficulty</SelectItem>
                  <SelectItem value="2.0">2.0 or less</SelectItem>
                  <SelectItem value="2.5">2.5 or less</SelectItem>
                  <SelectItem value="3.0">3.0 or less</SelectItem>
                  <SelectItem value="3.5">3.5 or less</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transferCredits">Transfer Credits</Label>
              <Select value={filters.transferCredits?.toString() || ''} onValueChange={(value) => handleFilterChange('transferCredits', value === 'true' ? true : value === 'false' ? false : undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="All courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All courses</SelectItem>
                  <SelectItem value="true">Transfer credits only</SelectItem>
                  <SelectItem value="false">Non-transfer courses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableSeats">Availability</Label>
              <Select value={filters.availableSeats?.toString() || ''} onValueChange={(value) => handleFilterChange('availableSeats', value === 'true')}>
                <SelectTrigger>
                  <SelectValue placeholder="All courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All courses</SelectItem>
                  <SelectItem value="true">Available seats only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredCourses.length} of {courses.length} courses
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Sort by:</span>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="courseCode">Course Code</SelectItem>
              <SelectItem value="courseName">Course Name</SelectItem>
              <SelectItem value="professorRating">Professor Rating</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="enrolled">Enrollment</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {/* Courses Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('courseCode')}
                >
                  Course
                </TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('professorRating')}
                >
                  Rating
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('difficulty')}
                >
                  Difficulty
                </TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Location</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('enrolled')}
                >
                  Availability
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => {
                const availability = getAvailabilityStatus(course)
                return (
                  <TableRow key={course.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{course.courseCode}</div>
                        <div className="text-sm text-gray-600">{course.courseName}</div>
                        <div className="text-xs text-gray-500">{course.credits} credits</div>
                        {course.transferCredits && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Transfer
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{course.department}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{course.professorName || 'TBA'}</div>
                        {course.professorTotalRatings > 0 && (
                          <div className="text-xs text-gray-500">
                            {course.professorTotalRatings} reviews
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.professorRating ? (
                        <div className="flex items-center gap-1">
                          <Star className={`h-4 w-4 ${getRatingColor(course.professorRating)}`} />
                          <span className={getRatingColor(course.professorRating)}>
                            {course.professorRating.toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {course.professorDifficulty ? (
                        <span className={getDifficultyColor(course.professorDifficulty)}>
                          {course.professorDifficulty.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{formatClassTimes(course.classTimes)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span>{course.location || 'TBA'}</span>
                      </div>
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
                      <div className="flex gap-2">
                        {course.professorName && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refreshProfessorRating(course)}
                            title="Refresh professor rating"
                          >
                            <Star className="h-3 w-3" />
                          </Button>
                        )}
                        {onCourseSelect && (
                          <Button
                            size="sm"
                            onClick={() => onCourseSelect(course)}
                          >
                            Select
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {filteredCourses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No courses found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 