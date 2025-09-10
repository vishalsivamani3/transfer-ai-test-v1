'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Settings,
    User,
    Bell,
    Shield,
    Palette,
    Globe,
    Save,
    Loader2,
    CheckCircle,
    AlertCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { state, actions } = useAuth()
    const [isSaving, setIsSaving] = useState(false)
    const [settings, setSettings] = useState({
        // Profile settings
        fullName: state.user?.user_metadata?.full_name || '',
        email: state.user?.email || '',
        currentCollege: state.user?.user_metadata?.currentCollege || '',
        targetMajor: state.user?.user_metadata?.targetMajor || '',
        gpa: state.user?.user_metadata?.gpa || '',
        transferTimeline: state.user?.user_metadata?.transferTimeline || '',

        // Notification settings
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true,
        transferDeadlines: true,

        // Privacy settings
        profileVisibility: 'private',
        dataSharing: false,
        analytics: true,

        // Appearance settings
        theme: 'system',
        language: 'en',
        timezone: 'America/Los_Angeles'
    })

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const profileUpdates = {
                full_name: settings.fullName,
                currentCollege: settings.currentCollege,
                targetMajor: settings.targetMajor,
                gpa: settings.gpa,
                transferTimeline: settings.transferTimeline
            }

            const result = await actions.updateProfile(profileUpdates)

            if (result.success) {
                toast.success('Settings saved successfully!')
                onClose()
            } else {
                toast.error(result.error || 'Failed to save settings')
            }
        } catch (error) {
            console.error('Error saving settings:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setIsSaving(false)
        }
    }

    const handleInputChange = (field: string, value: string | boolean) => {
        setSettings(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Settings
                    </DialogTitle>
                    <DialogDescription>
                        Manage your account settings and preferences
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="privacy">Privacy</TabsTrigger>
                        <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    Profile Information
                                </CardTitle>
                                <CardDescription>
                                    Update your personal information and academic details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">Full Name</Label>
                                        <Input
                                            id="fullName"
                                            value={settings.fullName}
                                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={settings.email}
                                            disabled
                                            className="bg-gray-50"
                                        />
                                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currentCollege">Current College</Label>
                                        <Input
                                            id="currentCollege"
                                            value={settings.currentCollege}
                                            onChange={(e) => handleInputChange('currentCollege', e.target.value)}
                                            placeholder="e.g., Santa Monica College"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="targetMajor">Target Major</Label>
                                        <Input
                                            id="targetMajor"
                                            value={settings.targetMajor}
                                            onChange={(e) => handleInputChange('targetMajor', e.target.value)}
                                            placeholder="e.g., Computer Science"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gpa">GPA</Label>
                                        <Input
                                            id="gpa"
                                            value={settings.gpa}
                                            onChange={(e) => handleInputChange('gpa', e.target.value)}
                                            placeholder="e.g., 3.5"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="transferTimeline">Transfer Timeline</Label>
                                        <Select
                                            value={settings.transferTimeline}
                                            onValueChange={(value) => handleInputChange('transferTimeline', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select timeline" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1-year">1 Year</SelectItem>
                                                <SelectItem value="2-year">2 Years</SelectItem>
                                                <SelectItem value="3-year">3 Years</SelectItem>
                                                <SelectItem value="flexible">Flexible</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-4 w-4" />
                                    Notification Preferences
                                </CardTitle>
                                <CardDescription>
                                    Choose how you want to be notified about important updates
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Email Notifications</p>
                                            <p className="text-sm text-gray-600">Receive updates via email</p>
                                        </div>
                                        <Switch
                                            checked={settings.emailNotifications}
                                            onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Push Notifications</p>
                                            <p className="text-sm text-gray-600">Receive browser notifications</p>
                                        </div>
                                        <Switch
                                            checked={settings.pushNotifications}
                                            onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Weekly Reports</p>
                                            <p className="text-sm text-gray-600">Get weekly progress summaries</p>
                                        </div>
                                        <Switch
                                            checked={settings.weeklyReports}
                                            onCheckedChange={(checked) => handleInputChange('weeklyReports', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Transfer Deadlines</p>
                                            <p className="text-sm text-gray-600">Reminders for important deadlines</p>
                                        </div>
                                        <Switch
                                            checked={settings.transferDeadlines}
                                            onCheckedChange={(checked) => handleInputChange('transferDeadlines', checked)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="privacy" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Privacy & Security
                                </CardTitle>
                                <CardDescription>
                                    Control your privacy settings and data sharing preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="profileVisibility">Profile Visibility</Label>
                                        <Select
                                            value={settings.profileVisibility}
                                            onValueChange={(value) => handleInputChange('profileVisibility', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">Public</SelectItem>
                                                <SelectItem value="private">Private</SelectItem>
                                                <SelectItem value="friends">Friends Only</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Data Sharing</p>
                                            <p className="text-sm text-gray-600">Allow sharing of anonymized data for research</p>
                                        </div>
                                        <Switch
                                            checked={settings.dataSharing}
                                            onCheckedChange={(checked) => handleInputChange('dataSharing', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Analytics</p>
                                            <p className="text-sm text-gray-600">Help improve the app with usage analytics</p>
                                        </div>
                                        <Switch
                                            checked={settings.analytics}
                                            onCheckedChange={(checked) => handleInputChange('analytics', checked)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Palette className="h-4 w-4" />
                                    Appearance & Language
                                </CardTitle>
                                <CardDescription>
                                    Customize how the app looks and feels
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="theme">Theme</Label>
                                        <Select
                                            value={settings.theme}
                                            onValueChange={(value) => handleInputChange('theme', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">Light</SelectItem>
                                                <SelectItem value="dark">Dark</SelectItem>
                                                <SelectItem value="system">System</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="language">Language</Label>
                                        <Select
                                            value={settings.language}
                                            onValueChange={(value) => handleInputChange('language', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="es">Español</SelectItem>
                                                <SelectItem value="fr">Français</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <Separator />

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}