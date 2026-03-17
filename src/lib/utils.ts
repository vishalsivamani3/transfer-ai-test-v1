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
  const pathways = []
  const universities = profile.targetUniversities || []

  for (const university of universities) {
    const slug = university.toLowerCase().replace(/\s+/g, '-')
    pathways.push({
      id: `pathway-${slug}`,
      targetUniversity: university,
      targetUniversityCode: slug.toUpperCase().substring(0, 6),
      major: profile.intendedMajor || 'Undeclared',
      majorCode: (profile.intendedMajor || 'UNDECL').toUpperCase().substring(0, 6),
      state: 'California',
      guaranteedTransfer: Math.random() > 0.3,
      requirementsMet: Math.floor(Math.random() * 10) + 5,
      totalRequirements: 15,
      estimatedTransferCredits: Math.floor(Math.random() * 30) + 45,
      timeline: profile.preferredTransferTimeline || '2-year',
      acceptanceRate: Math.floor(Math.random() * 30) + 20,
      minGPA: 2.5 + Math.random() * 1.5,
      applicationDeadline: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      requiredCourses: [],
      recommendedCourses: [],
      igetcRequirements: [],
      tagEligibility: { isEligible: false },
      specialRequirements: []
    })
  }

  return pathways
}

export function generateMockTransferPathways() {
  // Return empty array since we're now using the comprehensive transfer-pathways.json data
  // This function is kept for backward compatibility but should not be used
  return []
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

export function generateMockCourses() {
  const courses = [
    // Computer Science Courses
    {
      id: 'cs-1-johnson',
      institution: 'Santa Monica College',
      courseCode: 'CS 1',
      courseName: 'Introduction to Computer Science',
      department: 'Computer Science',
      credits: 4,
      description: 'Fundamental concepts of computer programming and problem solving using Python.',
      prerequisites: ['Math 1'],
      professorName: 'Dr. Sarah Johnson',
      professorRating: 4.2,
      professorDifficulty: 2.8,
      professorWouldTakeAgain: 0.85,
      professorTotalRatings: 127,
      classTimes: [
        { days: 'MW', startTime: '09:00', endTime: '10:50', type: 'Lecture' },
        { days: 'F', startTime: '09:00', endTime: '11:50', type: 'Lab' }
      ],
      location: 'Science Building 101',
      capacity: 30,
      enrolled: 28,
      waitlistCount: 2,
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      transferCredits: true,
      transferNotes: 'Transfers to all UC and CSU campuses',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'cs-1-chen',
      institution: 'Santa Monica College',
      courseCode: 'CS 1',
      courseName: 'Introduction to Computer Science',
      department: 'Computer Science',
      credits: 4,
      description: 'Fundamental concepts of computer programming and problem solving using Python.',
      prerequisites: ['Math 1'],
      professorName: 'Prof. Michael Chen',
      professorRating: 3.8,
      professorDifficulty: 3.2,
      professorWouldTakeAgain: 0.72,
      professorTotalRatings: 89,
      classTimes: [
        { days: 'TTh', startTime: '14:00', endTime: '15:50', type: 'Lecture' },
        { days: 'F', startTime: '14:00', endTime: '16:50', type: 'Lab' }
      ],
      location: 'Science Building 102',
      capacity: 30,
      enrolled: 25,
      waitlistCount: 0,
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      transferCredits: true,
      transferNotes: 'Transfers to all UC and CSU campuses',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'cs-2-rodriguez',
      institution: 'Santa Monica College',
      courseCode: 'CS 2',
      courseName: 'Data Structures and Algorithms',
      department: 'Computer Science',
      credits: 4,
      description: 'Advanced programming concepts including data structures, algorithms, and object-oriented design.',
      prerequisites: ['CS 1'],
      professorName: 'Dr. Emily Rodriguez',
      professorRating: 4.5,
      professorDifficulty: 3.5,
      professorWouldTakeAgain: 0.91,
      professorTotalRatings: 156,
      classTimes: [
        { days: 'MW', startTime: '11:00', endTime: '12:50', type: 'Lecture' },
        { days: 'T', startTime: '11:00', endTime: '13:50', type: 'Lab' }
      ],
      location: 'Science Building 201',
      capacity: 25,
      enrolled: 22,
      waitlistCount: 1,
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      transferCredits: true,
      transferNotes: 'Transfers to all UC and CSU campuses',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    // Mathematics Courses
    {
      id: 'math-1-wilson',
      institution: 'Santa Monica College',
      courseCode: 'Math 1',
      courseName: 'Calculus I',
      department: 'Mathematics',
      credits: 5,
      description: 'Limits, continuity, differentiation, and applications of derivatives.',
      prerequisites: ['Precalculus'],
      professorName: 'Dr. Robert Wilson',
      professorRating: 4.1,
      professorDifficulty: 3.1,
      professorWouldTakeAgain: 0.78,
      professorTotalRatings: 203,
      classTimes: [
        { days: 'MWF', startTime: '08:00', endTime: '09:15', type: 'Lecture' },
        { days: 'TTh', startTime: '08:00', endTime: '09:50', type: 'Discussion' }
      ],
      location: 'Math Building 101',
      capacity: 35,
      enrolled: 32,
      waitlistCount: 3,
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      transferCredits: true,
      transferNotes: 'Transfers to all UC and CSU campuses',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'math-2-thompson',
      institution: 'Santa Monica College',
      courseCode: 'Math 2',
      courseName: 'Calculus II',
      department: 'Mathematics',
      credits: 5,
      description: 'Integration techniques, applications of integrals, and infinite series.',
      prerequisites: ['Math 1'],
      professorName: 'Prof. Lisa Thompson',
      professorRating: 4.3,
      professorDifficulty: 3.4,
      professorWouldTakeAgain: 0.82,
      professorTotalRatings: 167,
      classTimes: [
        { days: 'MWF', startTime: '10:00', endTime: '11:15', type: 'Lecture' },
        { days: 'TTh', startTime: '10:00', endTime: '11:50', type: 'Discussion' }
      ],
      location: 'Math Building 102',
      capacity: 30,
      enrolled: 28,
      waitlistCount: 2,
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      transferCredits: true,
      transferNotes: 'Transfers to all UC and CSU campuses',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    // Physics Courses
    {
      id: 'physics-1-martinez',
      institution: 'Santa Monica College',
      courseCode: 'Physics 1',
      courseName: 'Mechanics and Wave Motion',
      department: 'Physics',
      credits: 4,
      description: 'Classical mechanics, wave phenomena, and laboratory experiments.',
      prerequisites: ['Math 1'],
      professorName: 'Dr. Patricia Martinez',
      professorRating: 4.4,
      professorDifficulty: 3.3,
      professorWouldTakeAgain: 0.87,
      professorTotalRatings: 178,
      classTimes: [
        { days: 'MW', startTime: '13:00', endTime: '14:50', type: 'Lecture' },
        { days: 'T', startTime: '13:00', endTime: '15:50', type: 'Lab' }
      ],
      location: 'Physics Building 101',
      capacity: 28,
      enrolled: 26,
      waitlistCount: 1,
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      transferCredits: true,
      transferNotes: 'Transfers to all UC and CSU campuses',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    // English Courses
    {
      id: 'english-1-lee',
      institution: 'Santa Monica College',
      courseCode: 'English 1',
      courseName: 'Composition and Reading',
      department: 'English',
      credits: 4,
      description: 'College-level writing, critical reading, and analytical thinking.',
      prerequisites: [],
      professorName: 'Dr. Jennifer Lee',
      professorRating: 4.2,
      professorDifficulty: 2.5,
      professorWouldTakeAgain: 0.88,
      professorTotalRatings: 245,
      classTimes: [
        { days: 'MW', startTime: '10:00', endTime: '11:50', type: 'Lecture' }
      ],
      location: 'Humanities Building 101',
      capacity: 30,
      enrolled: 29,
      waitlistCount: 1,
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      transferCredits: true,
      transferNotes: 'Transfers to all UC and CSU campuses',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    // Business Courses
    {
      id: 'business-1-foster',
      institution: 'Santa Monica College',
      courseCode: 'Business 1',
      courseName: 'Introduction to Business',
      department: 'Business',
      credits: 3,
      description: 'Overview of business concepts, management, marketing, and economics.',
      prerequisites: [],
      professorName: 'Dr. Amanda Foster',
      professorRating: 4.0,
      professorDifficulty: 2.3,
      professorWouldTakeAgain: 0.85,
      professorTotalRatings: 167,
      classTimes: [
        { days: 'MWF', startTime: '14:00', endTime: '15:15', type: 'Lecture' }
      ],
      location: 'Business Building 101',
      capacity: 35,
      enrolled: 33,
      waitlistCount: 2,
      semester: 'Fall 2024',
      academicYear: '2024-2025',
      transferCredits: true,
      transferNotes: 'Transfers to all UC and CSU campuses',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  return courses
} 