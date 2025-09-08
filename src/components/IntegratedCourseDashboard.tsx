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
    GraduationCap
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
    const [sortBy, setSortBy] = useState<'courseCode' | 'courseTitle' | 'department' | 'units'>('courseCode')
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
                <CardContent className="space-y-4">
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

                        <div>
                            <Label htmlFor="sort">Sort By</Label>
                            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="courseCode">Course Code</SelectItem>
                                    <SelectItem value="courseTitle">Course Title</SelectItem>
                                    <SelectItem value="department">Department</SelectItem>
                                    <SelectItem value="units">Units</SelectItem>
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
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Department</TableHead>
                                            <TableHead>College</TableHead>
                                            <TableHead>Units</TableHead>
                                            <TableHead>Transfer Info</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredCourses.map((course) => {
                                            const isSelected = state.selectedCourses.some(c => c.id === course.id)
                                            return (
                                                <TableRow key={course.id}>
                                                    <TableCell className="font-medium">{course.courseCode}</TableCell>
                                                    <TableCell>{course.courseTitle}</TableCell>
                                                    <TableCell>{course.department || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {course.college.type}
                                                            </Badge>
                                                            <span className="text-sm">{course.college.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{course.units || 'N/A'}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {course.transferAgreements.slice(0, 2).map((agreement) => (
                                                                <Badge key={agreement.id} variant="secondary" className="text-xs">
                                                                    {agreement.transferType ? agreement.transferType.replace('_', ' ') : 'Transfer'}
                                                                </Badge>
                                                            ))}
                                                            {course.transferAgreements.length > 2 && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    +{course.transferAgreements.length - 2}
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