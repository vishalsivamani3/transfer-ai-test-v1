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
import { Progress } from '@/components/ui/progress'
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
    School,
    ArrowRight,
    Award,
    Calendar,
    FileText,
    ExternalLink,
    ChevronDown,
    ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'
import {
    TRANSFER_PATHWAYS,
    MAJOR_CATEGORIES,
    getPathwaysByMajor,
    getPathwaysByCategory,
    getPathwaysBySystem,
    searchPathways,
    getPathwayStatistics,
    TransferPathway
} from '@/data/assist/transfer-pathways'

interface TransferPathwayBrowserProps {
    userId?: string
}

export default function TransferPathwayBrowser({ userId }: TransferPathwayBrowserProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [selectedSystem, setSelectedSystem] = useState<string>('all')
    const [sortBy, setSortBy] = useState<'major' | 'successRate' | 'totalStudents'>('major')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [activeTab, setActiveTab] = useState('browse')
    const [selectedPathway, setSelectedPathway] = useState<TransferPathway | null>(null)
    const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set())

    // Get filtered and sorted pathways
    const getFilteredPathways = () => {
        let pathways = TRANSFER_PATHWAYS

        // Apply search filter
        if (searchQuery.trim()) {
            pathways = searchPathways(searchQuery)
        }

        // Apply category filter
        if (selectedCategory !== 'all') {
            pathways = getPathwaysByCategory(selectedCategory as keyof typeof MAJOR_CATEGORIES)
        }

        // Apply system filter
        if (selectedSystem !== 'all') {
            pathways = getPathwaysBySystem(selectedSystem as 'UC' | 'CSU' | 'BOTH')
        }

        // Sort pathways
        pathways.sort((a, b) => {
            let aValue: any, bValue: any

            switch (sortBy) {
                case 'major':
                    aValue = a.major
                    bValue = b.major
                    break
                case 'successRate':
                    aValue = a.statistics.successRate
                    bValue = b.statistics.successRate
                    break
                case 'totalStudents':
                    aValue = a.statistics.totalStudents
                    bValue = b.statistics.totalStudents
                    break
                default:
                    aValue = a.major
                    bValue = b.major
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
            }
        })

        return pathways
    }

    const filteredPathways = getFilteredPathways()
    const statistics = getPathwayStatistics()

    // Handle pathway selection
    const handlePathwaySelect = (pathway: TransferPathway) => {
        setSelectedPathway(pathway)
        setActiveTab('details')
    }

    // Toggle step expansion
    const toggleStep = (stepNumber: number) => {
        const newExpanded = new Set(expandedSteps)
        if (newExpanded.has(stepNumber)) {
            newExpanded.delete(stepNumber)
        } else {
            newExpanded.add(stepNumber)
        }
        setExpandedSteps(newExpanded)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Transfer Pathways</h2>
                    <p className="text-muted-foreground">
                        Comprehensive transfer programs from community colleges to CSUs and UCs
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {statistics.totalPathways} pathways
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {statistics.totalStudents.toLocaleString()} students
                    </Badge>
                </div>
            </div>

            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Pathways</p>
                                <p className="text-2xl font-bold">{statistics.totalPathways}</p>
                            </div>
                            <Target className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                                <p className="text-2xl font-bold">{statistics.totalStudents.toLocaleString()}</p>
                            </div>
                            <Users className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg Success Rate</p>
                                <p className="text-2xl font-bold">{statistics.avgSuccessRate}%</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Avg GPA</p>
                                <p className="text-2xl font-bold">{statistics.avgGPA}</p>
                            </div>
                            <Award className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Search & Filter Pathways
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="search">Search Pathways</Label>
                            <Input
                                id="search"
                                placeholder="e.g., Computer Science, Nursing"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="category">Major Category</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All categories" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {Object.keys(MAJOR_CATEGORIES).map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {category}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="system">Transfer System</Label>
                            <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All systems" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Systems</SelectItem>
                                    <SelectItem value="UC">UC System</SelectItem>
                                    <SelectItem value="CSU">CSU System</SelectItem>
                                    <SelectItem value="BOTH">Both Systems</SelectItem>
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
                                    <SelectItem value="major">Major Name</SelectItem>
                                    <SelectItem value="successRate">Success Rate</SelectItem>
                                    <SelectItem value="totalStudents">Total Students</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery('')
                                setSelectedCategory('all')
                                setSelectedSystem('all')
                                setSortBy('major')
                                setSortOrder('asc')
                            }}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Clear Filters
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                            {sortOrder === 'asc' ? <TrendingUp className="h-4 w-4 mr-2" /> : <TrendingDown className="h-4 w-4 mr-2" />}
                            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="browse">Browse Pathways ({filteredPathways.length})</TabsTrigger>
                    <TabsTrigger value="details" disabled={!selectedPathway}>
                        Pathway Details
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="browse" className="space-y-4">
                    {/* Pathways Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPathways.map((pathway) => (
                            <Card
                                key={pathway.id}
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handlePathwaySelect(pathway)}
                            >
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <GraduationCap className="h-5 w-5" />
                                        {pathway.major}
                                    </CardTitle>
                                    <CardDescription className="text-sm">
                                        {pathway.majorCode} • {pathway.targetSystem} System
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Target Universities</span>
                                            <Badge variant="outline">{pathway.targetUniversities.length}</Badge>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Success Rate</span>
                                            <span className="text-sm font-medium">{pathway.statistics.successRate}%</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Total Students</span>
                                            <span className="text-sm font-medium">{pathway.statistics.totalStudents.toLocaleString()}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Avg GPA</span>
                                            <span className="text-sm font-medium">{pathway.statistics.avgGPA}</span>
                                        </div>

                                        <div className="pt-2">
                                            <Button variant="outline" size="sm" className="w-full">
                                                <ArrowRight className="h-4 w-4 mr-2" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredPathways.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No pathways found</h3>
                                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="details" className="space-y-6">
                    {selectedPathway && (
                        <>
                            {/* Pathway Header */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <GraduationCap className="h-6 w-6" />
                                        {selectedPathway.major} Transfer Pathway
                                    </CardTitle>
                                    <CardDescription>
                                        {selectedPathway.majorCode} • {selectedPathway.targetSystem} System
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">{selectedPathway.targetUniversities.length}</div>
                                            <div className="text-sm text-gray-600">Target Universities</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">{selectedPathway.statistics.successRate}%</div>
                                            <div className="text-sm text-gray-600">Success Rate</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">{selectedPathway.statistics.totalStudents.toLocaleString()}</div>
                                            <div className="text-sm text-gray-600">Total Students</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">{selectedPathway.statistics.avgGPA}</div>
                                            <div className="text-sm text-gray-600">Avg GPA</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Target Universities */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <School className="h-5 w-5" />
                                        Target Universities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {selectedPathway.targetUniversities.map((university, index) => (
                                            <div key={index} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{university.name}</h3>
                                                        <p className="text-sm text-gray-600">{university.code} • {university.type}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={university.transferGuarantee ? "default" : "secondary"}>
                                                            {university.transferGuarantee ? 'Guaranteed Transfer' : 'Competitive'}
                                                        </Badge>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <h4 className="font-medium text-sm mb-2">Requirements</h4>
                                                        <div className="space-y-1 text-sm">
                                                            <div className="flex justify-between">
                                                                <span>Min GPA:</span>
                                                                <span className="font-medium">{university.requirements.minGPA}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Min Units:</span>
                                                                <span className="font-medium">{university.requirements.minUnits}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Priority Deadline:</span>
                                                                <span className="font-medium">{university.requirements.priorityDeadline}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-medium text-sm mb-2">Required Courses</h4>
                                                        <div className="space-y-1">
                                                            {university.requirements.requiredCourses.slice(0, 3).map((course, courseIndex) => (
                                                                <div key={courseIndex} className="text-sm text-gray-600">
                                                                    {course}
                                                                </div>
                                                            ))}
                                                            {university.requirements.requiredCourses.length > 3 && (
                                                                <div className="text-sm text-gray-500">
                                                                    +{university.requirements.requiredCourses.length - 3} more courses
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pathway Steps */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Pathway Steps
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {selectedPathway.pathwaySteps.map((step) => (
                                            <div key={step.step} className="border rounded-lg p-4">
                                                <div
                                                    className="flex items-center justify-between cursor-pointer"
                                                    onClick={() => toggleStep(step.step)}
                                                >
                                                    <div>
                                                        <h3 className="font-semibold">Step {step.step}: {step.title}</h3>
                                                        <p className="text-sm text-gray-600">{step.description}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{step.timeline}</p>
                                                    </div>
                                                    {expandedSteps.has(step.step) ? (
                                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                                    ) : (
                                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </div>

                                                {expandedSteps.has(step.step) && (
                                                    <div className="mt-4 pt-4 border-t">
                                                        <h4 className="font-medium text-sm mb-2">Courses</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                            {step.courses.map((course, courseIndex) => (
                                                                <div key={courseIndex} className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                                                                    {course}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Resources */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Resources
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Counselors</h4>
                                            <div className="space-y-1">
                                                {selectedPathway.resources.counselors.map((counselor, index) => (
                                                    <div key={index} className="text-sm text-gray-600">
                                                        {counselor}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Websites</h4>
                                            <div className="space-y-1">
                                                {selectedPathway.resources.websites.map((website, index) => (
                                                    <div key={index} className="text-sm">
                                                        <a
                                                            href={website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                        >
                                                            {website}
                                                            <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-sm mb-2">Documents</h4>
                                            <div className="space-y-1">
                                                {selectedPathway.resources.documents.map((document, index) => (
                                                    <div key={index} className="text-sm text-gray-600">
                                                        {document}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}