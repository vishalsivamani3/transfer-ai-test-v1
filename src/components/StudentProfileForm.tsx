'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle } from 'lucide-react'
import {
    upsertStudentProfile,
    updateStudentGoals,
    getStudentProfile,
    type StudentProfileData
} from '@/lib/queries'

interface StudentProfileFormProps {
    userId: string
    userEmail: string
    onProfileUpdated?: () => void
}

export default function StudentProfileForm({ userId, userEmail, onProfileUpdated }: StudentProfileFormProps) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        currentCollege: '',
        academicYear: '',
        intendedMajor: '',
        targetState: '',
        degreeGoal: '',
        currentGPA: '',
        completedCredits: ''
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleCreateProfile = async () => {
        setLoading(true)
        setMessage(null)

        try {
            const profileData: StudentProfileData = {
                user_id: userId,
                email: userEmail,
                first_name: formData.firstName,
                last_name: formData.lastName,
                current_college: formData.currentCollege,
                academic_year: formData.academicYear,
                intended_major: formData.intendedMajor || undefined,
                target_state: formData.targetState || undefined,
                degree_goal: formData.degreeGoal || undefined,
                current_gpa: formData.currentGPA ? parseFloat(formData.currentGPA) : undefined,
                completed_credits: formData.completedCredits ? parseInt(formData.completedCredits) : undefined,
                onboarding_completed: true
            }

            const result = await upsertStudentProfile(profileData)

            if (result.success) {
                setMessage({ type: 'success', text: 'Student profile created successfully!' })
                onProfileUpdated?.()
            } else {
                setMessage({ type: 'error', text: 'Failed to create profile. Please try again.' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateGoals = async () => {
        setLoading(true)
        setMessage(null)

        try {
            const result = await updateStudentGoals(
                userId,
                formData.targetState,
                formData.intendedMajor,
                formData.degreeGoal
            )

            if (result.success) {
                setMessage({ type: 'success', text: 'Student goals updated successfully!' })
                onProfileUpdated?.()
            } else {
                setMessage({ type: 'error', text: 'Failed to update goals. Please try again.' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    const handleFetchProfile = async () => {
        setLoading(true)
        setMessage(null)

        try {
            const result = await getStudentProfile(userId)

            if (result.success && result.data) {
                const profile = result.data
                setFormData({
                    firstName: profile.first_name,
                    lastName: profile.last_name,
                    currentCollege: profile.current_college,
                    academicYear: profile.academic_year,
                    intendedMajor: profile.intended_major || '',
                    targetState: profile.target_state || '',
                    degreeGoal: profile.degree_goal || '',
                    currentGPA: profile.current_gpa?.toString() || '',
                    completedCredits: profile.completed_credits?.toString() || ''
                })
                setMessage({ type: 'success', text: 'Profile loaded successfully!' })
            } else {
                setMessage({ type: 'error', text: 'Failed to load profile. Please try again.' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Student Profile Management</CardTitle>
                <CardDescription>
                    Create or update your student profile with your academic goals and preferences.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {message && (
                    <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                        {message.type === 'success' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                            {message.text}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Enter your last name"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentCollege">Current College</Label>
                        <Input
                            id="currentCollege"
                            value={formData.currentCollege}
                            onChange={(e) => handleInputChange('currentCollege', e.target.value)}
                            placeholder="Enter your current college"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="academicYear">Academic Year</Label>
                        <Select value={formData.academicYear} onValueChange={(value) => handleInputChange('academicYear', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select academic year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="freshman">Freshman</SelectItem>
                                <SelectItem value="sophomore">Sophomore</SelectItem>
                                <SelectItem value="junior">Junior</SelectItem>
                                <SelectItem value="senior">Senior</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="intendedMajor">Intended Major</Label>
                        <Input
                            id="intendedMajor"
                            value={formData.intendedMajor}
                            onChange={(e) => handleInputChange('intendedMajor', e.target.value)}
                            placeholder="e.g., Computer Science"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="targetState">Target State</Label>
                        <Select value={formData.targetState} onValueChange={(value) => handleInputChange('targetState', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="California">California</SelectItem>
                                <SelectItem value="Texas">Texas</SelectItem>
                                <SelectItem value="New York">New York</SelectItem>
                                <SelectItem value="Florida">Florida</SelectItem>
                                <SelectItem value="Washington">Washington</SelectItem>
                                <SelectItem value="Oregon">Oregon</SelectItem>
                                <SelectItem value="Arizona">Arizona</SelectItem>
                                <SelectItem value="Nevada">Nevada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="degreeGoal">Degree Goal</Label>
                        <Select value={formData.degreeGoal} onValueChange={(value) => handleInputChange('degreeGoal', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select degree" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Bachelor of Science">Bachelor of Science</SelectItem>
                                <SelectItem value="Bachelor of Arts">Bachelor of Arts</SelectItem>
                                <SelectItem value="Bachelor of Engineering">Bachelor of Engineering</SelectItem>
                                <SelectItem value="Bachelor of Business Administration">Bachelor of Business Administration</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentGPA">Current GPA</Label>
                        <Input
                            id="currentGPA"
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            value={formData.currentGPA}
                            onChange={(e) => handleInputChange('currentGPA', e.target.value)}
                            placeholder="e.g., 3.45"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="completedCredits">Completed Credits</Label>
                        <Input
                            id="completedCredits"
                            type="number"
                            min="0"
                            value={formData.completedCredits}
                            onChange={(e) => handleInputChange('completedCredits', e.target.value)}
                            placeholder="e.g., 24"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button
                        onClick={handleCreateProfile}
                        disabled={loading || !formData.firstName || !formData.lastName || !formData.currentCollege || !formData.academicYear}
                        className="flex-1"
                    >
                        {loading ? 'Creating...' : 'Create Profile'}
                    </Button>
                    <Button
                        onClick={handleUpdateGoals}
                        disabled={loading || !formData.intendedMajor || !formData.targetState || !formData.degreeGoal}
                        variant="outline"
                        className="flex-1"
                    >
                        {loading ? 'Updating...' : 'Update Goals'}
                    </Button>
                    <Button
                        onClick={handleFetchProfile}
                        disabled={loading}
                        variant="secondary"
                    >
                        {loading ? 'Loading...' : 'Load Profile'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
} 