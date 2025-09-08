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
    School,
    ArrowRight,
    Award,
    Calendar
} from 'lucide-react'
import { toast } from 'sonner'
import { useTransferData, TransferAgreement, AssistCourse } from '@/contexts/TransferDataContext'

interface IntegratedTransferPathwaysProps {
    userId?: string
}

export default function IntegratedTransferPathways({ userId }: IntegratedTransferPathwaysProps) {
    const { state, actions } = useTransferData()
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState('agreements')
    const [selectedAgreements, setSelectedAgreements] = useState<TransferAgreement[]>([])

    // Load transfer agreements on mount
    useEffect(() => {
        actions.loadTransferAgreements()
    }, [])

    // Handle search
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            actions.loadTransferAgreements()
            return
        }

        await actions.searchTransferAgreements(searchQuery, {
            transferType: state.filters.transferType !== 'any' ? state.filters.transferType : undefined
        })
    }

    // Handle agreement selection
    const handleAgreementSelect = (agreement: TransferAgreement) => {
        const isSelected = selectedAgreements.some(a => a.id === agreement.id)
        if (isSelected) {
            setSelectedAgreements(selectedAgreements.filter(a => a.id !== agreement.id))
            toast.success('Removed from selection')
        } else {
            setSelectedAgreements([...selectedAgreements, agreement])
            toast.success('Added to selection')
        }
    }

    // Get filtered agreements
    const getFilteredAgreements = () => {
        let agreements = state.searchResults.transferAgreements.length > 0
            ? state.searchResults.transferAgreements
            : state.transferAgreements

        // Apply additional client-side filters
        if (state.filters.transferType && state.filters.transferType !== 'any') {
            agreements = agreements.filter(agreement => agreement.transferType === state.filters.transferType)
        }

        return agreements
    }

    const filteredAgreements = getFilteredAgreements()

    // Generate transfer pathways from selected courses and agreements
    const generateTransferPathways = () => {
        if (state.selectedCourses.length === 0) return []

        const pathways: any[] = []

        // Group agreements by target college
        const agreementsByTarget = selectedAgreements.reduce((acc, agreement) => {
            if (agreement.targetCollege) {
                const key = agreement.targetCollege.name
                if (!acc[key]) acc[key] = []
                acc[key].push(agreement)
            }
            return acc
        }, {} as Record<string, TransferAgreement[]>)

        // Create pathways for each target college
        Object.entries(agreementsByTarget).forEach(([targetCollege, agreements]) => {
            const pathway = {
                id: `pathway-${targetCollege}`,
                targetCollege,
                sourceColleges: Array.from(new Set(agreements.map(a => a.sourceCollege?.name).filter(Boolean))),
                courses: agreements.map(a => a.course),
                totalAgreements: agreements.length,
                transferableCredits: agreements.reduce((sum, a) => sum + (a.unitsTransferred || 0), 0),
                transferTypes: Array.from(new Set(agreements.map(a => a.transferType))),
                guaranteedTransfer: agreements.every(a => a.isActive)
            }
            pathways.push(pathway)
        })

        return pathways
    }

    const transferPathways = generateTransferPathways()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Transfer Pathways</h2>
                    <p className="text-muted-foreground">
                        Explore transfer agreements and pathways between California colleges
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {filteredAgreements.length} agreements
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {selectedAgreements.length} selected
                    </Badge>
                </div>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Search Transfer Agreements
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="search">Search Agreements</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="search"
                                    placeholder="e.g., Calculus, UC Berkeley, IGETC"
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
                            <Label htmlFor="transfer-type">Transfer Type</Label>
                            <Select value={state.filters.transferType} onValueChange={(value) => actions.setFilter('transferType', value)}>
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

                        <div className="flex items-end">
                            <Button variant="outline" onClick={() => actions.clearFilters()}>
                                <Filter className="h-4 w-4 mr-2" />
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="agreements">Transfer Agreements</TabsTrigger>
                    <TabsTrigger value="pathways">Transfer Pathways</TabsTrigger>
                    <TabsTrigger value="selected">Selected ({selectedAgreements.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="agreements" className="space-y-4">
                    {/* Loading State */}
                    {state.loading.transferAgreements && (
                        <Card>
                            <CardContent className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading transfer agreements...</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Error State */}
                    {state.errors.transferAgreements && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{state.errors.transferAgreements}</AlertDescription>
                        </Alert>
                    )}

                    {/* Agreements Table */}
                    {!state.loading.transferAgreements && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Transfer Agreements</CardTitle>
                                <CardDescription>
                                    Click the + button to add agreements to your pathway analysis
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Source College</TableHead>
                                            <TableHead>Target College</TableHead>
                                            <TableHead>Transfer Type</TableHead>
                                            <TableHead>Equivalent</TableHead>
                                            <TableHead>Units</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAgreements.map((agreement) => {
                                            const isSelected = selectedAgreements.some(a => a.id === agreement.id)
                                            return (
                                                <TableRow key={agreement.id}>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{agreement.course?.courseCode}</div>
                                                            <div className="text-sm text-gray-600">{agreement.course?.courseTitle}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className="text-xs">
                                                                {agreement.sourceCollege?.type}
                                                            </Badge>
                                                            <span className="text-sm">{agreement.sourceCollege?.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {agreement.targetCollege ? (
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {agreement.targetCollege.type}
                                                                </Badge>
                                                                <span className="text-sm">{agreement.targetCollege.name}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-500">Multiple Universities</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {agreement.transferType ? agreement.transferType.replace('_', ' ') : 'Transfer'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {agreement.equivalentCourse || 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {agreement.unitsTransferred || 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={agreement.isActive ? "default" : "secondary"} className="text-xs">
                                                            {agreement.isActive ? 'Active' : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            size="sm"
                                                            variant={isSelected ? "destructive" : "default"}
                                                            onClick={() => handleAgreementSelect(agreement)}
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

                <TabsContent value="pathways" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Transfer Pathways
                            </CardTitle>
                            <CardDescription>
                                Pathways generated from your selected courses and transfer agreements
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {transferPathways.length === 0 ? (
                                <div className="text-center py-8">
                                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No transfer pathways found</p>
                                    <p className="text-sm text-gray-500">Select courses and transfer agreements to generate pathways</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {transferPathways.map((pathway) => (
                                        <div key={pathway.id} className="border rounded-lg p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold">{pathway.targetCollege}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        From {pathway.sourceColleges.join(', ')}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant={pathway.guaranteedTransfer ? "default" : "secondary"}>
                                                        {pathway.guaranteedTransfer ? 'Guaranteed Transfer' : 'Competitive'}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600">{pathway.totalAgreements}</div>
                                                    <div className="text-sm text-gray-600">Transfer Agreements</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600">{pathway.transferableCredits}</div>
                                                    <div className="text-sm text-gray-600">Transferable Credits</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-purple-600">{pathway.courses.length}</div>
                                                    <div className="text-sm text-gray-600">Courses</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-orange-600">{pathway.transferTypes.length}</div>
                                                    <div className="text-sm text-gray-600">Transfer Types</div>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="font-medium">Transfer Types:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {pathway.transferTypes.map((type) => (
                                                        <Badge key={type} variant="outline">
                                                            {type.replace('_', ' ')}
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <h4 className="font-medium">Courses:</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {pathway.courses.map((course) => (
                                                        <div key={course?.id} className="bg-gray-50 rounded-lg p-3">
                                                            <div className="font-medium text-sm">{course?.courseCode}</div>
                                                            <div className="text-xs text-gray-600">{course?.courseTitle}</div>
                                                            <div className="text-xs text-gray-500">{course?.college.name}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="selected" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Selected Transfer Agreements ({selectedAgreements.length})
                            </CardTitle>
                            <CardDescription>
                                These agreements are used to generate your transfer pathways
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {selectedAgreements.length === 0 ? (
                                <div className="text-center py-8">
                                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">No transfer agreements selected</p>
                                    <p className="text-sm text-gray-500">Browse agreements and click the + button to add them</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedAgreements.map((agreement) => (
                                        <div key={agreement.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">
                                                        {agreement.course?.courseCode} - {agreement.course?.courseTitle}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {agreement.sourceCollege?.name} → {agreement.targetCollege?.name || 'Multiple Universities'}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {agreement.transferType ? agreement.transferType.replace('_', ' ') : 'Transfer'}
                                                        </Badge>
                                                        {agreement.equivalentCourse && (
                                                            <span className="text-sm text-gray-700">
                                                                Equivalent: {agreement.equivalentCourse}
                                                            </span>
                                                        )}
                                                        {agreement.unitsTransferred && (
                                                            <span className="text-sm text-gray-700">
                                                                {agreement.unitsTransferred} units
                                                            </span>
                                                        )}
                                                    </div>
                                                    {agreement.transferNotes && (
                                                        <p className="text-sm text-gray-600 mt-2">{agreement.transferNotes}</p>
                                                    )}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAgreementSelect(agreement)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                            </div>
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