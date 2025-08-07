import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatGPA(gpa: number): string {
    return gpa.toFixed(2)
}

export function calculateProgress(completed: number, total: number): number {
    if (total === 0) return 0
    return Math.round((completed / total) * 100)
}

export function getAcademicYearLabel(year: string): string {
    const labels: Record<string, string> = {
        'freshman': 'Freshman',
        'sophomore': 'Sophomore',
        'returning': 'Returning Student'
    }
    return labels[year] || year
}

export function getTimelineLabel(timeline: string): string {
    const labels: Record<string, string> = {
        '1-year': '1 Year (Next Fall)',
        '2-year': '2 Years',
        'flexible': 'Flexible Timeline'
    }
    return labels[timeline] || timeline
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function validateGPA(gpa: number): boolean {
    return gpa >= 0 && gpa <= 4.0
}

export function validateCredits(credits: number): boolean {
    return credits >= 0 && credits <= 200
}

export function generateTransferPathways(profile: any) {
    // Mock transfer pathway generation
    const pathways = []
    const universities = profile.targetUniversities || []

    for (const university of universities) {
        pathways.push({
            id: `pathway-${university.toLowerCase().replace(/\s+/g, '-')}`,
            targetUniversity: university,
            major: profile.intendedMajor || 'Undeclared',
            guaranteedTransfer: Math.random() > 0.3,
            requirementsMet: Math.floor(Math.random() * 10) + 5,
            totalRequirements: 15,
            estimatedTransferCredits: Math.floor(Math.random() * 30) + 45,
            timeline: profile.preferredTransferTimeline || '2-year'
        })
    }

    return pathways
}

export function generateCourseRecommendations(profile: any) {
    // Mock course recommendations based on major and goals
    const recommendations: any[] = []
    const major = profile.intendedMajor?.toLowerCase() || ''

    const commonCourses = [
        { code: 'MATH-140', name: 'Pre-Calculus', credits: 4, priority: 'High' as const },
        { code: 'ENG-102', name: 'English Composition II', credits: 3, priority: 'High' as const },
        { code: 'BIO-110', name: 'General Biology I', credits: 4, priority: 'Medium' as const },
        { code: 'CHEM-101', name: 'General Chemistry I', credits: 4, priority: 'Medium' as const },
        { code: 'PSY-101', name: 'Introduction to Psychology', credits: 3, priority: 'Low' as const }
    ]

    if (major.includes('computer') || major.includes('cs')) {
        recommendations.push(
            { code: 'CS-101', name: 'Introduction to Programming', credits: 4, priority: 'High' as const },
            { code: 'MATH-150', name: 'Calculus I', credits: 4, priority: 'High' as const }
        )
    } else if (major.includes('business')) {
        recommendations.push(
            { code: 'BUS-101', name: 'Introduction to Business', credits: 3, priority: 'High' as const },
            { code: 'ECON-101', name: 'Principles of Economics', credits: 3, priority: 'High' as const }
        )
    }

    return [...commonCourses, ...recommendations]
} 