'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, MapPin, GraduationCap, Clock, Star, Calendar, Plus, CheckCircle, XCircle, BookOpen, Target, Users, Award } from 'lucide-react'
import { TransferPathwayFilters } from '@/lib/queries'
import { TransferPathway, RequiredCourse, RecommendedCourse, IGETCRequirement, TAGEligibility } from '@/types'
import { fetchTransferPathways, getUniqueStates, getUniqueMajors } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface TransferPathwaysTableProps {
  userId?: string
  initialFilters?: TransferPathwayFilters
}

export function TransferPathwaysTable({ userId, initialFilters = {} }: TransferPathwaysTableProps) {
  const [pathways, setPathways] = useState<TransferPathway[]>([])
  const [filteredPathways, setFilteredPathways] = useState<TransferPathway[]>([])
  const [selectedPathways, setSelectedPathways] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<TransferPathwayFilters>(initialFilters)
  const [states, setStates] = useState<string[]>([])
  const [majors, setMajors] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedPathwayDetails, setSelectedPathwayDetails] = useState<TransferPathway | null>(null)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [userId])

  // Load filter options
  useEffect(() => {
    loadFilterOptions()
  }, [])

  // Apply filters and search
  useEffect(() => {
    applyFiltersAndSearch()
  }, [pathways, searchTerm, filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await fetchTransferPathways(filters)
      setPathways(data)
    } catch (error) {
      console.error('Error loading transfer pathways:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFilterOptions = async () => {
    try {
      const [statesData, majorsData] = await Promise.all([
        getUniqueStates(),
        getUniqueMajors()
      ])
      setStates(statesData)
      setMajors(majorsData)
    } catch (error) {
      console.error('Error loading filter options:', error)
    }
  }

  const applyFiltersAndSearch = () => {
    let filtered = [...pathways]

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(pathway =>
        pathway.targetUniversity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pathway.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pathway.state.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply filters
    if (filters.state && filters.state !== 'all') {
      filtered = filtered.filter(pathway => pathway.state === filters.state)
    }
    if (filters.major && filters.major !== 'all') {
      filtered = filtered.filter(pathway =>
        pathway.major.toLowerCase().includes(filters.major!.toLowerCase())
      )
    }
    if (filters.guaranteedTransfer !== undefined && filters.guaranteedTransfer !== 'all' && typeof filters.guaranteedTransfer === 'boolean') {
      const guaranteedTransfer = filters.guaranteedTransfer as boolean
      filtered = filtered.filter(pathway => pathway.guaranteedTransfer === guaranteedTransfer)
    }
    if (filters.minGPA) {
      filtered = filtered.filter(pathway =>
        pathway.minGPA && pathway.minGPA >= filters.minGPA!
      )
    }
    if (filters.timeline && filters.timeline !== 'all') {
      filtered = filtered.filter(pathway => pathway.timeline === filters.timeline)
    }

    setFilteredPathways(filtered)
  }

  const handleFilterChange = (key: keyof TransferPathwayFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm('')
  }

  const handlePathwaySelect = (pathwayId: string) => {
    const newSelected = new Set(selectedPathways)
    if (newSelected.has(pathwayId)) {
      newSelected.delete(pathwayId)
    } else {
      newSelected.add(pathwayId)
    }
    setSelectedPathways(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedPathways.size === filteredPathways.length) {
      setSelectedPathways(new Set())
    } else {
      setSelectedPathways(new Set(filteredPathways.map(p => p.id)))
    }
  }

  const handleViewDetails = (pathway: TransferPathway) => {
    setSelectedPathwayDetails(pathway)
  }

  const handleAddToApplications = () => {
    const selectedCount = selectedPathways.size
    if (selectedCount === 0) {
      toast.error('Please select at least one pathway to add to applications')
      return
    }

    // Here you would typically save to user's applications
    toast.success(`Added ${selectedCount} pathway${selectedCount > 1 ? 's' : ''} to your applications`)
    setSelectedPathways(new Set())
  }

  const handleCloneToPlanner = (pathway: TransferPathway) => {
    // Here you would typically clone the pathway to the semester planner
    toast.success(`Cloned ${pathway.targetUniversity} ${pathway.major} pathway to your planner`)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const getProgressColor = (met: number, total: number) => {
    const percentage = (met / total) * 100
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading transfer pathways...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Transfer Pathways</h2>
          <p className="text-muted-foreground">
            Explore transfer opportunities and track your progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search universities, majors, or states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block">State</label>
                  <Select
                    value={filters.state || ''}
                    onValueChange={(value) => handleFilterChange('state', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All states" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All states</SelectItem>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Major</label>
                  <Select
                    value={filters.major || ''}
                    onValueChange={(value) => handleFilterChange('major', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All majors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All majors</SelectItem>
                      {majors.map((major) => (
                        <SelectItem key={major} value={major}>
                          {major}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Transfer Type</label>
                  <Select
                    value={filters.guaranteedTransfer?.toString() || ''}
                    onValueChange={(value) => handleFilterChange('guaranteedTransfer', value === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="true">Guaranteed</SelectItem>
                      <SelectItem value="false">Standard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Timeline</label>
                  <Select
                    value={filters.timeline || ''}
                    onValueChange={(value) => handleFilterChange('timeline', value || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All timelines" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All timelines</SelectItem>
                      <SelectItem value="1-year">1 Year</SelectItem>
                      <SelectItem value="2-year">2 Years</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPathways.length} of {pathways.length} pathways
          </p>
          {selectedPathways.size > 0 && (
            <Badge variant="default" className="bg-blue-600">
              {selectedPathways.size} selected
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedPathways.size > 0 && (
            <Button
              size="sm"
              onClick={handleAddToApplications}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add to Applications
            </Button>
          )}
          {Object.keys(filters).length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {filters.state && <Badge variant="secondary">{filters.state}</Badge>}
              {filters.major && <Badge variant="secondary">{filters.major}</Badge>}
              {filters.guaranteedTransfer !== undefined && (
                <Badge variant="secondary">
                  {filters.guaranteedTransfer ? 'Guaranteed' : 'Standard'}
                </Badge>
              )}
              {filters.timeline && <Badge variant="secondary">{filters.timeline}</Badge>}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPathways.size === filteredPathways.length && filteredPathways.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>University</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Transfer Type</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPathways.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {loading ? 'Loading...' : 'No transfer pathways found'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPathways.map((pathway) => (
                  <TableRow key={pathway.id} className={selectedPathways.has(pathway.id) ? 'bg-blue-50' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={selectedPathways.has(pathway.id)}
                        onCheckedChange={() => handlePathwaySelect(pathway.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pathway.targetUniversity}</div>
                        {pathway.acceptanceRate && (
                          <div className="text-sm text-muted-foreground">
                            {pathway.acceptanceRate}% acceptance rate
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        {pathway.major}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {pathway.state}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={pathway.guaranteedTransfer ? "default" : "secondary"}>
                        {pathway.guaranteedTransfer ? (
                          <>
                            <Star className="h-3 w-3 mr-1" />
                            Guaranteed
                          </>
                        ) : (
                          'Standard'
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-20">
                        <Progress
                          value={(pathway.requirementsMet / pathway.totalRequirements) * 100}
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          {pathway.requirementsMet}/{pathway.totalRequirements}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {pathway.estimatedTransferCredits} credits
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {pathway.timeline}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(pathway)}
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCloneToPlanner(pathway)}
                        >
                          <Target className="h-4 w-4 mr-1" />
                          Clone
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pathway Details Modal */}
      {selectedPathwayDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">
                  {selectedPathwayDetails.targetUniversity} - {selectedPathwayDetails.major}
                </h3>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPathwayDetails(null)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="igetc">IGETC</TabsTrigger>
                  <TabsTrigger value="tag">TAG</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Basic Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">University:</span>
                          <span className="font-medium">{selectedPathwayDetails.targetUniversity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Major:</span>
                          <span className="font-medium">{selectedPathwayDetails.major}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">State:</span>
                          <span className="font-medium">{selectedPathwayDetails.state}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transfer Type:</span>
                          <Badge variant={selectedPathwayDetails.guaranteedTransfer ? "default" : "secondary"}>
                            {selectedPathwayDetails.guaranteedTransfer ? "Guaranteed" : "Standard"}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Timeline:</span>
                          <span className="font-medium">{selectedPathwayDetails.timeline}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estimated Credits:</span>
                          <span className="font-medium">{selectedPathwayDetails.estimatedTransferCredits}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Admissions Info</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selectedPathwayDetails.acceptanceRate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Acceptance Rate:</span>
                            <span className="font-medium">{selectedPathwayDetails.acceptanceRate}%</span>
                          </div>
                        )}
                        {selectedPathwayDetails.minGPA && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Min GPA:</span>
                            <span className="font-medium">{selectedPathwayDetails.minGPA}</span>
                          </div>
                        )}
                        {selectedPathwayDetails.applicationDeadline && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Application Deadline:</span>
                            <span className="font-medium">{formatDate(selectedPathwayDetails.applicationDeadline)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Progress:</span>
                          <span className="font-medium">
                            {selectedPathwayDetails.requirementsMet}/{selectedPathwayDetails.totalRequirements}
                          </span>
                        </div>
                        <Progress
                          value={(selectedPathwayDetails.requirementsMet / selectedPathwayDetails.totalRequirements) * 100}
                          className="h-2"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="requirements" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Required Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPathwayDetails.requiredCourses.map((course, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{course.courseCode} - {course.courseName}</div>
                              <div className="text-sm text-muted-foreground">
                                {course.units} units • Transferable from: {course.transferableFrom.join(', ')}
                              </div>
                            </div>
                            <Badge variant="destructive">Required</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recommended Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPathwayDetails.recommendedCourses.map((course, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{course.courseCode} - {course.courseName}</div>
                              <div className="text-sm text-muted-foreground">
                                {course.units} units • Transferable from: {course.transferableFrom.join(', ')}
                              </div>
                            </div>
                            <Badge variant="secondary">Recommended</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="igetc" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">IGETC Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedPathwayDetails.igetcRequirements.map((req, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="font-medium">{req.area}</div>
                            <div className="text-sm text-muted-foreground">
                              {req.units} units • Courses: {req.courses.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tag" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">TAG Eligibility</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          {selectedPathwayDetails.tagEligibility.isEligible ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="font-medium">
                            {selectedPathwayDetails.tagEligibility.isEligible ? 'TAG Eligible' : 'Not TAG Eligible'}
                          </span>
                        </div>

                        {selectedPathwayDetails.tagEligibility.reason && (
                          <p className="text-muted-foreground">{selectedPathwayDetails.tagEligibility.reason}</p>
                        )}

                        {selectedPathwayDetails.tagEligibility.requirements && (
                          <div>
                            <h4 className="font-medium mb-2">TAG Requirements:</h4>
                            <ul className="list-disc list-inside space-y-1">
                              {selectedPathwayDetails.tagEligibility.requirements.map((req, index) => (
                                <li key={index} className="text-sm text-muted-foreground">{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPathwayDetails(null)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleCloneToPlanner(selectedPathwayDetails)
                    setSelectedPathwayDetails(null)
                  }}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Clone to Planner
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 