'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Plus,
    Edit,
    Trash2,
    Calendar,
    CheckCircle,
    Clock,
    AlertCircle,
    FileText,
    GraduationCap,
    Target,
    TrendingUp,
    Users,
    BookOpen,
    Mail,
    Phone,
    MapPin,
    ExternalLink
} from 'lucide-react'
import { TransferApplication, ApplicationProgress, UniversityInfo } from '@/types/transfer-applications'
import { toast } from 'sonner'

interface TransferApplicationTrackerProps {
    userId: string
}

export default function TransferApplicationTracker({ userId }: TransferApplicationTrackerProps) {
    const [applications, setApplications] = useState<TransferApplication[]>([])
    const [progress, setProgress] = useState<ApplicationProgress>({
        totalApplications: 0,
        completedApplications: 0,
        inProgressApplications: 0,
        upcomingDeadlines: 0,
        completionRate: 0
    })
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editingApplication, setEditingApplication] = useState<TransferApplication | null>(null)
    const [newApplication, setNewApplication] = useState<Partial<TransferApplication>>({
        universityName: '',
        universityType: 'UC',
        major: '',
        applicationDeadline: '',
        status: 'Not Started',
        priority: 'Medium',
        notes: '',
        requirements: [],
        documents: []
    })

    // Sample university data
    const universities: UniversityInfo[] = [
        {
            id: '1',
            name: 'UC Berkeley',
            type: 'UC',
            location: 'Berkeley, CA',
            acceptanceRate: 17.5,
            averageGPA: 3.89,
            popularMajors: ['Computer Science', 'Business Administration', 'Psychology'],
            applicationDeadline: '2024-11-30',
            transferRequirements: ['60 transferable units', '2.4 minimum GPA', 'IGETC completion']
        },
        {
            id: '2',
            name: 'UC Los Angeles',
            type: 'UC',
            location: 'Los Angeles, CA',
            acceptanceRate: 14.3,
            averageGPA: 3.93,
            popularMajors: ['Computer Science', 'Economics', 'Biology'],
            applicationDeadline: '2024-11-30',
            transferRequirements: ['60 transferable units', '2.4 minimum GPA', 'IGETC completion']
        },
        {
            id: '3',
            name: 'UC San Diego',
            type: 'UC',
            location: 'San Diego, CA',
            acceptanceRate: 23.7,
            averageGPA: 3.85,
            popularMajors: ['Computer Science', 'Engineering', 'Biology'],
            applicationDeadline: '2024-11-30',
            transferRequirements: ['60 transferable units', '2.4 minimum GPA', 'IGETC completion']
        },
        {
            id: '4',
            name: 'CSU Long Beach',
            type: 'CSU',
            location: 'Long Beach, CA',
            acceptanceRate: 42.1,
            averageGPA: 3.2,
            popularMajors: ['Business Administration', 'Psychology', 'Computer Science'],
            applicationDeadline: '2024-11-30',
            transferRequirements: ['60 transferable units', '2.0 minimum GPA']
        },
        {
            id: '5',
            name: 'CSU Fullerton',
            type: 'CSU',
            location: 'Fullerton, CA',
            acceptanceRate: 53.7,
            averageGPA: 3.1,
            popularMajors: ['Business Administration', 'Psychology', 'Communications'],
            applicationDeadline: '2024-11-30',
            transferRequirements: ['60 transferable units', '2.0 minimum GPA']
        }
    ]

    useEffect(() => {
        loadApplications()
    }, [userId])

    useEffect(() => {
        calculateProgress()
    }, [applications])

    const loadApplications = () => {
        // In a real app, this would fetch from an API
        const mockApplications: TransferApplication[] = [
            {
                id: '1',
                userId,
                universityName: 'UC Berkeley',
                universityType: 'UC',
                major: 'Computer Science',
                applicationDeadline: '2024-11-30',
                status: 'In Progress',
                priority: 'High',
                notes: 'Dream school - need to focus on GPA',
                requirements: [
                    { id: '1', name: 'Complete IGETC', description: 'Finish all IGETC requirements', completed: false, dueDate: '2024-11-30' },
                    { id: '2', name: 'Complete Major Prep', description: 'Finish CS major preparation courses', completed: false, dueDate: '2024-11-30' },
                    { id: '3', name: 'Maintain GPA', description: 'Keep GPA above 3.7', completed: true }
                ],
                documents: [
                    { id: '1', name: 'Official Transcripts', type: 'Transcript', status: 'Not Started', dueDate: '2024-11-30' },
                    { id: '2', name: 'Personal Statement', type: 'Personal Statement', status: 'In Progress', dueDate: '2024-11-30' },
                    { id: '3', name: 'Letters of Recommendation', type: 'Letters of Recommendation', status: 'Not Started', dueDate: '2024-11-30' }
                ],
                createdAt: '2024-01-15',
                updatedAt: '2024-01-15'
            },
            {
                id: '2',
                userId,
                universityName: 'UC San Diego',
                universityType: 'UC',
                major: 'Computer Science',
                applicationDeadline: '2024-11-30',
                status: 'Not Started',
                priority: 'Medium',
                notes: 'Backup option',
                requirements: [
                    { id: '1', name: 'Complete IGETC', description: 'Finish all IGETC requirements', completed: false, dueDate: '2024-11-30' },
                    { id: '2', name: 'Complete Major Prep', description: 'Finish CS major preparation courses', completed: false, dueDate: '2024-11-30' }
                ],
                documents: [
                    { id: '1', name: 'Official Transcripts', type: 'Transcript', status: 'Not Started', dueDate: '2024-11-30' },
                    { id: '2', name: 'Personal Statement', type: 'Personal Statement', status: 'Not Started', dueDate: '2024-11-30' }
                ],
                createdAt: '2024-01-15',
                updatedAt: '2024-01-15'
            }
        ]
        setApplications(mockApplications)
    }

    const calculateProgress = () => {
        const total = applications.length
        const completed = applications.filter(app => app.status === 'Submitted' || app.status === 'Accepted').length
        const inProgress = applications.filter(app => app.status === 'In Progress').length
        const upcomingDeadlines = applications.filter(app => {
            const deadline = new Date(app.applicationDeadline)
            const now = new Date()
            const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            return daysUntilDeadline <= 30 && daysUntilDeadline > 0
        }).length

        setProgress({
            totalApplications: total,
            completedApplications: completed,
            inProgressApplications: inProgress,
            upcomingDeadlines,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        })
    }

    const handleAddApplication = () => {
        if (!newApplication.universityName || !newApplication.major || !newApplication.applicationDeadline) {
            toast.error('Please fill in all required fields')
            return
        }

        const application: TransferApplication = {
            id: Date.now().toString(),
            userId,
            universityName: newApplication.universityName!,
            universityType: newApplication.universityType!,
            major: newApplication.major!,
            applicationDeadline: newApplication.applicationDeadline!,
            status: newApplication.status!,
            priority: newApplication.priority!,
            notes: newApplication.notes || '',
            requirements: getDefaultRequirements(newApplication.universityType!),
            documents: getDefaultDocuments(newApplication.universityType!),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        setApplications([...applications, application])
        setNewApplication({
            universityName: '',
            universityType: 'UC',
            major: '',
            applicationDeadline: '',
            status: 'Not Started',
            priority: 'Medium',
            notes: '',
            requirements: [],
            documents: []
        })
        setIsAddDialogOpen(false)
        toast.success('Application added successfully!')
    }

    const getDefaultRequirements = (universityType: string) => {
        const baseRequirements = [
            { id: '1', name: 'Complete Transferable Units', description: 'Complete 60 transferable semester units', completed: false, dueDate: '' },
            { id: '2', name: 'Maintain GPA', description: 'Meet minimum GPA requirements', completed: false, dueDate: '' }
        ]

        if (universityType === 'UC') {
            baseRequirements.push(
                { id: '3', name: 'Complete IGETC', description: 'Finish IGETC requirements', completed: false, dueDate: '' },
                { id: '4', name: 'Complete Major Prep', description: 'Finish major preparation courses', completed: false, dueDate: '' }
            )
        }

        return baseRequirements
    }

    const getDefaultDocuments = (universityType: string) => {
        return [
            { id: '1', name: 'Official Transcripts', type: 'Transcript' as const, status: 'Not Started' as const, dueDate: '' },
            { id: '2', name: 'Personal Statement', type: 'Personal Statement' as const, status: 'Not Started' as const, dueDate: '' },
            { id: '3', name: 'Letters of Recommendation', type: 'Letters of Recommendation' as const, status: 'Not Started' as const, dueDate: '' }
        ]
    }

    const handleUpdateApplication = (id: string, updates: Partial<TransferApplication>) => {
        setApplications(applications.map(app =>
            app.id === id
                ? { ...app, ...updates, updatedAt: new Date().toISOString() }
                : app
        ))
        setEditingApplication(null)
        toast.success('Application updated successfully!')
    }

    const handleDeleteApplication = (id: string) => {
        setApplications(applications.filter(app => app.id !== id))
        toast.success('Application deleted successfully!')
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Not Started': return 'bg-gray-100 text-gray-800'
            case 'In Progress': return 'bg-blue-100 text-blue-800'
            case 'Submitted': return 'bg-yellow-100 text-yellow-800'
            case 'Under Review': return 'bg-purple-100 text-purple-800'
            case 'Accepted': return 'bg-green-100 text-green-800'
            case 'Rejected': return 'bg-red-100 text-red-800'
            case 'Waitlisted': return 'bg-orange-100 text-orange-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800'
            case 'Medium': return 'bg-yellow-100 text-yellow-800'
            case 'Low': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getDaysUntilDeadline = (deadline: string) => {
        const deadlineDate = new Date(deadline)
        const now = new Date()
        const daysUntil = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return daysUntil
    }

    return (
        <div className="space-y-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                                <p className="text-2xl font-bold">{progress.totalApplications}</p>
                            </div>
                            <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">In Progress</p>
                                <p className="text-2xl font-bold">{progress.inProgressApplications}</p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold">{progress.completedApplications}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Upcoming Deadlines</p>
                                <p className="text-2xl font-bold">{progress.upcomingDeadlines}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add Application Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Transfer Applications</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Application
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add New Transfer Application</DialogTitle>
                            <DialogDescription>
                                Add a new university to your transfer application list.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="university">University</Label>
                                    <Select
                                        value={newApplication.universityName}
                                        onValueChange={(value) => setNewApplication({ ...newApplication, universityName: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select university" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {universities.map(uni => (
                                                <SelectItem key={uni.id} value={uni.name}>
                                                    {uni.name} ({uni.type})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="major">Major</Label>
                                    <Input
                                        id="major"
                                        value={newApplication.major}
                                        onChange={(e) => setNewApplication({ ...newApplication, major: e.target.value })}
                                        placeholder="Enter major"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="deadline">Application Deadline</Label>
                                    <Input
                                        id="deadline"
                                        type="date"
                                        value={newApplication.applicationDeadline}
                                        onChange={(e) => setNewApplication({ ...newApplication, applicationDeadline: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select
                                        value={newApplication.priority}
                                        onValueChange={(value) => setNewApplication({ ...newApplication, priority: value as any })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="High">High</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="Low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={newApplication.notes}
                                    onChange={(e) => setNewApplication({ ...newApplication, notes: e.target.value })}
                                    placeholder="Add any notes about this application..."
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddApplication}>
                                    Add Application
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
                {applications.map((application) => {
                    const daysUntil = getDaysUntilDeadline(application.applicationDeadline)
                    const isUrgent = daysUntil <= 30 && daysUntil > 0

                    return (
                        <Card key={application.id} className={isUrgent ? 'border-red-200 bg-red-50' : ''}>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold">{application.universityName}</h3>
                                            <Badge className={getStatusColor(application.status)}>
                                                {application.status}
                                            </Badge>
                                            <Badge className={getPriorityColor(application.priority)}>
                                                {application.priority} Priority
                                            </Badge>
                                        </div>
                                        <p className="text-gray-600 mb-2">{application.major}</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                Deadline: {new Date(application.applicationDeadline).toLocaleDateString()}
                                            </div>
                                            {isUrgent && (
                                                <div className="flex items-center gap-1 text-red-600">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {daysUntil} days left
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditingApplication(application)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteApplication(application.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Requirements Progress</span>
                                        <span>
                                            {application.requirements.filter(req => req.completed).length} / {application.requirements.length}
                                        </span>
                                    </div>
                                    <Progress
                                        value={(application.requirements.filter(req => req.completed).length / application.requirements.length) * 100}
                                        className="h-2"
                                    />
                                </div>

                                {/* Requirements and Documents */}
                                <Tabs defaultValue="requirements" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="requirements">Requirements</TabsTrigger>
                                        <TabsTrigger value="documents">Documents</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="requirements" className="space-y-2">
                                        {application.requirements.map((req) => (
                                            <div key={req.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {req.completed ? (
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <Clock className="h-5 w-5 text-gray-400" />
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{req.name}</p>
                                                        <p className="text-sm text-gray-600">{req.description}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const updatedRequirements = application.requirements.map(r =>
                                                            r.id === req.id ? { ...r, completed: !r.completed } : r
                                                        )
                                                        handleUpdateApplication(application.id, { requirements: updatedRequirements })
                                                    }}
                                                >
                                                    {req.completed ? 'Mark Incomplete' : 'Mark Complete'}
                                                </Button>
                                            </div>
                                        ))}
                                    </TabsContent>

                                    <TabsContent value="documents" className="space-y-2">
                                        {application.documents.map((doc) => (
                                            <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                    <div>
                                                        <p className="font-medium">{doc.name}</p>
                                                        <p className="text-sm text-gray-600">{doc.type}</p>
                                                    </div>
                                                </div>
                                                <Badge className={getStatusColor(doc.status)}>
                                                    {doc.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </TabsContent>
                                </Tabs>

                                {application.notes && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-700">{application.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {applications.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                        <p className="text-gray-600 mb-4">
                            Start building your transfer application list by adding universities you're interested in.
                        </p>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Application
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}