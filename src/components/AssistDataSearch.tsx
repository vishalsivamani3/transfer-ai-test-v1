'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Search,
    BookOpen,
    School,
    TrendingUp,
    MapPin,
    Calendar,
    Users,
    Award
} from 'lucide-react'
import {
    searchColleges,
    searchCoursesAdvanced,
    searchTransferAgreements
} from '@/lib/queries'

export default function AssistDataSearch() {
    const [activeTab, setActiveTab] = useState('courses')
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<any[]>([])

    // Search states
    const [courseQuery, setCourseQuery] = useState('')
    const [collegeQuery, setCollegeQuery] = useState('')
    const [transferQuery, setTransferQuery] = useState('')

    // Filters
    const [collegeType, setCollegeType] = useState<string>('any')
    const [department, setDepartment] = useState('')
    const [transferType, setTransferType] = useState('any')

    const handleCourseSearch = async () => {
        if (!courseQuery.trim()) return

        setLoading(true)
        try {
            const results = await searchCoursesAdvanced({
                query: courseQuery,
                department: department || undefined,
                transferType: transferType && transferType !== 'any' ? transferType : undefined
            })
            setResults(results)
        } catch (error) {
            console.error('Error searching courses:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCollegeSearch = async () => {
        setLoading(true)
        try {
            const results = await searchColleges(
                collegeQuery,
                collegeType && collegeType !== 'any' ? collegeType as 'UC' | 'CSU' | 'CCC' | 'AICCU' : undefined
            )
            setResults(results)
        } catch (error) {
            console.error('Error searching colleges:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleTransferSearch = async () => {
        if (!transferQuery.trim()) return

        setLoading(true)
        try {
            const results = await searchTransferAgreements({
                query: transferQuery,
                transferType: transferType && transferType !== 'any' ? transferType : undefined
            })
            setResults(results)
        } catch (error) {
            console.error('Error searching transfer agreements:', error)
        } finally {
            setLoading(false)
        }
    }

    const clearResults = () => {
        setResults([])
        setCourseQuery('')
        setCollegeQuery('')
        setTransferQuery('')
        setCollegeType('any')
        setDepartment('')
        setTransferType('any')
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    🔍 California Transfer Data Search
                </h1>
                <p className="text-gray-600">
                    Search through 909 courses, 19 colleges, and 2,877 transfer agreements
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="courses" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Courses
                    </TabsTrigger>
                    <TabsTrigger value="colleges" className="flex items-center gap-2">
                        <School className="h-4 w-4" />
                        Colleges
                    </TabsTrigger>
                    <TabsTrigger value="transfers" className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Transfer Agreements
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="courses" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Search Courses</CardTitle>
                            <CardDescription>
                                Find specific courses by name, code, department, or transfer type
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="course-search">Search Term</Label>
                                    <Input
                                        id="course-search"
                                        placeholder="e.g., Calculus, MATH 150, Computer Science"
                                        value={courseQuery}
                                        onChange={(e) => setCourseQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleCourseSearch()}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        placeholder="e.g., Mathematics, Computer Science"
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="transfer-type">Transfer Type</Label>
                                    <Select value={transferType} onValueChange={setTransferType}>
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
                                <Button onClick={handleCourseSearch} disabled={loading}>
                                    <Search className="h-4 w-4 mr-2" />
                                    {loading ? 'Searching...' : 'Search Courses'}
                                </Button>
                                <Button variant="outline" onClick={clearResults}>
                                    Clear
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="colleges" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Search Colleges</CardTitle>
                            <CardDescription>
                                Find California colleges and universities by name, code, or type
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="college-search">Search Term</Label>
                                    <Input
                                        id="college-search"
                                        placeholder="e.g., Berkeley, UCLA, UC, CSU"
                                        value={collegeQuery}
                                        onChange={(e) => setCollegeQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleCollegeSearch()}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="college-type">College Type</Label>
                                    <Select value={collegeType} onValueChange={setCollegeType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Any type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="any">Any type</SelectItem>
                                            <SelectItem value="UC">UC (University of California)</SelectItem>
                                            <SelectItem value="CSU">CSU (California State University)</SelectItem>
                                            <SelectItem value="CCC">CCC (Community College)</SelectItem>
                                            <SelectItem value="AICCU">AICCU (Private)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleCollegeSearch} disabled={loading}>
                                    <Search className="h-4 w-4 mr-2" />
                                    {loading ? 'Searching...' : 'Search Colleges'}
                                </Button>
                                <Button variant="outline" onClick={clearResults}>
                                    Clear
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="transfers" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Search Transfer Agreements</CardTitle>
                            <CardDescription>
                                Find specific transfer agreements between colleges
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="transfer-search">Search Term</Label>
                                    <Input
                                        id="transfer-search"
                                        placeholder="e.g., Calculus, UC Berkeley, IGETC"
                                        value={transferQuery}
                                        onChange={(e) => setTransferQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleTransferSearch()}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="transfer-type-filter">Transfer Type</Label>
                                    <Select value={transferType} onValueChange={setTransferType}>
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
                                <Button onClick={handleTransferSearch} disabled={loading}>
                                    <Search className="h-4 w-4 mr-2" />
                                    {loading ? 'Searching...' : 'Search Transfer Agreements'}
                                </Button>
                                <Button variant="outline" onClick={clearResults}>
                                    Clear
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Results */}
            {results.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Search Results ({results.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activeTab === 'courses' && (
                            <div className="space-y-4">
                                {results.map((course) => (
                                    <div key={course.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-lg">{course.courseCode} - {course.courseTitle}</h3>
                                                <p className="text-sm text-gray-600">{course.college?.name}</p>
                                                <p className="text-sm text-gray-500">{course.department} • {course.units} units</p>
                                            </div>
                                            <Badge variant="outline">{course.college?.type}</Badge>
                                        </div>
                                        {course.description && (
                                            <p className="text-sm text-gray-700 mb-2">{course.description}</p>
                                        )}
                                        {course.transferAgreements && course.transferAgreements.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {course.transferAgreements.slice(0, 3).map((agreement: any) => (
                                                    <Badge key={agreement.id} variant="secondary" className="text-xs">
                                                        {agreement.transferType ? agreement.transferType.replace('_', ' ') : 'Transfer'}
                                                    </Badge>
                                                ))}
                                                {course.transferAgreements.length > 3 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        +{course.transferAgreements.length - 3} more
                                                    </Badge>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'colleges' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.map((college) => (
                                    <div key={college.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold">{college.name}</h3>
                                                <p className="text-sm text-gray-600">{college.code}</p>
                                                {college.city && (
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {college.city}, {college.state}
                                                    </p>
                                                )}
                                            </div>
                                            <Badge variant="outline">{college.type}</Badge>
                                        </div>
                                        {college.website && (
                                            <a
                                                href={college.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                Visit Website
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'transfers' && (
                            <div className="space-y-4">
                                {results.map((agreement) => (
                                    <div key={agreement.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold">
                                                    {agreement.course?.courseCode} - {agreement.course?.courseTitle}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {agreement.sourceCollege?.name} → {agreement.targetCollege?.name || 'Multiple Universities'}
                                                </p>
                                            </div>
                                            <Badge variant="outline">
                                                {agreement.transferType ? agreement.transferType.replace('_', ' ') : 'Transfer'}
                                            </Badge>
                                        </div>
                                        {agreement.equivalentCourse && (
                                            <p className="text-sm text-gray-700 mb-1">
                                                <strong>Equivalent:</strong> {agreement.equivalentCourse}
                                            </p>
                                        )}
                                        {agreement.unitsTransferred && (
                                            <p className="text-sm text-gray-700 mb-1">
                                                <strong>Units:</strong> {agreement.unitsTransferred}
                                            </p>
                                        )}
                                        {agreement.transferNotes && (
                                            <p className="text-sm text-gray-600">{agreement.transferNotes}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}