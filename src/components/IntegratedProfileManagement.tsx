'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    User,
    School,
    Target,
    MapPin,
    Calendar,
    GraduationCap,
    BookOpen,
    Award,
    Save,
    Edit,
    CheckCircle,
    AlertCircle,
    Plus,
    X
} from 'lucide-react'
import { toast } from 'sonner'
import { useTransferData } from '@/contexts/TransferDataContext'
import { getCollegesByType } from '@/data/assist/utils'

interface IntegratedProfileManagementProps {
    user?: any
    onProfileUpdate?: (profile: any) => void
}

export default function IntegratedProfileManagement({ user, onProfileUpdate }: IntegratedProfileManagementProps) {
    const { state, actions } = useTransferData()
    const [isEditing, setIsEditing] = useState(false)
    const [profileData, setProfileData] = useState({
        full_name: user?.user_metadata?.full_name || '',
        currentCollege: user?.user_metadata?.currentCollege || '',
        currentMajor: user?.user_metadata?.currentMajor || '',
        targetMajor: user?.user_metadata?.targetMajor || '',
        targetUniversities: user?.user_metadata?.targetUniversities || [],
        graduationYear: user?.user_metadata?.graduationYear || '',
        gpa: user?.user_metadata?.gpa || '',
        transferTimeline: user?.user_metadata?.transferTimeline || '2-year',
        academicGoals: user?.user_metadata?.academicGoals || '',
        interests: user?.user_metadata?.interests || []
    })

    const [availableColleges, setAvailableColleges] = useState<any>(null)
    const [newUniversity, setNewUniversity] = useState('')
    const [newInterest, setNewInterest] = useState('')

    // Load available colleges
    useEffect(() => {
        const loadColleges = async () => {
            try {
                const colleges = getCollegesByType()
                setAvailableColleges(colleges)
            } catch (error) {
                console.error('Error loading colleges:', error)
            }
        }
        loadColleges()
    }, [])

    // Handle profile update
    const handleSaveProfile = async () => {
        try {
            // Here you would typically update the user profile in your database
            // For now, we'll just show a success message
            toast.success('Profile updated successfully!')
            setIsEditing(false)

            if (onProfileUpdate) {
                onProfileUpdate(profileData)
            }
        } catch (error) {
            toast.error('Failed to update profile')
            console.error('Profile update error:', error)
        }
    }

    // Handle adding target university
    const handleAddUniversity = () => {
        if (newUniversity.trim() && !profileData.targetUniversities.includes(newUniversity.trim())) {
            setProfileData({
                ...profileData,
                targetUniversities: [...profileData.targetUniversities, newUniversity.trim()]
            })
            setNewUniversity('')
        }
    }

    // Handle removing target university
    const handleRemoveUniversity = (university: string) => {
        setProfileData({
            ...profileData,
            targetUniversities: profileData.targetUniversities.filter(u => u !== university)
        })
    }

    // Handle adding interest
    const handleAddInterest = () => {
        if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
            setProfileData({
                ...profileData,
                interests: [...profileData.interests, newInterest.trim()]
            })
            setNewInterest('')
        }
    }

    // Handle removing interest
    const handleRemoveInterest = (interest: string) => {
        setProfileData({
            ...profileData,
            interests: profileData.interests.filter(i => i !== interest)
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Profile Management</h2>
                    <p className="text-muted-foreground">
                        Manage your academic profile to get personalized transfer insights
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveProfile}>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                        </Button>
                    )}
                </div>
            </div>

            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="basic">Basic Information</TabsTrigger>
                    <TabsTrigger value="academic">Academic Goals</TabsTrigger>
                    <TabsTrigger value="transfer">Transfer Planning</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>
                                Your basic profile information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input
                                        id="full_name"
                                        value={profileData.full_name}
                                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="graduation_year">Expected Graduation Year</Label>
                                    <Input
                                        id="graduation_year"
                                        type="number"
                                        value={profileData.graduationYear}
                                        onChange={(e) => setProfileData({ ...profileData, graduationYear: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="2025"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <School className="h-5 w-5" />
                                Current Institution
                            </CardTitle>
                            <CardDescription>
                                Information about your current college
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="current_college">Current College</Label>
                                    <Input
                                        id="current_college"
                                        value={profileData.currentCollege}
                                        onChange={(e) => setProfileData({ ...profileData, currentCollege: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="e.g., Los Angeles City College"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="current_major">Current Major</Label>
                                    <Input
                                        id="current_major"
                                        value={profileData.currentMajor}
                                        onChange={(e) => setProfileData({ ...profileData, currentMajor: e.target.value })}
                                        disabled={!isEditing}
                                        placeholder="e.g., General Studies"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="gpa">Current GPA</Label>
                                <Input
                                    id="gpa"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="4"
                                    value={profileData.gpa}
                                    onChange={(e) => setProfileData({ ...profileData, gpa: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="3.5"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="academic" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="h-5 w-5" />
                                Transfer Goals
                            </CardTitle>
                            <CardDescription>
                                Define your transfer objectives and target institutions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="target_major">Target Major</Label>
                                <Input
                                    id="target_major"
                                    value={profileData.targetMajor}
                                    onChange={(e) => setProfileData({ ...profileData, targetMajor: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="e.g., Computer Science"
                                />
                            </div>

                            <div>
                                <Label>Target Universities</Label>
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input
                                            value={newUniversity}
                                            onChange={(e) => setNewUniversity(e.target.value)}
                                            disabled={!isEditing}
                                            placeholder="e.g., UC Berkeley"
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddUniversity()}
                                        />
                                        <Button
                                            onClick={handleAddUniversity}
                                            disabled={!isEditing || !newUniversity.trim()}
                                            size="sm"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {profileData.targetUniversities.map((university: string, index: number) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                <GraduationCap className="h-3 w-3" />
                                                {university}
                                                {isEditing && (
                                                    <button
                                                        onClick={() => handleRemoveUniversity(university)}
                                                        className="ml-1 hover:text-red-500"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="academic_goals">Academic Goals</Label>
                                <Textarea
                                    id="academic_goals"
                                    value={profileData.academicGoals}
                                    onChange={(e) => setProfileData({ ...profileData, academicGoals: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="Describe your academic and career goals..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Academic Interests
                            </CardTitle>
                            <CardDescription>
                                Areas of study that interest you
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    value={newInterest}
                                    onChange={(e) => setNewInterest(e.target.value)}
                                    disabled={!isEditing}
                                    placeholder="e.g., Artificial Intelligence"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                                />
                                <Button
                                    onClick={handleAddInterest}
                                    disabled={!isEditing || !newInterest.trim()}
                                    size="sm"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profileData.interests.map((interest: string, index: number) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                                        {interest}
                                        {isEditing && (
                                            <button
                                                onClick={() => handleRemoveInterest(interest)}
                                                className="ml-1 hover:text-red-500"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="transfer" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Transfer Timeline
                            </CardTitle>
                            <CardDescription>
                                Plan your transfer timeline and strategy
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="transfer_timeline">Transfer Timeline</Label>
                                <Select
                                    value={profileData.transferTimeline}
                                    onValueChange={(value) => setProfileData({ ...profileData, transferTimeline: value })}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1-year">1 Year</SelectItem>
                                        <SelectItem value="2-year">2 Years</SelectItem>
                                        <SelectItem value="3-year">3+ Years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5" />
                                Profile Summary
                            </CardTitle>
                            <CardDescription>
                                Overview of your transfer profile
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Current College:</span>
                                        <span className="text-sm font-medium">{profileData.currentCollege || 'Not specified'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Current Major:</span>
                                        <span className="text-sm font-medium">{profileData.currentMajor || 'Not specified'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Target Major:</span>
                                        <span className="text-sm font-medium">{profileData.targetMajor || 'Not specified'}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Transfer Timeline:</span>
                                        <span className="text-sm font-medium">{profileData.transferTimeline}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Target Universities:</span>
                                        <span className="text-sm font-medium">{profileData.targetUniversities.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Academic Interests:</span>
                                        <span className="text-sm font-medium">{profileData.interests.length}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}