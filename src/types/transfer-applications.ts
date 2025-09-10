export interface TransferApplication {
    id: string
    userId: string
    universityName: string
    universityType: 'UC' | 'CSU' | 'Private' | 'Out-of-State'
    major: string
    applicationDeadline: string
    status: 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected' | 'Waitlisted'
    priority: 'High' | 'Medium' | 'Low'
    notes?: string
    requirements: ApplicationRequirement[]
    documents: ApplicationDocument[]
    createdAt: string
    updatedAt: string
}

export interface ApplicationRequirement {
    id: string
    name: string
    description: string
    completed: boolean
    dueDate?: string
    notes?: string
}

export interface ApplicationDocument {
    id: string
    name: string
    type: 'Transcript' | 'Personal Statement' | 'Letters of Recommendation' | 'Test Scores' | 'Portfolio' | 'Other'
    status: 'Not Started' | 'In Progress' | 'Completed' | 'Submitted'
    dueDate?: string
    notes?: string
}

export interface ApplicationProgress {
    totalApplications: number
    completedApplications: number
    inProgressApplications: number
    upcomingDeadlines: number
    completionRate: number
}

export interface UniversityInfo {
    id: string
    name: string
    type: 'UC' | 'CSU' | 'Private' | 'Out-of-State'
    location: string
    acceptanceRate?: number
    averageGPA?: number
    popularMajors: string[]
    applicationDeadline: string
    transferRequirements: string[]
}