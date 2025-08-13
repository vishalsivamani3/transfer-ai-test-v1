import { supabase, isSupabaseConfigured } from './supabase'
import { TransferPathway } from '@/types'
import { generateMockTransferPathways, generateMockCourses } from './utils'

export interface TransferPathwayFilters {
  state?: string
  major?: string
  guaranteedTransfer?: boolean | string
  minGPA?: number
  timeline?: string
}

export async function fetchTransferPathways(filters: TransferPathwayFilters = {}): Promise<TransferPathway[]> {
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      // Use mock data if Supabase is not configured
      console.log('Using mock transfer pathways data')
      const mockData = generateMockTransferPathways()

      // Apply filters to mock data
      let filtered = mockData

      if (filters.state) {
        filtered = filtered.filter(pathway => pathway.state === filters.state)
      }
      if (filters.major) {
        filtered = filtered.filter(pathway =>
          pathway.major.toLowerCase().includes(filters.major!.toLowerCase())
        )
      }
      if (filters.guaranteedTransfer !== undefined) {
        filtered = filtered.filter(pathway => pathway.guaranteedTransfer === filters.guaranteedTransfer)
      }
      if (filters.minGPA) {
        filtered = filtered.filter(pathway =>
          pathway.minGPA && pathway.minGPA >= filters.minGPA!
        )
      }
      if (filters.timeline) {
        filtered = filtered.filter(pathway => pathway.timeline === filters.timeline)
      }

      return filtered
    }

    let query = supabase
      .from('transfer_pathways')
      .select('*')

    // Apply filters
    if (filters.state) {
      query = query.eq('state', filters.state)
    }
    if (filters.major) {
      query = query.ilike('major', `%${filters.major}%`)
    }
    if (filters.guaranteedTransfer !== undefined) {
      query = query.eq('guaranteed_transfer', filters.guaranteedTransfer)
    }
    if (filters.minGPA) {
      query = query.gte('min_gpa', filters.minGPA)
    }
    if (filters.timeline) {
      query = query.eq('timeline', filters.timeline)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching transfer pathways:', error)
      throw error
    }

    // Transform database format to frontend format
    return data?.map(pathway => ({
      id: pathway.id,
      targetUniversity: pathway.target_university,
      major: pathway.major,
      state: pathway.state,
      guaranteedTransfer: pathway.guaranteed_transfer,
      requirementsMet: pathway.requirements_met,
      totalRequirements: pathway.total_requirements,
      estimatedTransferCredits: pathway.estimated_transfer_credits,
      timeline: pathway.timeline,
      acceptanceRate: pathway.acceptance_rate,
      minGPA: pathway.min_gpa,
      applicationDeadline: pathway.application_deadline
    })) || []
  } catch (error) {
    console.error('Error in fetchTransferPathways:', error)
    return []
  }
}

// Student Profile Mutation Functions

export interface StudentProfileData {
  user_id: string
  email: string
  first_name: string
  last_name: string
  current_college: string
  academic_year: string
  intended_major?: string
  target_state?: string
  degree_goal?: string
  target_universities?: string[]
  preferred_transfer_timeline?: string
  current_gpa?: number
  completed_credits?: number
  transfer_goals?: string[]
  career_interests?: string[]
  onboarding_completed?: boolean
}

export interface StudentProfileUpdateData {
  intended_major?: string
  target_state?: string
  degree_goal?: string
  target_universities?: string[]
  preferred_transfer_timeline?: string
  current_gpa?: number
  completed_credits?: number
  transfer_goals?: string[]
  career_interests?: string[]
  onboarding_completed?: boolean
}

/**
 * Upsert (insert or update) a student profile
 * This function will create a new profile if it doesn't exist, or update it if it does
 */
export async function upsertStudentProfile(profileData: StudentProfileData) {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      return { success: true, data: profileData, error: null }
    }

    const { data, error } = await supabase
      .from('student_profiles')
      .upsert(profileData, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (error) {
      console.error('Error upserting student profile:', error)
      return { success: false, data: null, error }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error('Error in upsertStudentProfile:', error)
    return { success: false, data: null, error }
  }
}

/**
 * Update an existing student profile
 * This function will only update the provided fields
 */
export async function updateStudentProfile(userId: string, updateData: StudentProfileUpdateData) {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      return { success: true, data: { user_id: userId, ...updateData }, error: null }
    }

    const { data, error } = await supabase
      .from('student_profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating student profile:', error)
      return { success: false, data: null, error }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error('Error in updateStudentProfile:', error)
    return { success: false, data: null, error }
  }
}

/**
 * Get a student profile by user ID
 */
export async function getStudentProfile(userId: string) {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      // Return mock profile data
      const mockProfile = {
        id: 'mock-id',
        user_id: userId,
        email: 'student@example.com',
        first_name: 'Student',
        last_name: 'User',
        current_college: 'Community College',
        academic_year: 'sophomore',
        intended_major: 'Computer Science',
        target_state: 'California',
        degree_goal: 'Bachelor of Science',
        target_universities: ['UCLA', 'UC Berkeley'],
        preferred_transfer_timeline: '2-year',
        current_gpa: 3.45,
        completed_credits: 24,
        transfer_goals: ['Maximize transfer credits'],
        career_interests: ['Technology'],
        onboarding_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return { success: true, data: mockProfile, error: null }
    }

    const { data, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching student profile:', error)
      return { success: false, data: null, error }
    }

    return { success: true, data, error: null }
  } catch (error) {
    console.error('Error in getStudentProfile:', error)
    return { success: false, data: null, error }
  }
}

/**
 * Update specific fields for state, major, and degree goal
 * This is a convenience function for the specific use case
 */
export async function updateStudentGoals(
  userId: string,
  targetState: string,
  intendedMajor: string,
  degreeGoal: string
) {
  return updateStudentProfile(userId, {
    target_state: targetState,
    intended_major: intendedMajor,
    degree_goal: degreeGoal
  })
}

export async function fetchTransferPathwaysByUser(userId: string, filters: TransferPathwayFilters = {}): Promise<TransferPathway[]> {
  try {
    let query = supabase
      .from('transfer_pathways')
      .select('*')
      .eq('user_id', userId)

    // Apply filters
    if (filters.state) {
      query = query.eq('state', filters.state)
    }
    if (filters.major) {
      query = query.ilike('major', `%${filters.major}%`)
    }
    if (filters.guaranteedTransfer !== undefined) {
      query = query.eq('guaranteed_transfer', filters.guaranteedTransfer)
    }
    if (filters.minGPA) {
      query = query.gte('min_gpa', filters.minGPA)
    }
    if (filters.timeline) {
      query = query.eq('timeline', filters.timeline)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching user transfer pathways:', error)
      throw error
    }

    // Transform database format to frontend format
    return data?.map(pathway => ({
      id: pathway.id,
      targetUniversity: pathway.target_university,
      major: pathway.major,
      state: pathway.state,
      guaranteedTransfer: pathway.guaranteed_transfer,
      requirementsMet: pathway.requirements_met,
      totalRequirements: pathway.total_requirements,
      estimatedTransferCredits: pathway.estimated_transfer_credits,
      timeline: pathway.timeline,
      acceptanceRate: pathway.acceptance_rate,
      minGPA: pathway.min_gpa,
      applicationDeadline: pathway.application_deadline
    })) || []
  } catch (error) {
    console.error('Error in fetchTransferPathwaysByUser:', error)
    return []
  }
}

export async function getUniqueStates(): Promise<string[]> {
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      // Use mock data if Supabase is not configured
      const mockData = generateMockTransferPathways()
      const states = Array.from(new Set(mockData.map(item => item.state)))
      return states.sort()
    }

    const { data, error } = await supabase
      .from('transfer_pathways')
      .select('state')
      .not('state', 'is', null)

    if (error) {
      console.error('Error fetching unique states:', error)
      throw error
    }

    const states = Array.from(new Set(data?.map(item => item.state) || []))
    return states.sort()
  } catch (error) {
    console.error('Error in getUniqueStates:', error)
    // Fallback to mock data on error
    const mockData = generateMockTransferPathways()
    const states = Array.from(new Set(mockData.map(item => item.state)))
    return states.sort()
  }
}

export async function getUniqueMajors(): Promise<string[]> {
  try {
    // Check if Supabase is properly configured
    if (!isSupabaseConfigured()) {
      // Use mock data if Supabase is not configured
      const mockData = generateMockTransferPathways()
      const majors = Array.from(new Set(mockData.map(item => item.major)))
      return majors.sort()
    }

    const { data, error } = await supabase
      .from('transfer_pathways')
      .select('major')
      .not('major', 'is', null)

    if (error) {
      console.error('Error fetching unique majors:', error)
      throw error
    }

    const majors = Array.from(new Set(data?.map(item => item.major) || []))
    return majors.sort()
  } catch (error) {
    console.error('Error in getUniqueMajors:', error)
    // Fallback to mock data on error
    const mockData = generateMockTransferPathways()
    const majors = Array.from(new Set(mockData.map(item => item.major)))
    return majors.sort()
  }
}

// Course Query Functions

export interface Course {
  id: string
  institution: string
  courseCode: string
  courseName: string
  department: string
  credits: number
  description?: string
  prerequisites?: string[]
  corequisites?: string[]
  professorName?: string
  professorEmail?: string
  professorRmpId?: string
  professorRating?: number
  professorDifficulty?: number
  professorWouldTakeAgain?: number
  professorTotalRatings: number
  classTimes?: ClassTime[]
  location?: string
  capacity?: number
  enrolled: number
  waitlistCount: number
  semester: string
  academicYear: string
  transferCredits: boolean
  transferNotes?: string
  created_at?: string
  updated_at?: string
}

export interface ClassTime {
  days: string
  startTime: string
  endTime: string
  type: string
}

export interface CourseFilters {
  institution?: string
  department?: string
  courseCode?: string
  professorName?: string
  minRating?: number | string
  maxDifficulty?: number | string
  semester?: string
  academicYear?: string
  transferCredits?: boolean | string
  availableSeats?: boolean | string
}

/**
 * Fetch courses with filtering options
 */
export async function fetchCourses(filters: CourseFilters = {}): Promise<Course[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      return generateMockCourses()
    }

    let query = supabase
      .from('courses')
      .select('*')

    // Apply filters
    if (filters.institution) {
      query = query.eq('institution', filters.institution)
    }
    if (filters.department) {
      query = query.eq('department', filters.department)
    }
    if (filters.courseCode) {
      query = query.ilike('course_code', `%${filters.courseCode}%`)
    }
    if (filters.professorName) {
      query = query.ilike('professor_name', `%${filters.professorName}%`)
    }
    if (filters.minRating) {
      query = query.gte('professor_rating', filters.minRating)
    }
    if (filters.maxDifficulty) {
      query = query.lte('professor_difficulty', filters.maxDifficulty)
    }
    if (filters.semester) {
      query = query.eq('semester', filters.semester)
    }
    if (filters.academicYear) {
      query = query.eq('academic_year', filters.academicYear)
    }
    if (filters.transferCredits !== undefined) {
      query = query.eq('transfer_credits', filters.transferCredits)
    }
    if (filters.availableSeats) {
      // Note: This filter would need to be applied after fetching data
      // as Supabase doesn't support direct column comparison in filters
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching courses:', error)
      return []
    }

    // Transform database format to frontend format
    return data?.map(course => ({
      id: course.id,
      institution: course.institution,
      courseCode: course.course_code,
      courseName: course.course_name,
      department: course.department,
      credits: course.credits,
      description: course.description,
      prerequisites: course.prerequisites,
      corequisites: course.corequisites,
      professorName: course.professor_name,
      professorEmail: course.professor_email,
      professorRmpId: course.professor_rmp_id,
      professorRating: course.professor_rating,
      professorDifficulty: course.professor_difficulty,
      professorWouldTakeAgain: course.professor_would_take_again,
      professorTotalRatings: course.professor_total_ratings,
      classTimes: course.class_times ? JSON.parse(course.class_times) : [],
      location: course.location,
      capacity: course.capacity,
      enrolled: course.enrolled,
      waitlistCount: course.waitlist_count,
      semester: course.semester,
      academicYear: course.academic_year,
      transferCredits: course.transfer_credits,
      transferNotes: course.transfer_notes,
      created_at: course.created_at,
      updated_at: course.updated_at
    })) || []
  } catch (error) {
    console.error('Error in fetchCourses:', error)
    return []
  }
}

/**
 * Get unique institutions from courses
 */
export async function getUniqueInstitutions(): Promise<string[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      const mockCourses = generateMockCourses()
      const institutions = Array.from(new Set(mockCourses.map(course => course.institution)))
      return institutions.sort()
    }

    const { data, error } = await supabase
      .from('courses')
      .select('institution')
      .not('institution', 'is', null)

    if (error) {
      console.error('Error fetching unique institutions:', error)
      return []
    }

    const institutions = Array.from(new Set(data?.map(item => item.institution) || []))
    return institutions.sort()
  } catch (error) {
    console.error('Error in getUniqueInstitutions:', error)
    return []
  }
}

/**
 * Get unique departments from courses
 */
export async function getUniqueDepartments(): Promise<string[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      const mockCourses = generateMockCourses()
      const departments = Array.from(new Set(mockCourses.map(course => course.department)))
      return departments.sort()
    }

    const { data, error } = await supabase
      .from('courses')
      .select('department')
      .not('department', 'is', null)

    if (error) {
      console.error('Error fetching unique departments:', error)
      return []
    }

    const departments = Array.from(new Set(data?.map(item => item.department) || []))
    return departments.sort()
  } catch (error) {
    console.error('Error in getUniqueDepartments:', error)
    return []
  }
}

/**
 * Get unique semesters from courses
 */
export async function getUniqueSemesters(): Promise<string[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      const mockCourses = generateMockCourses()
      const semesters = Array.from(new Set(mockCourses.map(course => course.semester)))
      return semesters.sort()
    }

    const { data, error } = await supabase
      .from('courses')
      .select('semester')
      .not('semester', 'is', null)

    if (error) {
      console.error('Error fetching unique semesters:', error)
      return []
    }

    const semesters = Array.from(new Set(data?.map(item => item.semester) || []))
    return semesters.sort()
  } catch (error) {
    console.error('Error in getUniqueSemesters:', error)
    return []
  }
}

/**
 * Fetch professor ratings from RateMyProfessors API
 * Note: This is a mock implementation. In production, you'd need to integrate with the actual RMP API
 */
export async function fetchProfessorRating(professorName: string, institution: string): Promise<{
  rating?: number
  difficulty?: number
  wouldTakeAgain?: number
  totalRatings?: number
}> {
  try {
    // Mock implementation - in production, this would call the RateMyProfessors API
    // You would need to sign up for their API and implement proper authentication

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock data based on professor name
    const mockRatings: Record<string, any> = {
      'Dr. Sarah Johnson': { rating: 4.2, difficulty: 2.8, wouldTakeAgain: 0.85, totalRatings: 127 },
      'Prof. Michael Chen': { rating: 3.8, difficulty: 3.2, wouldTakeAgain: 0.72, totalRatings: 89 },
      'Dr. Emily Rodriguez': { rating: 4.5, difficulty: 3.5, wouldTakeAgain: 0.91, totalRatings: 156 },
      'Prof. David Kim': { rating: 3.9, difficulty: 3.8, wouldTakeAgain: 0.68, totalRatings: 94 },
      'Dr. Robert Wilson': { rating: 4.1, difficulty: 3.1, wouldTakeAgain: 0.78, totalRatings: 203 },
      'Prof. Lisa Thompson': { rating: 4.3, difficulty: 3.4, wouldTakeAgain: 0.82, totalRatings: 167 },
      'Dr. James Anderson': { rating: 4.0, difficulty: 3.6, wouldTakeAgain: 0.75, totalRatings: 142 },
      'Dr. Patricia Martinez': { rating: 4.4, difficulty: 3.3, wouldTakeAgain: 0.87, totalRatings: 178 },
      'Prof. Kevin O\'Brien': { rating: 3.7, difficulty: 3.7, wouldTakeAgain: 0.71, totalRatings: 134 },
      'Dr. Jennifer Lee': { rating: 4.2, difficulty: 2.5, wouldTakeAgain: 0.88, totalRatings: 245 },
      'Prof. Thomas Garcia': { rating: 3.9, difficulty: 2.8, wouldTakeAgain: 0.79, totalRatings: 198 },
      'Dr. Amanda Foster': { rating: 4.0, difficulty: 2.3, wouldTakeAgain: 0.85, totalRatings: 167 },
      'Prof. Christopher Brown': { rating: 4.1, difficulty: 2.6, wouldTakeAgain: 0.83, totalRatings: 145 }
    }

    return mockRatings[professorName] || {
      rating: Math.random() * 2 + 2.5, // Random rating between 2.5-4.5
      difficulty: Math.random() * 2 + 2.5, // Random difficulty between 2.5-4.5
      wouldTakeAgain: Math.random() * 0.4 + 0.6, // Random would take again between 0.6-1.0
      totalRatings: Math.floor(Math.random() * 200) + 50 // Random total ratings between 50-250
    }
  } catch (error) {
    console.error('Error fetching professor rating:', error)
    return {}
  }
}

/**
 * Update course with professor ratings
 */
export async function updateCourseWithProfessorRating(
  courseId: string,
  professorRating: number,
  professorDifficulty: number,
  professorWouldTakeAgain: number,
  professorTotalRatings: number
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, skipping update')
      return true
    }

    const { error } = await supabase
      .from('courses')
      .update({
        professor_rating: professorRating,
        professor_difficulty: professorDifficulty,
        professor_would_take_again: professorWouldTakeAgain,
        professor_total_ratings: professorTotalRatings
      })
      .eq('id', courseId)

    if (error) {
      console.error('Error updating course with professor rating:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateCourseWithProfessorRating:', error)
    return false
  }
} 