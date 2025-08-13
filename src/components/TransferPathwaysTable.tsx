'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, MapPin, GraduationCap, Clock, Star, Calendar } from 'lucide-react'
import { TransferPathwayFilters } from '@/lib/queries'
import { TransferPathway } from '@/types'
import { fetchTransferPathways, getUniqueStates, getUniqueMajors } from '@/lib/queries'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'

interface TransferPathwaysTableProps {
  userId?: string
  initialFilters?: TransferPathwayFilters
}

export function TransferPathwaysTable({ userId, initialFilters = {} }: TransferPathwaysTableProps) {
  const [pathways, setPathways] = useState<TransferPathway[]>([])
  const [filteredPathways, setFilteredPathways] = useState<TransferPathway[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<TransferPathwayFilters>(initialFilters)
  const [states, setStates] = useState<string[]>([])
  const [majors, setMajors] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

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
    if (filters.state) {
      filtered = filtered.filter(pathway => pathway.state === filters.state)
    }
    if (filters.major) {
      filtered = filtered.filter(pathway => 
        pathway.major.toLowerCase().includes(filters.major!.toLowerCase())
      )
    }
    if (filters.guaranteedTransfer !== undefined) {
      filtered = filtered.filter(pathway => pathway.guaranteedTransfer === filters.guaranteedTransfer)
    }
    if (filters.minGPA) {
      filtered = filtered.filter(pathway => 
        pathway.minGPA && pathway.minGPA >= filters.minGPA!
      )
    }
    if (filters.timeline) {
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
                      <SelectItem value="">All states</SelectItem>
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
                      <SelectItem value="">All majors</SelectItem>
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
                      <SelectItem value="">All types</SelectItem>
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
                      <SelectItem value="">All timelines</SelectItem>
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

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPathways.length} of {pathways.length} pathways
        </p>
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

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>University</TableHead>
                <TableHead>Major</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Transfer Type</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Requirements</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPathways.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {loading ? 'Loading...' : 'No transfer pathways found'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPathways.map((pathway) => (
                  <TableRow key={pathway.id}>
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
                      <div className="space-y-1">
                        {pathway.minGPA && (
                          <div className="text-sm">
                            Min GPA: {pathway.minGPA}
                          </div>
                        )}
                        {pathway.applicationDeadline && (
                          <div className="text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {formatDate(pathway.applicationDeadline)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 