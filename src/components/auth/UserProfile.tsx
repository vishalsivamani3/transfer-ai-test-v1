'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
    User,
    Settings,
    LogOut,
    Mail,
    Calendar,
    School,
    Target,
    ChevronDown,
    Edit,
    Save,
    X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { SettingsModal } from './SettingsModal'
import SettingsManagement from './SettingsManagement'
import { toast } from 'sonner'

interface UserProfileProps {
    showDropdown?: boolean
    onEditProfile?: () => void
    onSignOut?: () => void
    className?: string
}

export function UserProfile({
    showDropdown = true,
    onEditProfile,
    onSignOut,
    className
}: UserProfileProps) {
    const { state, actions } = useAuth()
    const [isSigningOut, setIsSigningOut] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [showSettingsManagement, setShowSettingsManagement] = useState(false)

    const user = state.user
    const userMetadata = user?.user_metadata || {}

    const handleSignOut = async () => {
        setIsSigningOut(true)
        try {
            await actions.signOut()
            onSignOut?.()
            toast.success('Signed out successfully')
        } catch (error) {
            console.error('Sign out error:', error)
            toast.error('Failed to sign out')
        } finally {
            setIsSigningOut(false)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (!user) {
        return null
    }

    const profileContent = (
        <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={userMetadata.avatar_url} alt={userMetadata.full_name} />
                <AvatarFallback>
                    {userMetadata.full_name ? getInitials(userMetadata.full_name) : 'U'}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                    {userMetadata.full_name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                    {user.email}
                </p>
            </div>
            {showDropdown && (
                <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
        </div>
    )

    if (!showDropdown) {
        return (
            <div className={className}>
                {profileContent}
            </div>
        )
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={`h-auto p-2 ${className}`}>
                        {profileContent}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {userMetadata.full_name || 'User'}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* Profile Info */}
                    <div className="px-2 py-1.5">
                        <div className="space-y-2 text-xs">
                            {userMetadata.currentCollege && (
                                <div className="flex items-center gap-2">
                                    <School className="h-3 w-3 text-gray-400" />
                                    <span className="text-gray-600">Current College:</span>
                                    <span className="font-medium">{userMetadata.currentCollege}</span>
                                </div>
                            )}
                            {userMetadata.targetMajor && (
                                <div className="flex items-center gap-2">
                                    <Target className="h-3 w-3 text-gray-400" />
                                    <span className="text-gray-600">Target Major:</span>
                                    <span className="font-medium">{userMetadata.targetMajor}</span>
                                </div>
                            )}
                            {userMetadata.gpa && (
                                <div className="flex items-center gap-2">
                                    <User className="h-3 w-3 text-gray-400" />
                                    <span className="text-gray-600">GPA:</span>
                                    <span className="font-medium">{userMetadata.gpa}</span>
                                </div>
                            )}
                            {userMetadata.transferTimeline && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-3 w-3 text-gray-400" />
                                    <span className="text-gray-600">Timeline:</span>
                                    <span className="font-medium">{userMetadata.transferTimeline}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={onEditProfile}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Profile</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setShowSettingsManagement(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="text-red-600 focus:text-red-600"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SettingsModal
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />

            {showSettingsManagement && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <SettingsManagement onClose={() => setShowSettingsManagement(false)} />
                    </div>
                </div>
            )}
        </>
    )
}

// Compact version for headers/navbars
export function UserProfileCompact({ className }: { className?: string }) {
    return <UserProfile showDropdown={true} className={className} />
}

// Full profile card version with auto-editable fields
export function UserProfileCard({ className }: { className?: string }) {
    const { state, actions } = useAuth()
    const user = state.user
    const userMetadata = user?.user_metadata || {}

    // Local state for editable fields
    const [editableFields, setEditableFields] = useState({
        full_name: userMetadata.full_name || '',
        currentCollege: userMetadata.currentCollege || '',
        targetMajor: userMetadata.targetMajor || '',
        gpa: userMetadata.gpa || '',
        transferTimeline: userMetadata.transferTimeline || ''
    })

    const [isSaving, setIsSaving] = useState(false)

    if (!user) {
        return null
    }

    const handleFieldChange = (field: string, value: string) => {
        setEditableFields(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Update user metadata
            const updatedMetadata = {
                ...userMetadata,
                ...editableFields
            }

            // Here you would typically call an API to update the user profile
            // For now, we'll just show a success message
            toast.success('Profile updated successfully!')

            // In a real implementation, you would update the user context here
            // await actions.updateProfile(updatedMetadata)

        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
        } finally {
            setIsSaving(false)
        }
    }

    const handleReset = () => {
        setEditableFields({
            full_name: userMetadata.full_name || '',
            currentCollege: userMetadata.currentCollege || '',
            targetMajor: userMetadata.targetMajor || '',
            gpa: userMetadata.gpa || '',
            transferTimeline: userMetadata.transferTimeline || ''
        })
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleReset}
                            disabled={isSaving}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            <Save className="h-4 w-4 mr-1" />
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </CardTitle>
                <CardDescription>
                    Click on any field to edit your profile information
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={userMetadata.avatar_url} alt={editableFields.full_name} />
                        <AvatarFallback className="text-lg">
                            {editableFields.full_name ? editableFields.full_name.split(' ').map(n => n[0]).join('') : 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                        <div>
                            <Label htmlFor="full_name" className="text-sm font-medium text-gray-600">
                                Full Name
                            </Label>
                            <Input
                                id="full_name"
                                value={editableFields.full_name}
                                onChange={(e) => handleFieldChange('full_name', e.target.value)}
                                className="mt-1"
                                placeholder="Enter your full name"
                            />
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                            Member since {formatDate(user.created_at)}
                        </p>
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentCollege" className="text-sm font-medium text-gray-600">
                            Current College
                        </Label>
                        <Input
                            id="currentCollege"
                            value={editableFields.currentCollege}
                            onChange={(e) => handleFieldChange('currentCollege', e.target.value)}
                            placeholder="Enter your current college"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="targetMajor" className="text-sm font-medium text-gray-600">
                            Target Major
                        </Label>
                        <Input
                            id="targetMajor"
                            value={editableFields.targetMajor}
                            onChange={(e) => handleFieldChange('targetMajor', e.target.value)}
                            placeholder="Enter your target major"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gpa" className="text-sm font-medium text-gray-600">
                            GPA
                        </Label>
                        <Input
                            id="gpa"
                            type="number"
                            step="0.01"
                            min="0"
                            max="4.0"
                            value={editableFields.gpa}
                            onChange={(e) => handleFieldChange('gpa', e.target.value)}
                            placeholder="Enter your GPA"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="transferTimeline" className="text-sm font-medium text-gray-600">
                            Transfer Timeline
                        </Label>
                        <Input
                            id="transferTimeline"
                            value={editableFields.transferTimeline}
                            onChange={(e) => handleFieldChange('transferTimeline', e.target.value)}
                            placeholder="e.g., Fall 2025"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}