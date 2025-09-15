'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import {
    GraduationCap,
    Target,
    TrendingUp,
    Clock,
    Users,
    Eye
} from 'lucide-react'
import PathwayDetailsModal from './PathwayDetailsModal'

interface TransferPathway {
    id: string
    major: string
    targetUniversity: string
    targetUniversityCode: string
    majorCode: string
    state: string
    guaranteedTransfer: boolean
    requirementsMet: number
    totalRequirements: number
    estimatedTransferCredits: number
    timeline: string
    acceptanceRate: number
    minGPA: number
    applicationDeadline: string
    requiredCourses: string[]
    recommendedCourses: string[]
    igetcRequirements: string[]
    tagEligibility: { isEligible: boolean }
    specialRequirements: string[]
}

interface WorkingPathwaysTableProps {
    userId?: string
    limit?: number
}

export function WorkingPathwaysTable({ userId, limit = 50 }: WorkingPathwaysTableProps) {
    const [pathways, setPathways] = useState<TransferPathway[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchPathways() {
            try {
                setLoading(true)
                setError(null)

                console.log('WorkingPathwaysTable: Fetching pathways...')

                // Use a simplified fetch approach with proper error handling
                const response = await fetch(`/api/pathways?limit=${limit}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch pathways: ${response.status}`)
                }

                const result = await response.json()
                console.log('WorkingPathwaysTable: Response:', result)

                if (result.success && result.data) {
                    setPathways(result.data)
                    console.log('WorkingPathwaysTable: Successfully loaded', result.data.length, 'pathways')
                } else {
                    throw new Error(result.error || 'No pathway data received')
                }

            } catch (error) {
                console.error('WorkingPathwaysTable: Error:', error)
                setError(error instanceof Error ? error.message : 'Failed to load pathways')
            } finally {
                setLoading(false)
            }
        }

        // Use a small delay to ensure the component is mounted
        const timeoutId = setTimeout(fetchPathways, 100)
        return () => clearTimeout(timeoutId)
    }, [limit])

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

    if (error) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <p className="text-red-600 font-medium mb-2">Failed to load transfer pathways</p>
                        <p className="text-muted-foreground text-sm mb-4">{error}</p>
                        <Button onClick={() => window.location.reload()} variant="outline">
                            Retry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Transfer Pathways ({pathways.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                {pathways.length === 0 ? (
                    <p className="text-muted-foreground">No pathways found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>University</TableHead>
                                    <TableHead>Major</TableHead>
                                    <TableHead>Min GPA</TableHead>
                                    <TableHead>Acceptance Rate</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pathways.map((pathway) => (
                                    <TableRow key={pathway.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div className="font-medium">{pathway.targetUniversity}</div>
                                            <div className="text-sm text-muted-foreground">{pathway.targetUniversityCode}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{pathway.major}</div>
                                            <div className="text-sm text-muted-foreground">{pathway.majorCode}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Target className="h-4 w-4 text-blue-600" />
                                                <span className="font-mono font-medium">{pathway.minGPA?.toFixed(1) || 'N/A'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="h-4 w-4 text-green-600" />
                                                <span>{pathway.acceptanceRate?.toFixed(1) || 'N/A'}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={pathway.guaranteedTransfer ? "default" : "secondary"}>
                                                {pathway.guaranteedTransfer ? "Guaranteed" : "Competitive"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <PathwayDetailsModal pathway={pathway}>
                                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    View Details
                                                </Button>
                                            </PathwayDetailsModal>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}