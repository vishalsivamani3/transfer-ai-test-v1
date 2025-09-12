'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import {
    User,
    Bell,
    Shield,
    Eye,
    Download,
    Upload,
    Trash2,
    Save,
    Loader2,
    CheckCircle,
    AlertCircle,
    Settings,
    Key,
    Database,
    Smartphone,
    Mail,
    Lock,
    Globe,
    Moon,
    Sun,
    Monitor
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTransferData } from '@/contexts/TransferDataContext'
import { toast } from 'sonner'

interface UserSettings {
    // Profile Settings
    profile: {
        firstName: string
        lastName: string
        email: string
        phone: string
        profilePicture: string
        bio: string
    }

    // Privacy Settings
    privacy: {
        profileVisibility: 'public' | 'private' | 'friends'
        showEmail: boolean
        showPhone: boolean
        showGPA: boolean
        showCourses: boolean
        allowMessages: boolean
        dataSharing: boolean
    }

    // Notification Settings
    notifications: {
        emailNotifications: boolean
        pushNotifications: boolean
        smsNotifications: boolean
        deadlineReminders: boolean
        courseUpdates: boolean
        transferUpdates: boolean
        financialAidUpdates: boolean
        weeklyDigest: boolean
        marketingEmails: boolean
    }

    // Security Settings
    security: {
        twoFactorAuth: boolean
        loginAlerts: boolean
        sessionTimeout: number
        passwordChangeRequired: boolean
        trustedDevices: string[]
    }

    // Data & Export Settings
    data: {
        autoBackup: boolean
        backupFrequency: 'daily' | 'weekly' | 'monthly'
        dataRetention: number
        exportFormat: 'json' | 'csv' | 'pdf'
        deleteAccountAfter: number
    }

    // Appearance Settings
    appearance: {
        theme: 'light' | 'dark' | 'system'
        fontSize: 'small' | 'medium' | 'large'
        compactMode: boolean
        showAnimations: boolean
        colorScheme: 'default' | 'blue' | 'green' | 'purple'
    }
}

interface SettingsManagementProps {
    onClose?: () => void
}

export default function SettingsManagement({ onClose }: SettingsManagementProps) {
    const { state: authState, actions: authActions } = useAuth()
    const { state: transferState, actions: transferActions } = useTransferData()
    const [settings, setSettings] = useState<UserSettings>({
        profile: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            profilePicture: '',
            bio: ''
        },
        privacy: {
            profileVisibility: 'private',
            showEmail: false,
            showPhone: false,
            showGPA: false,
            showCourses: false,
            allowMessages: true,
            dataSharing: false
        },
        notifications: {
            emailNotifications: true,
            pushNotifications: true,
            smsNotifications: false,
            deadlineReminders: true,
            courseUpdates: true,
            transferUpdates: true,
            financialAidUpdates: true,
            weeklyDigest: true,
            marketingEmails: false
        },
        security: {
            twoFactorAuth: false,
            loginAlerts: true,
            sessionTimeout: 30,
            passwordChangeRequired: false,
            trustedDevices: []
        },
        data: {
            autoBackup: true,
            backupFrequency: 'weekly',
            dataRetention: 365,
            exportFormat: 'json',
            deleteAccountAfter: 30
        },
        appearance: {
            theme: 'system',
            fontSize: 'medium',
            compactMode: false,
            showAnimations: true,
            colorScheme: 'default'
        }
    })

    const [isSaving, setIsSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('profile')
    const [hasChanges, setHasChanges] = useState(false)

    // Load settings from auth context and local storage
    useEffect(() => {
        if (authState.user) {
            const userMetadata = authState.user.user_metadata || {}
            const savedSettings = localStorage.getItem('user-settings')

            setSettings(prev => ({
                ...prev,
                profile: {
                    firstName: userMetadata.firstName || prev.profile.firstName,
                    lastName: userMetadata.lastName || prev.profile.lastName,
                    email: authState.user?.email || prev.profile.email,
                    phone: userMetadata.phone || prev.profile.phone,
                    profilePicture: userMetadata.profilePicture || prev.profile.profilePicture,
                    bio: userMetadata.bio || prev.profile.bio
                },
                ...(savedSettings ? JSON.parse(savedSettings) : {})
            }))
        }
    }, [authState.user])

    const handleSettingChange = (category: keyof UserSettings, field: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }))
        setHasChanges(true)
    }

    const handleSaveSettings = async () => {
        setIsSaving(true)
        try {
            // Save to local storage
            localStorage.setItem('user-settings', JSON.stringify({
                privacy: settings.privacy,
                notifications: settings.notifications,
                security: settings.security,
                data: settings.data,
                appearance: settings.appearance
            }))

            // Update profile in auth context
            if (authState.user) {
                await authActions.updateProfile({
                    firstName: settings.profile.firstName,
                    lastName: settings.profile.lastName,
                    phone: settings.profile.phone,
                    bio: settings.profile.bio,
                    profilePicture: settings.profile.profilePicture
                })
            }

            toast.success('Settings saved successfully!')
            setHasChanges(false)
        } catch (error) {
            console.error('Error saving settings:', error)
            toast.error('Failed to save settings. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleExportData = async () => {
        try {
            const exportData = {
                profile: settings.profile,
                academicProfile: transferState.studentProfile,
                selectedCourses: transferState.selectedCourses,
                semesterPlans: transferState.semesterPlans,
                transferApplications: [], // Add when implemented
                exportDate: new Date().toISOString(),
                exportFormat: settings.data.exportFormat
            }

            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `transfer-ai-data-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast.success('Data exported successfully!')
        } catch (error) {
            console.error('Error exporting data:', error)
            toast.error('Failed to export data. Please try again.')
        }
    }

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            try {
                // Implement account deletion logic
                toast.success('Account deletion initiated. You will receive a confirmation email.')
            } catch (error) {
                console.error('Error deleting account:', error)
                toast.error('Failed to delete account. Please contact support.')
            }
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>
                <div className="flex gap-2">
                    {hasChanges && (
                        <Button
                            onClick={handleSaveSettings}
                            disabled={isSaving}
                            size="sm"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    )}
                    {onClose && (
                        <Button variant="outline" onClick={onClose} size="sm">
                            Close
                        </Button>
                    )}
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Privacy
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="data" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Data
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Appearance
                    </TabsTrigger>
                </TabsList>

                {/* Profile Settings */}
                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your personal information and profile details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={settings.profile.firstName}
                                        onChange={(e) => handleSettingChange('profile', 'firstName', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={settings.profile.lastName}
                                        onChange={(e) => handleSettingChange('profile', 'lastName', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={settings.profile.email}
                                    disabled
                                    className="bg-gray-50"
                                />
                                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={settings.profile.phone}
                                    onChange={(e) => handleSettingChange('profile', 'phone', e.target.value)}
                                    placeholder="(555) 123-4567"
                                />
                            </div>

                            <div>
                                <Label htmlFor="bio">Bio</Label>
                                <textarea
                                    id="bio"
                                    value={settings.profile.bio}
                                    onChange={(e) => handleSettingChange('profile', 'bio', e.target.value)}
                                    placeholder="Tell us about yourself..."
                                    className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Privacy Settings */}
                <TabsContent value="privacy" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy Settings</CardTitle>
                            <CardDescription>
                                Control who can see your information and how it's shared
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                                <Select
                                    value={settings.privacy.profileVisibility}
                                    onValueChange={(value) => handleSettingChange('privacy', 'profileVisibility', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">Public</SelectItem>
                                        <SelectItem value="friends">Friends Only</SelectItem>
                                        <SelectItem value="private">Private</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Show Email Address</Label>
                                        <p className="text-sm text-gray-500">Allow others to see your email</p>
                                    </div>
                                    <Switch
                                        checked={settings.privacy.showEmail}
                                        onCheckedChange={(checked) => handleSettingChange('privacy', 'showEmail', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Show Phone Number</Label>
                                        <p className="text-sm text-gray-500">Allow others to see your phone number</p>
                                    </div>
                                    <Switch
                                        checked={settings.privacy.showPhone}
                                        onCheckedChange={(checked) => handleSettingChange('privacy', 'showPhone', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Show GPA</Label>
                                        <p className="text-sm text-gray-500">Allow others to see your GPA</p>
                                    </div>
                                    <Switch
                                        checked={settings.privacy.showGPA}
                                        onCheckedChange={(checked) => handleSettingChange('privacy', 'showGPA', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Allow Messages</Label>
                                        <p className="text-sm text-gray-500">Allow other users to send you messages</p>
                                    </div>
                                    <Switch
                                        checked={settings.privacy.allowMessages}
                                        onCheckedChange={(checked) => handleSettingChange('privacy', 'allowMessages', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Data Sharing</Label>
                                        <p className="text-sm text-gray-500">Share anonymized data to improve the platform</p>
                                    </div>
                                    <Switch
                                        checked={settings.privacy.dataSharing}
                                        onCheckedChange={(checked) => handleSettingChange('privacy', 'dataSharing', checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Choose how and when you want to receive notifications
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Email Notifications</Label>
                                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.emailNotifications}
                                        onCheckedChange={(checked) => handleSettingChange('notifications', 'emailNotifications', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Push Notifications</Label>
                                        <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.pushNotifications}
                                        onCheckedChange={(checked) => handleSettingChange('notifications', 'pushNotifications', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Deadline Reminders</Label>
                                        <p className="text-sm text-gray-500">Get reminded about upcoming deadlines</p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.deadlineReminders}
                                        onCheckedChange={(checked) => handleSettingChange('notifications', 'deadlineReminders', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Course Updates</Label>
                                        <p className="text-sm text-gray-500">Notifications about course changes</p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.courseUpdates}
                                        onCheckedChange={(checked) => handleSettingChange('notifications', 'courseUpdates', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Transfer Updates</Label>
                                        <p className="text-sm text-gray-500">Updates about transfer applications</p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.transferUpdates}
                                        onCheckedChange={(checked) => handleSettingChange('notifications', 'transferUpdates', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Marketing Emails</Label>
                                        <p className="text-sm text-gray-500">Receive promotional emails and updates</p>
                                    </div>
                                    <Switch
                                        checked={settings.notifications.marketingEmails}
                                        onCheckedChange={(checked) => handleSettingChange('notifications', 'marketingEmails', checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>
                                Manage your account security and authentication
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Two-Factor Authentication</Label>
                                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                    </div>
                                    <Switch
                                        checked={settings.security.twoFactorAuth}
                                        onCheckedChange={(checked) => handleSettingChange('security', 'twoFactorAuth', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Login Alerts</Label>
                                        <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                                    </div>
                                    <Switch
                                        checked={settings.security.loginAlerts}
                                        onCheckedChange={(checked) => handleSettingChange('security', 'loginAlerts', checked)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                                <Select
                                    value={settings.security.sessionTimeout.toString()}
                                    onValueChange={(value) => handleSettingChange('security', 'sessionTimeout', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15">15 minutes</SelectItem>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="60">1 hour</SelectItem>
                                        <SelectItem value="120">2 hours</SelectItem>
                                        <SelectItem value="480">8 hours</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Data Settings */}
                <TabsContent value="data" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Management</CardTitle>
                            <CardDescription>
                                Control your data backup, export, and retention settings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Automatic Backup</Label>
                                        <p className="text-sm text-gray-500">Automatically backup your data</p>
                                    </div>
                                    <Switch
                                        checked={settings.data.autoBackup}
                                        onCheckedChange={(checked) => handleSettingChange('data', 'autoBackup', checked)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                                <Select
                                    value={settings.data.backupFrequency}
                                    onValueChange={(value) => handleSettingChange('data', 'backupFrequency', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="exportFormat">Export Format</Label>
                                <Select
                                    value={settings.data.exportFormat}
                                    onValueChange={(value) => handleSettingChange('data', 'exportFormat', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="json">JSON</SelectItem>
                                        <SelectItem value="csv">CSV</SelectItem>
                                        <SelectItem value="pdf">PDF</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Button onClick={handleExportData} variant="outline" className="w-full">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export All Data
                                </Button>

                                <Button onClick={handleDeleteAccount} variant="destructive" className="w-full">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Account
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Appearance Settings */}
                <TabsContent value="appearance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Appearance Settings</CardTitle>
                            <CardDescription>
                                Customize the look and feel of your interface
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="theme">Theme</Label>
                                <Select
                                    value={settings.appearance.theme}
                                    onValueChange={(value) => handleSettingChange('appearance', 'theme', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">
                                            <div className="flex items-center gap-2">
                                                <Sun className="h-4 w-4" />
                                                Light
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="dark">
                                            <div className="flex items-center gap-2">
                                                <Moon className="h-4 w-4" />
                                                Dark
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="system">
                                            <div className="flex items-center gap-2">
                                                <Monitor className="h-4 w-4" />
                                                System
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="fontSize">Font Size</Label>
                                <Select
                                    value={settings.appearance.fontSize}
                                    onValueChange={(value) => handleSettingChange('appearance', 'fontSize', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="small">Small</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="large">Large</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Compact Mode</Label>
                                        <p className="text-sm text-gray-500">Use a more compact interface</p>
                                    </div>
                                    <Switch
                                        checked={settings.appearance.compactMode}
                                        onCheckedChange={(checked) => handleSettingChange('appearance', 'compactMode', checked)}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Show Animations</Label>
                                        <p className="text-sm text-gray-500">Enable interface animations</p>
                                    </div>
                                    <Switch
                                        checked={settings.appearance.showAnimations}
                                        onCheckedChange={(checked) => handleSettingChange('appearance', 'showAnimations', checked)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}