'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTransferData } from '@/contexts/TransferDataContext'
import { toast } from 'sonner'

interface ProfileSetupData {
    firstName: string
    lastName: string
    email: string
    currentCollege: string
    academicYear: string
    targetMajor: string
    transferTimeline: string
}

interface ProfileSetupFlowProps {
    onComplete: (profileData: ProfileSetupData) => void
    onSkip?: () => void
    isNewUser?: boolean
}

const STEPS = [
    { id: 'personal', title: 'Personal Info' },
    { id: 'academic', title: 'Academic Info' },
    { id: 'goals', title: 'Transfer Goals' }
]

export default function ProfileSetupFlow({ onComplete, onSkip, isNewUser = false }: ProfileSetupFlowProps) {
    const { state: authState } = useAuth()
    const { actions: transferActions } = useTransferData()
    const [currentStep, setCurrentStep] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [profileData, setProfileData] = useState<ProfileSetupData>({
        firstName: authState.user?.user_metadata?.firstName || '',
        lastName: authState.user?.user_metadata?.lastName || '',
        email: authState.user?.email || '',
        currentCollege: '',
        academicYear: '',
        targetMajor: '',
        transferTimeline: ''
    })

    const handleInputChange = (field: keyof ProfileSetupData, value: string) => {
        setProfileData(prev => ({ ...prev, [field]: value }))
    }

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            // Save profile data to transfer context
            await transferActions.setStudentProfile({
                completedCourses: [],
                mathLevel: 0,
                englishLevel: 0,
                scienceLevel: 0,
                transferCredits: 0,
                gpa: 0,
                targetMajor: profileData.targetMajor,
                targetUniversities: [],
                timeline: profileData.transferTimeline as '1-year' | '2-year' | 'flexible'
            })

            toast.success('Profile setup completed successfully!')
            onComplete(profileData)
        } catch (error) {
            console.error('Profile setup error:', error)
            toast.error('Failed to save profile. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const isStepValid = () => {
        switch (STEPS[currentStep].id) {
            case 'personal':
                return profileData.firstName && profileData.lastName && profileData.email
            case 'academic':
                return profileData.currentCollege && profileData.academicYear
            case 'goals':
                return profileData.targetMajor && profileData.transferTimeline
            default:
                return false
        }
    }

    const progress = ((currentStep + 1) / STEPS.length) * 100

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            {isNewUser ? 'Welcome to Transfer.ai!' : 'Complete Your Profile'}
                        </CardTitle>
                        <CardDescription>
                            {isNewUser
                                ? 'Let\'s set up your profile to get personalized recommendations'
                                : 'Update your profile information'
                            }
                        </CardDescription>
                    </div>
                    {onSkip && (
                        <Button variant="ghost" onClick={onSkip}>
                            Skip for now
                        </Button>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Step {currentStep + 1} of {STEPS.length}</span>
                        <span>{Math.round(progress)}% complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Step Content */}
                {STEPS[currentStep].id === 'personal' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                    id="firstName"
                                    value={profileData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    placeholder="Enter your first name"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input
                                    id="lastName"
                                    value={profileData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    placeholder="Enter your last name"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter your email"
                                required
                                disabled={!!authState.user?.email}
                            />
                            {authState.user?.email && (
                                <p className="text-sm text-gray-500 mt-1">Email from Google account</p>
                            )}
                        </div>
                    </div>
                )}

                {STEPS[currentStep].id === 'academic' && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="currentCollege">Current College *</Label>
                            <Select value={profileData.currentCollege} onValueChange={(value) => handleInputChange('currentCollege', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your current college" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="deanza">De Anza College</SelectItem>
                                    <SelectItem value="foothill">Foothill College</SelectItem>
                                    <SelectItem value="mission">Mission College</SelectItem>
                                    <SelectItem value="westvalley">West Valley College</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="academicYear">Academic Year *</Label>
                            <Select value={profileData.academicYear} onValueChange={(value) => handleInputChange('academicYear', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
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
                )}

                {STEPS[currentStep].id === 'goals' && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="targetMajor">Target Major *</Label>
                            <Select value={profileData.targetMajor} onValueChange={(value) => handleInputChange('targetMajor', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your target major" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="computer-science">Computer Science</SelectItem>
                                    <SelectItem value="business">Business Administration</SelectItem>
                                    <SelectItem value="engineering">Engineering</SelectItem>
                                    <SelectItem value="psychology">Psychology</SelectItem>
                                    <SelectItem value="biology">Biology</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="transferTimeline">Transfer Timeline *</Label>
                            <Select value={profileData.transferTimeline} onValueChange={(value) => handleInputChange('transferTimeline', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="When do you plan to transfer?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1-year">1 Year</SelectItem>
                                    <SelectItem value="2-year">2 Years</SelectItem>
                                    <SelectItem value="flexible">Flexible</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>

                    {currentStep === STEPS.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={!isStepValid() || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Complete Setup
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            disabled={!isStepValid()}
                        >
                            Next
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}