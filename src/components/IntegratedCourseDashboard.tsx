'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
    XCircle,
    Plus,
    Minus,
    Target,
    GraduationCap,
    User,
    Calendar,
    Award,
    Zap
} from 'lucide-react'
import { toast } from 'sonner'
import { useTransferData, AssistCourse } from '@/contexts/TransferDataContext'

interface IntegratedCourseDashboardProps {
    studentInstitution?: string
    userId?: string
}

export default function IntegratedCourseDashboard({ studentInstitution, userId }: IntegratedCourseDashboardProps) {
    const { state, actions } = useTransferData()
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<'courseCode' | 'courseTitle' | 'department' | 'units' | 'professorRating' | 'professorDifficulty' | 'availableSeats' | 'transferability'>('courseCode')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [activeTab, setActiveTab] = useState('browse')

    // Load initial data
    useEffect(() => {
        actions.loadCourses()
        actions.loadTransferAgreements()
    }, [])

    // Handle search
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            actions.loadCourses()
            return
        }

        await actions.searchCourses(searchQuery, {
            department: state.filters.department !== 'any' ? state.filters.department : undefined,
            transferType: state.filters.transferType !== 'any' ? state.filters.transferType : undefined
        })
    }

    // Handle course selection
    const handleCourseSelect = (course: AssistCourse) => {
        const isSelected = state.selectedCourses.some(c => c.id === course.id)
        if (isSelected) {
            actions.removeSelectedCourse(course.id)
            toast.success(`Removed ${course.courseCode} from selection`)
        } else {
            actions.addSelectedCourse(course)
            toast.success(`Added ${course.courseCode} to selection`)
        }
    }

    // Handle filter changes
    const handleFilterChange = (key: string, value: string) => {
        actions.setFilter(key as any, value)
    }

    // Get filtered and sorted courses
    const getFilteredCourses = () => {
        let courses = state.searchResults.courses.length > 0 ? state.searchResults.courses : state.courses

        // Apply additional client-side filters
        if (state.filters.department && state.filters.department !== 'any') {
            courses = courses.filter(course =>
                course.department?.toLowerCase().includes(state.filters.department.toLowerCase())
            )
        }

        if (state.filters.transferType && state.filters.transferType !== 'any') {
            courses = courses.filter(course =>
                course.transferAgreements.some(agreement => agreement.transferType === state.filters.transferType)
            )
        }

        // New filters
        if (state.filters.transferability && state.filters.transferability !== 'all') {
            courses = courses.filter(course => {
                if (state.filters.transferability === 'transferable') {
                    return course.transferCredits === true || course.transferAgreements.length > 0
                } else if (state.filters.transferability === 'non-transferable') {
                    return course.transferCredits === false && course.transferAgreements.length === 0
                }
                return true
            })
        }

        if (state.filters.timeSlot && state.filters.timeSlot !== 'all') {
            courses = courses.filter(course => {
                if (!course.classTimes || course.classTimes.length === 0) return false

                return course.classTimes.some(timeSlot => {
                    const startHour = parseInt(timeSlot.startTime.split(':')[0])
                    switch (state.filters.timeSlot) {
                        case 'morning':
                            return startHour >= 6 && startHour < 12
                        case 'afternoon':
                            return startHour >= 12 && startHour < 17
                        case 'evening':
                            return startHour >= 17 && startHour < 22
                        case 'online':
                            return timeSlot.type.toLowerCase().includes('online') || timeSlot.type.toLowerCase().includes('virtual')
                        default:
                            return true
                    }
                })
            })
        }

        if (state.filters.instructor) {
            courses = courses.filter(course =>
                course.professorName?.toLowerCase().includes(state.filters.instructor.toLowerCase())
            )
        }

        if (state.filters.minRating && state.filters.minRating !== 'any') {
            const minRating = parseFloat(state.filters.minRating)
            courses = courses.filter(course =>
                course.professorRating && course.professorRating >= minRating
            )
        }

        if (state.filters.maxDifficulty && state.filters.maxDifficulty !== 'any') {
            const maxDifficulty = parseFloat(state.filters.maxDifficulty)
            courses = courses.filter(course =>
                course.professorDifficulty && course.professorDifficulty <= maxDifficulty
            )
        }

        if (state.filters.availableSeats && state.filters.availableSeats !== 'all') {
            courses = courses.filter(course => {
                if (!course.capacity || !course.enrolled) return false
                const availableSeats = course.capacity - course.enrolled

                if (state.filters.availableSeats === 'available') {
                    return availableSeats > 0
                } else if (state.filters.availableSeats === 'waitlist-only') {
                    return availableSeats <= 0 && course.waitlistCount !== undefined
                }
                return true
            })
        }

        // Sort courses
        courses.sort((a, b) => {
            let aValue: any, bValue: any

            switch (sortBy) {
                case 'courseCode':
                    aValue = a.courseCode
                    bValue = b.courseCode
                    break
                case 'courseTitle':
                    aValue = a.courseTitle
                    bValue = b.courseTitle
                    break
                case 'department':
                    aValue = a.department || ''
                    bValue = b.department || ''
                    break
                case 'units':
                    aValue = a.units || 0
                    bValue = b.units || 0
                    break
                case 'professorRating':
                    aValue = a.professorRating || 0
                    bValue = b.professorRating || 0
                    break
                case 'professorDifficulty':
                    aValue = a.professorDifficulty || 0
                    bValue = b.professorDifficulty || 0
                    break
                case 'availableSeats':
                    const aAvailable = (a.capacity || 0) - (a.enrolled || 0)
                    const bAvailable = (b.capacity || 0) - (b.enrolled || 0)
                    aValue = aAvailable
                    bValue = bAvailable
                    break
                case 'transferability':
                    const aTransferable = a.transferCredits === true || a.transferAgreements.length > 0
                    const bTransferable = b.transferCredits === true || b.transferAgreements.length > 0
                    aValue = aTransferable ? 1 : 0
                    bValue = bTransferable ? 1 : 0
                    break
                default:
                    aValue = a.courseCode
                    bValue = b.courseCode
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
            }
        })

        return courses
    }

    const filteredCourses = getFilteredCourses()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Course Browser</h2>
                    <p className="text-muted-foreground">
                        Browse and select courses from California colleges
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {filteredCourses.length} courses
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {state.selectedCourses.length} selected
                    </Badge>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Search & Filter Courses
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Search and Basic Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="search">Search Courses</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="search"
                                    placeholder="e.g., Calculus, MATH 150"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <Button onClick={handleSearch} size="sm">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                placeholder="e.g., Mathematics"
                                value={state.filters.department}
                                onChange={(e) => handleFilterChange('department', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="instructor">Instructor</Label>
                            <Input
                                id="instructor"
                                placeholder="e.g., Dr. Smith"
                                value={state.filters.instructor}
                                onChange={(e) => handleFilterChange('instructor', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="sort">Sort By</Label>
                            <div className="flex gap-2">
                                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="courseCode">Course Code</SelectItem>
                                        <SelectItem value="courseTitle">Course Title</SelectItem>
                                        <SelectItem value="department">Department</SelectItem>
                                        <SelectItem value="units">Units</SelectItem>
                                        <SelectItem value="professorRating">Professor Rating</SelectItem>
                                        <SelectItem value="professorDifficulty">Professor Difficulty</SelectItem>
                                        <SelectItem value="availableSeats">Available Seats</SelectItem>
                                        <SelectItem value="transferability">Transferability</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-3"
                                >
                                    {sortOrder === 'asc' ? (
                                        <TrendingUp className="h-4 w-4" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div>
                            <Label htmlFor="transferability">Transferability</Label>
                            <Select value={state.filters.transferability} onValueChange={(value) => handleFilterChange('transferability', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All courses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All courses</SelectItem>
                                    <SelectItem value="transferable">Transferable only</SelectItem>
                                    <SelectItem value="non-transferable">Non-transferable only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="time-slot">Time Slot</Label>
                            <Select value={state.filters.timeSlot} onValueChange={(value) => handleFilterChange('timeSlot', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Any time" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any time</SelectItem>
                                    <SelectItem value="morning">Morning (6AM-12PM)</SelectItem>
                                    <SelectItem value="afternoon">Afternoon (12PM-5PM)</SelectItem>
                                    <SelectItem value="evening">Evening (5PM-10PM)</SelectItem>
                                    <SelectItem value="online">Online/Virtual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="min-rating">Min Rating</Label>
                            <Select value={state.filters.minRating} onValueChange={(value) => handleFilterChange('minRating', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Any rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Any rating</SelectItem>
                                    <SelectItem value="3.0">3.0+ stars</SelectItem>
                                    <SelectItem value="3.5">3.5+ stars</SelectItem>
                                    <SelectItem value="4.0">4.0+ stars</SelectItem>
                                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="max-difficulty">Max Difficulty</Label>
                            <Select value={state.filters.maxDifficulty} onValueChange={(value) => handleFilterChange('maxDifficulty', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Any difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Any difficulty</SelectItem>
                                    <SelectItem value="2.0">Very Easy (≤2.0)</SelectItem>
                                    <SelectItem value="2.5">Easy (≤2.5)</SelectItem>
                                    <SelectItem value="3.0">Moderate (≤3.0)</SelectItem>
                                    <SelectItem value="3.5">Challenging (≤3.5)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="available-seats">Availability</Label>
                            <Select value={state.filters.availableSeats} onValueChange={(value) => handleFilterChange('availableSeats', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All courses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All courses</SelectItem>
                                    <SelectItem value="available">Available seats</SelectItem>
                                    <SelectItem value="waitlist-only">Waitlist only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="transfer-type">Transfer Type</Label>
                            <Select value={state.filters.transferType} onValueChange={(value) => handleFilterChange('transferType', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Any transfer type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="any">Any transfer type</SelectItem>
                                    <SelectItem value="UC_TRANSFERABLE">UC Transferable</SelectItem>
                                    <SelectItem value="CSU_TRANSFERABLE">CSU Transferable</SelectItem>
                                    <SelectItem value="IGETC_APPROVED">IGETC Approved</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => actions.clearFilters()}>
                            <Filter className="h-4 w-4 mr-2" />
                            Clear Filters
                        </Button>
                        <Button variant="outline" onClick={() => actions.clearSelectedCourses()}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Clear Selection
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="browse">Browse Courses</TabsTrigger>
                    <TabsTrigger value="selected">Selected Courses ({state.selectedCourses.length})</TabsTrigger>
                    <TabsTrigger value="transfer-info">Transfer Information</TabsTrigger>
                </TabsList>

                <TabsContent value="browse" className="space-y-4">
                    {/* Loading State */}
                    {state.loading.courses && (
                        <Card>
                            <CardContent className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading courses...</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Error State */}
                    {state.errors.courses && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{state.errors.courses}</AlertDescription>
                        </Alert>
                    )}

                    {/* Courses Table */}
                    {!state.loading.courses && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Available Courses</CardTitle>
                                <CardDescription>
                                    Click the + button to add courses to your selection
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Course</TableHead>
                                                <TableHead>Title</TableHead>
                                                <TableHead>Department</TableHead>
                                                <TableHead>College</TableHead>
                                                <TableHead>Units</TableHead>
                                                <TableHead>Professor</TableHead>
                                                <TableHead>Rating</TableHead>
                                                <TableHead>Schedule</TableHead>
                                                <TableHead>Availability</TableHead>
                                                <TableHead>Transfer Info</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredCourses.map((course) => {
                                                const isSelected = state.selectedCourses.some(c => c.id === course.id)
                                                const availableSeats = (course.capacity || 0) - (course.enrolled || 0)
                                                const isTransferable = course.transferCredits === true || course.transferAgreements.length > 0

                                                return (
                                                    <TableRow key={course.id}>
                                                        <TableCell className="font-medium">{course.courseCode}</TableCell>
                                                        <TableCell className="max-w-xs">
                                                            <div className="truncate" title={course.courseTitle}>
                                                                {course.courseTitle}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{course.department || 'N/A'}</TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {course.college.type}
                                                                </Badge>
                                                                <span className="text-sm truncate max-w-24" title={course.college.name}>
                                                                    {course.college.name}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{course.units || 'N/A'}</TableCell>
                                                        <TableCell>
                                                            {course.professorName ? (
                                                                <div className="text-sm">
                                                                    <div className="font-medium truncate max-w-24" title={course.professorName}>
                                                                        {course.professorName}
                                                                    </div>
                                                                    {course.professorTotalRatings && (
                                                                        <div className="text-xs text-gray-500">
                                                                            {course.professorTotalRatings} reviews
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 text-sm">TBA</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {course.professorRating ? (
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                                    <span className="text-sm font-medium">{course.professorRating}</span>
                                                                    {course.professorDifficulty && (
                                                                        <div className="text-xs text-gray-500">
                                                                            ({course.professorDifficulty}/5)
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 text-sm">N/A</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {course.classTimes && course.classTimes.length > 0 ? (
                                                                <div className="text-xs space-y-1">
                                                                    {course.classTimes.slice(0, 2).map((time, index) => (
                                                                        <div key={index} className="flex items-center gap-1">
                                                                            <Clock className="h-3 w-3" />
                                                                            <span>{time.days} {time.startTime}-{time.endTime}</span>
                                                                        </div>
                                                                    ))}
                                                                    {course.classTimes.length > 2 && (
                                                                        <div className="text-gray-500">+{course.classTimes.length - 2} more</div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 text-sm">TBA</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {course.capacity && course.enrolled !== undefined ? (
                                                                <div className="text-sm">
                                                                    <div className={`font-medium ${availableSeats > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                        {availableSeats > 0 ? `${availableSeats} available` : 'Full'}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {course.enrolled}/{course.capacity}
                                                                    </div>
                                                                    {course.waitlistCount && course.waitlistCount > 0 && (
                                                                        <div className="text-xs text-orange-600">
                                                                            {course.waitlistCount} on waitlist
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400 text-sm">N/A</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-1">
                                                                {isTransferable ? (
                                                                    <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                                        Transferable
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        <XCircle className="h-3 w-3 mr-1" />
                                                                        Non-transferable
                                                                    </Badge>
                                                                )}
                                                                {course.transferAgreements.slice(0, 1).map((agreement) => (
                                                                    <Badge key={agreement.id} variant="outline" className="text-xs">
                                                                        {agreement.transferType ? agreement.transferType.replace('_', ' ') : 'Transfer'}
                                                                    </Badge>
                                                                ))}
                                                                {course.transferAgreements.length > 1 && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        +{course.transferAgreements.length - 1}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                size="sm"
                                                                variant={isSelected ? "destructive" : "default"}
                                                                onClick={() => handleCourseSelect(course)}
                                                            >
                                                                {isSelected ? (
                                                                    <>
                                                                        <Minus className="h-3 w-3 mr-1" />
                                                                        Remove
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Plus className="h-3 w-3 mr-1" />
                                                                        Add
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="selected" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Selected Courses ({state.selectedCourses.length})
                            </CardTitle>
                            <CardDescription>
                                These courses are ready to be added to your semester plan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {state.selectedCourses.length === 0 ? (
                                <div className="text-center py-8">
                                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No courses selected yet</p>
                                    <p className="text-sm text-gray-500">Browse courses and click the + button to add them</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {state.selectedCourses.map((course) => (
                                        <div key={course.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{course.courseCode} - {course.courseTitle}</h3>
                                                    <p className="text-sm text-gray-600">{course.college.name} • {course.department}</p>
                                                    <p className="text-sm text-gray-500">{course.units} units</p>
                                                    {course.description && (
                                                        <p className="text-sm text-gray-700 mt-2">{course.description}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-wrap gap-1">
                                                        {course.transferAgreements.slice(0, 3).map((agreement) => (
                                                            <Badge key={agreement.id} variant="secondary" className="text-xs">
                                                                {agreement.transferType ? agreement.transferType.replace('_', ' ') : 'Transfer'}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => actions.removeSelectedCourse(course.id)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="transfer-info" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Transfer Information
                            </CardTitle>
                            <CardDescription>
                                Transfer agreements and pathway information for your selected courses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {state.selectedCourses.length === 0 ? (
                                <div className="text-center py-8">
                                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">Select courses to view transfer information</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {state.selectedCourses.map((course) => (
                                        <div key={course.id} className="border rounded-lg p-4">
                                            <h3 className="font-semibold text-lg mb-3">{course.courseCode} - {course.courseTitle}</h3>

                                            {course.transferAgreements.length > 0 ? (
                                                <div className="space-y-3">
                                                    <h4 className="font-medium">Transfer Agreements:</h4>
                                                    {course.transferAgreements.map((agreement) => (
                                                        <div key={agreement.id} className="bg-gray-50 rounded-lg p-3">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <Badge variant="outline">
                                                                    {agreement.transferType ? agreement.transferType.replace('_', ' ') : 'Transfer'}
                                                                </Badge>
                                                                {agreement.isActive && (
                                                                    <Badge variant="default" className="text-xs">Active</Badge>
                                                                )}
                                                            </div>
                                                            {agreement.equivalentCourse && (
                                                                <p className="text-sm text-gray-700">
                                                                    <strong>Equivalent:</strong> {agreement.equivalentCourse}
                                                                </p>
                                                            )}
                                                            {agreement.unitsTransferred && (
                                                                <p className="text-sm text-gray-700">
                                                                    <strong>Units:</strong> {agreement.unitsTransferred}
                                                                </p>
                                                            )}
                                                            {agreement.transferNotes && (
                                                                <p className="text-sm text-gray-600 mt-1">{agreement.transferNotes}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                                                    <p className="text-gray-600">No transfer agreements found for this course</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}