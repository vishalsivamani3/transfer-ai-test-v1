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
      state: 'California',
      guaranteedTransfer: Math.random() > 0.3,
      requirementsMet: Math.floor(Math.random() * 10) + 5,
      totalRequirements: 15,
      estimatedTransferCredits: Math.floor(Math.random() * 30) + 45,
      timeline: profile.preferredTransferTimeline || '2-year',
      acceptanceRate: Math.floor(Math.random() * 30) + 20,
      minGPA: 2.5 + Math.random() * 1.5,
      applicationDeadline: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  return pathways
}

export function generateMockTransferPathways() {
  const universities = [
    { name: 'UCLA', state: 'California', acceptanceRate: 12.4 },
    { name: 'UC Berkeley', state: 'California', acceptanceRate: 14.4 },
    { name: 'UC San Diego', state: 'California', acceptanceRate: 34.3 },
    { name: 'UC Irvine', state: 'California', acceptanceRate: 28.7 },
    { name: 'UC Davis', state: 'California', acceptanceRate: 46.3 },
    { name: 'UC Santa Barbara', state: 'California', acceptanceRate: 29.2 },
    { name: 'UC Riverside', state: 'California', acceptanceRate: 65.8 },
    { name: 'UC Merced', state: 'California', acceptanceRate: 85.4 },
    { name: 'UC Santa Cruz', state: 'California', acceptanceRate: 47.1 },
    { name: 'USC', state: 'California', acceptanceRate: 11.4 },
    { name: 'Stanford University', state: 'California', acceptanceRate: 4.3 },
    { name: 'Caltech', state: 'California', acceptanceRate: 3.9 },
    { name: 'University of Washington', state: 'Washington', acceptanceRate: 53.5 },
    { name: 'University of Oregon', state: 'Oregon', acceptanceRate: 83.4 },
    { name: 'University of Arizona', state: 'Arizona', acceptanceRate: 85.1 },
    { name: 'Arizona State University', state: 'Arizona', acceptanceRate: 88.2 },
    { name: 'University of Nevada, Reno', state: 'Nevada', acceptanceRate: 88.1 },
    { name: 'University of Utah', state: 'Utah', acceptanceRate: 79.4 },
    { name: 'University of Colorado Boulder', state: 'Colorado', acceptanceRate: 78.9 },
    { name: 'University of Texas at Austin', state: 'Texas', acceptanceRate: 31.8 }
  ]

  const majors = [
    'Computer Science',
    'Engineering',
    'Business Administration',
    'Psychology',
    'Biology',
    'Chemistry',
    'Mathematics',
    'Physics',
    'Economics',
    'Political Science',
    'English',
    'History',
    'Sociology',
    'Anthropology',
    'Environmental Science',
    'Nursing',
    'Pre-Medicine',
    'Pre-Law',
    'Art History',
    'Film Studies'
  ]

  const pathways = []

  for (let i = 0; i < 50; i++) {
    const university = universities[Math.floor(Math.random() * universities.length)]
    const major = majors[Math.floor(Math.random() * majors.length)]
    const guaranteedTransfer = Math.random() > 0.4
    const requirementsMet = Math.floor(Math.random() * 12) + 3
    const totalRequirements = 15
    const timeline = ['1-year', '2-year', 'flexible'][Math.floor(Math.random() * 3)]
    
    pathways.push({
      id: `pathway-${i}`,
      targetUniversity: university.name,
      major: major,
      state: university.state,
      guaranteedTransfer: guaranteedTransfer,
      requirementsMet: requirementsMet,
      totalRequirements: totalRequirements,
      estimatedTransferCredits: Math.floor(Math.random() * 40) + 30,
      timeline: timeline,
      acceptanceRate: university.acceptanceRate + (Math.random() - 0.5) * 10,
      minGPA: 2.0 + Math.random() * 2.0,
      applicationDeadline: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
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