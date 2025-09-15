'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Target, Users, TrendingUp, School } from 'lucide-react'
import { WorkingPathwaysTable } from './WorkingPathwaysTable'

interface TransferPathwayBrowserProps {
    userId?: string
}

export default function TransferPathwayBrowser({ userId }: TransferPathwayBrowserProps) {
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
                        728+ pathways
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Real-time data
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
                                <p className="text-2xl font-bold">728</p>
                            </div>
                            <Target className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Universities</p>
                                <p className="text-2xl font-bold">50+</p>
                            </div>
                            <School className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Majors</p>
                                <p className="text-2xl font-bold">20+</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Data Source</p>
                                <p className="text-2xl font-bold">ASSIST</p>
                            </div>
                            <Users className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pathways Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Browse Transfer Pathways</CardTitle>
                    <CardDescription>
                        Explore transfer opportunities from community colleges to California State Universities and University of California campuses
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <WorkingPathwaysTable userId={userId} limit={100} />
                </CardContent>
            </Card>
        </div>
    )
}