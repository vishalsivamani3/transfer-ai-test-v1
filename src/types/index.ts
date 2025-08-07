export interface User {
    id: string
    email: string
    user_metadata: {
        firstName?: string
        lastName?: string
        currentCollege?: string
        academicYear?: string
    }
}

export interface StudentProfile {
    userId: string
    email: string
    firstName: string
    lastName: string
    currentCollege: string
    academicYear: string
    onboardingCompleted: boolean
    intendedMajor?: string
    targetUniversities?: string[]
    preferredTransferTimeline?: string
    currentGPA?: number
    completedCredits?: number
    transferGoals?: string[]
    careerInterests?: string[]
    completedCourses?: Course[]
    currentCourses?: Course[]
    plannedCourses?: Course[]
}

export interface Course {
    id: string
    code: string
    name: string
    credits: number
    grade?: string
    semester?: string
    year?: number
    status: 'completed' | 'in_progress' | 'planned'
    professor?: string
    rating?: number
    transferCredits?: number
}

export interface TransferPathway {
    id: string
    targetUniversity: string
    major: string
    guaranteedTransfer: boolean
    requirementsMet: number
    totalRequirements: number
    estimatedTransferCredits: number
    timeline: string
}

export interface CourseRecommendation {
    code: string
    name: string
    professor?: string
    rating?: number
    credits: number
    priority: 'High' | 'Medium' | 'Low'
    description?: string
}

export interface DashboardData {
    profile: StudentProfile
    analysis: any
    courseRecommendations: CourseRecommendation[]
    progressMetrics: {
        creditsCompleted: number
        targetCredits: number
        gpa: number
        coursesInProgress: number
        transferPathwaysAnalyzed: number
    }
    transferPathways: TransferPathway[]
}

export interface OnboardingData {
    intendedMajor: string
    targetUniversities: string[]
    preferredTransferTimeline: string
    currentGPA: number
    completedCredits: number
    transferGoals: string[]
    careerInterests: string[]
}

export interface AuthFormData {
    email: string
    password: string
    firstName?: string
    lastName?: string
    currentCollege?: string
    academicYear?: string
} 