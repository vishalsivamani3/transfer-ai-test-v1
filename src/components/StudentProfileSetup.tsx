'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTransferData, StudentAcademicProfile } from '@/contexts/TransferDataContext'
import { toast } from 'sonner'
import { User, GraduationCap, BookOpen, Target } from 'lucide-react'

interface StudentProfileSetupProps {
    onComplete?: () => void
}

export default function StudentProfileSetup({ onComplete }: StudentProfileSetupProps) {
    const { state, actions } = useTransferData()
    const [profile, setProfile] = useState<Partial<StudentAcademicProfile>>({
        completedCourses: [],
        mathLevel: 0,
        englishLevel: 0,
        scienceLevel: 0,
        transferCredits: 0,
        gpa: 0.0,
        targetMajor: '',
        targetUniversities: [],
        timeline: '2-year'
    })
    const [newCourse, setNewCourse] = useState('')

    const handleSaveProfile = () => {
        if (!profile.targetMajor) {
            toast.error('Please specify your target major')
            return
        }

        const fullProfile: StudentAcademicProfile = {
            completedCourses: profile.completedCourses || [],
            mathLevel: profile.mathLevel || 0,
            englishLevel: profile.englishLevel || 0,
            scienceLevel: profile.scienceLevel || 0,
            transferCredits: profile.transferCredits || 0,
            gpa: profile.gpa || 0.0,
            targetMajor: profile.targetMajor,
            targetUniversities: profile.targetUniversities || [],
            timeline: profile.timeline || '2-year'
        }

        actions.setStudentProfile(fullProfile)
        toast.success('Student profile saved successfully!')
        onComplete?.()
    }

    const addCompletedCourse = () => {
        if (newCourse.trim() && !profile.completedCourses?.includes(newCourse.trim())) {
            setProfile(prev => ({
                ...prev,
                completedCourses: [...(prev.completedCourses || []), newCourse.trim()]
            }))
            setNewCourse('')
        }
    }

    const removeCompletedCourse = (course: string) => {
        setProfile(prev => ({
            ...prev,
            completedCourses: prev.completedCourses?.filter(c => c !== course) || []
        }))
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Set Up Your Academic Profile
                </CardTitle>
                <CardDescription>
                    Help us provide better course recommendations by telling us about your academic background
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Target Major */}
                <div>
                    <Label htmlFor="targetMajor">Target Major *</Label>
                    <Input
                        id="targetMajor"
                        placeholder="e.g., Computer Science, Mathematics, Business"
                        value={profile.targetMajor}
                        onChange={(e) => setProfile(prev => ({ ...prev, targetMajor: e.target.value }))}
                    />
                </div>

                {/* Academic Levels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <Label htmlFor="mathLevel">Math Level</Label>
                        <Select value={profile.mathLevel?.toString()} onValueChange={(value) => setProfile(prev => ({ ...prev, mathLevel: parseInt(value) }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select math level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">No math background</SelectItem>
                                <SelectItem value="1">Basic math</SelectItem>
                                <SelectItem value="2">Algebra</SelectItem>
                                <SelectItem value="3">Precalculus</SelectItem>
                                <SelectItem value="4">Calculus I</SelectItem>
                                <SelectItem value="5">Calculus II</SelectItem>
                                <SelectItem value="6">Calculus III</SelectItem>
                                <SelectItem value="7">Advanced math</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="englishLevel">English Level</Label>
                        <Select value={profile.englishLevel?.toString()} onValueChange={(value) => setProfile(prev => ({ ...prev, englishLevel: parseInt(value) }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select English level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">No college English</SelectItem>
                                <SelectItem value="1">English 1A</SelectItem>
                                <SelectItem value="2">English 1B</SelectItem>
                                <SelectItem value="3">English 1C</SelectItem>
                                <SelectItem value="4">Advanced English</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="scienceLevel">Science Level</Label>
                        <Select value={profile.scienceLevel?.toString()} onValueChange={(value) => setProfile(prev => ({ ...prev, scienceLevel: parseInt(value) }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select science level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">No college science</SelectItem>
                                <SelectItem value="1">General science</SelectItem>
                                <SelectItem value="2">Physics I</SelectItem>
                                <SelectItem value="3">Physics II</SelectItem>
                                <SelectItem value="4">Chemistry I</SelectItem>
                                <SelectItem value="5">Chemistry II</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Transfer Credits and GPA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="transferCredits">Transfer Credits Earned</Label>
                        <Input
                            id="transferCredits"
                            type="number"
                            placeholder="0"
                            value={profile.transferCredits}
                            onChange={(e) => setProfile(prev => ({ ...prev, transferCredits: parseInt(e.target.value) || 0 }))}
                        />
                    </div>

                    <div>
                        <Label htmlFor="gpa">Current GPA</Label>
                        <Input
                            id="gpa"
                            type="number"
                            step="0.1"
                            min="0"
                            max="4"
                            placeholder="0.0"
                            value={profile.gpa}
                            onChange={(e) => setProfile(prev => ({ ...prev, gpa: parseFloat(e.target.value) || 0 }))}
                        />
                    </div>
                </div>

                {/* Completed Courses */}
                <div>
                    <Label>Completed Courses</Label>
                    <div className="flex gap-2 mb-2">
                        <Input
                            placeholder="e.g., MATH 1A, ENGL 1A"
                            value={newCourse}
                            onChange={(e) => setNewCourse(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCompletedCourse()}
                        />
                        <Button onClick={addCompletedCourse} size="sm">
                            Add
                        </Button>
                    </div>
                    {profile.completedCourses && profile.completedCourses.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {profile.completedCourses.map((course, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                    {course}
                                    <button
                                        onClick={() => removeCompletedCourse(course)}
                                        className="ml-1 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Timeline */}
                <div>
                    <Label htmlFor="timeline">Transfer Timeline</Label>
                    <Select value={profile.timeline} onValueChange={(value: any) => setProfile(prev => ({ ...prev, timeline: value }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1-year">1 year</SelectItem>
                            <SelectItem value="2-year">2 years</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Info Alert */}
                <Alert>
                    <Target className="h-4 w-4" />
                    <AlertDescription>
                        This profile helps us recommend appropriate courses and prevent suggesting advanced courses
                        (like Topology) to students without the necessary prerequisites (like Calculus).
                    </AlertDescription>
                </Alert>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => onComplete?.()}>
                        Skip for now
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={!profile.targetMajor}>
                        Save Profile
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}