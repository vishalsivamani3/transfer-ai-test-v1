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

// Student Plan Management Functions

export interface StudentPlan {
  id: string
  userId: string
  planName: string
  transferTimeline: '1-year' | '2-year'
  targetMajor?: string
  targetUniversities?: string[]
  totalCreditsPlanned: number
  totalCreditsCompleted: number
  planStatus: 'draft' | 'active' | 'completed'
  createdAt: string
  updatedAt: string
  isDefault: boolean
  semesters?: PlanSemester[]
}

export interface PlanSemester {
  id: string
  planId: string
  semesterName: string
  semesterOrder: number
  academicYear: string
  semesterType: 'fall' | 'spring' | 'summer'
  totalCredits: number
  createdAt: string
  updatedAt: string
  courses?: PlanCourse[]
}

export interface PlanCourse {
  id: string
  planId: string
  semesterId: string
  courseId: string
  positionOrder: number
  status: 'planned' | 'enrolled' | 'completed' | 'dropped'
  grade?: string
  notes?: string
  createdAt: string
  updatedAt: string
  course?: Course
}

export interface PlanCourseWithDetails extends PlanCourse {
  course: Course
}

export interface CreatePlanData {
  planName: string
  transferTimeline: '1-year' | '2-year'
  targetMajor?: string
  targetUniversities?: string[]
}

/**
 * Create a new student plan with default semesters
 */
export async function createStudentPlan(
  userId: string,
  planData: CreatePlanData
): Promise<StudentPlan | null> {
  try {
    console.log('createStudentPlan called with:', { userId, planData })

    if (!isSupabaseConfigured()) {
      console.log('Using mock data for createStudentPlan')
      return createMockStudentPlan(userId, planData)
    }

    // Create the plan
    const { data: plan, error: planError } = await supabase
      .from('student_plans')
      .insert({
        user_id: userId,
        plan_name: planData.planName,
        transfer_timeline: planData.transferTimeline,
        target_major: planData.targetMajor,
        target_universities: planData.targetUniversities,
        is_default: true // Set as default plan
      })
      .select()
      .single()

    if (planError) {
      console.error('Error creating plan:', planError)
      return null
    }

    // Create default semesters based on timeline
    const currentYear = new Date().getFullYear()
    const semesters = planData.transferTimeline === '1-year'
      ? [
        { name: `Fall ${currentYear}`, order: 1, year: `${currentYear}-${currentYear + 1}`, type: 'fall' },
        { name: `Spring ${currentYear + 1}`, order: 2, year: `${currentYear}-${currentYear + 1}`, type: 'spring' }
      ]
      : [
        { name: `Fall ${currentYear}`, order: 1, year: `${currentYear}-${currentYear + 1}`, type: 'fall' },
        { name: `Spring ${currentYear + 1}`, order: 2, year: `${currentYear}-${currentYear + 1}`, type: 'spring' },
        { name: `Fall ${currentYear + 1}`, order: 3, year: `${currentYear + 1}-${currentYear + 2}`, type: 'fall' },
        { name: `Spring ${currentYear + 2}`, order: 4, year: `${currentYear + 1}-${currentYear + 2}`, type: 'spring' }
      ]

    const semesterInserts = semesters.map(sem => ({
      plan_id: plan.id,
      semester_name: sem.name,
      semester_order: sem.order,
      academic_year: sem.year,
      semester_type: sem.type
    }))

    const { error: semesterError } = await supabase
      .from('student_plan_semesters')
      .insert(semesterInserts)

    if (semesterError) {
      console.error('Error creating semesters:', semesterError)
      return null
    }

    return {
      id: plan.id,
      userId: plan.user_id,
      planName: plan.plan_name,
      transferTimeline: plan.transfer_timeline,
      targetMajor: plan.target_major,
      targetUniversities: plan.target_universities,
      totalCreditsPlanned: plan.total_credits_planned,
      totalCreditsCompleted: plan.total_credits_completed,
      planStatus: plan.plan_status,
      createdAt: plan.created_at,
      updatedAt: plan.updated_at,
      isDefault: plan.is_default
    }
  } catch (error) {
    console.error('Error in createStudentPlan:', error)
    return null
  }
}

/**
 * Get all plans for a student
 */
export async function getStudentPlans(userId: string): Promise<StudentPlan[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Using mock data for getStudentPlans')
      return getMockStudentPlans(userId)
    }

    const { data, error } = await supabase
      .from('student_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching student plans:', error)
      return []
    }

    return data?.map(plan => ({
      id: plan.id,
      userId: plan.user_id,
      planName: plan.plan_name,
      transferTimeline: plan.transfer_timeline,
      targetMajor: plan.target_major,
      targetUniversities: plan.target_universities,
      totalCreditsPlanned: plan.total_credits_planned,
      totalCreditsCompleted: plan.total_credits_completed,
      planStatus: plan.plan_status,
      createdAt: plan.created_at,
      updatedAt: plan.updated_at,
      isDefault: plan.is_default
    })) || []
  } catch (error) {
    console.error('Error in getStudentPlans:', error)
    return []
  }
}

/**
 * Get a complete plan with semesters and courses
 */
export async function getStudentPlanWithDetails(planId: string): Promise<StudentPlan | null> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Using mock data for getStudentPlanWithDetails')
      return getMockStudentPlanWithDetails(planId)
    }

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('student_plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError) {
      console.error('Error fetching plan:', planError)
      return null
    }

    // Get semesters with courses
    const { data: semesters, error: semesterError } = await supabase
      .from('student_plan_semesters')
      .select(`
        *,
        student_plan_courses (
          *,
          course:courses(*)
        )
      `)
      .eq('plan_id', planId)
      .order('semester_order', { ascending: true })

    if (semesterError) {
      console.error('Error fetching semesters:', semesterError)
      return null
    }

    const planWithDetails: StudentPlan = {
      id: plan.id,
      userId: plan.user_id,
      planName: plan.plan_name,
      transferTimeline: plan.transfer_timeline,
      targetMajor: plan.target_major,
      targetUniversities: plan.target_universities,
      totalCreditsPlanned: plan.total_credits_planned,
      totalCreditsCompleted: plan.total_credits_completed,
      planStatus: plan.plan_status,
      createdAt: plan.created_at,
      updatedAt: plan.updated_at,
      isDefault: plan.is_default,
      semesters: semesters?.map(semester => ({
        id: semester.id,
        planId: semester.plan_id,
        semesterName: semester.semester_name,
        semesterOrder: semester.semester_order,
        academicYear: semester.academic_year,
        semesterType: semester.semester_type,
        totalCredits: semester.total_credits,
        createdAt: semester.created_at,
        updatedAt: semester.updated_at,
        courses: semester.student_plan_courses?.map((course: any) => ({
          id: course.id,
          planId: course.plan_id,
          semesterId: course.semester_id,
          courseId: course.course_id,
          positionOrder: course.position_order,
          status: course.status,
          grade: course.grade,
          notes: course.notes,
          createdAt: course.created_at,
          updatedAt: course.updated_at,
          course: course.course ? {
            id: course.course.id,
            institution: course.course.institution,
            courseCode: course.course.course_code,
            courseName: course.course.course_name,
            department: course.course.department,
            credits: course.course.credits,
            description: course.course.description,
            prerequisites: course.course.prerequisites,
            corequisites: course.course.corequisites,
            professorName: course.course.professor_name,
            professorEmail: course.course.professor_email,
            professorRmpId: course.course.professor_rmp_id,
            professorRating: course.course.professor_rating,
            professorDifficulty: course.course.professor_difficulty,
            professorWouldTakeAgain: course.course.professor_would_take_again,
            professorTotalRatings: course.course.professor_total_ratings,
            classTimes: course.course.class_times ? JSON.parse(course.course.class_times) : [],
            location: course.course.location,
            capacity: course.course.capacity,
            enrolled: course.course.enrolled,
            waitlistCount: course.course.waitlist_count,
            semester: course.course.semester,
            academicYear: course.course.academic_year,
            transferCredits: course.course.transfer_credits,
            transferNotes: course.course.transfer_notes,
            created_at: course.course.created_at,
            updated_at: course.course.updated_at
          } : undefined
        })).sort((a: any, b: any) => a.positionOrder - b.positionOrder) || []
      })) || []
    }

    return planWithDetails
  } catch (error) {
    console.error('Error in getStudentPlanWithDetails:', error)
    return null
  }
}

/**
 * Add a course to a semester in a plan
 */
export async function addCourseToPlan(
  planId: string,
  semesterId: string,
  courseId: string,
  positionOrder: number
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Using mock data for addCourseToPlan')
      return addMockCourseToPlan(planId, semesterId, courseId)
    }

    const { error } = await supabase
      .from('student_plan_courses')
      .insert({
        plan_id: planId,
        semester_id: semesterId,
        course_id: courseId,
        position_order: positionOrder,
        status: 'planned'
      })

    if (error) {
      console.error('Error adding course to plan:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in addCourseToPlan:', error)
    return false
  }
}

/**
 * Remove a course from a plan
 */
export async function removeCourseFromPlan(
  planId: string,
  semesterId: string,
  courseId: string
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Using mock data for removeCourseFromPlan')
      return removeMockCourseFromPlan(planId, semesterId, courseId)
    }

    const { error } = await supabase
      .from('student_plan_courses')
      .delete()
      .eq('plan_id', planId)
      .eq('semester_id', semesterId)
      .eq('course_id', courseId)

    if (error) {
      console.error('Error removing course from plan:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in removeCourseFromPlan:', error)
    return false
  }
}

/**
 * Update course position in plan (for drag-and-drop)
 */
export async function updateCoursePosition(
  planId: string,
  semesterId: string,
  courseId: string,
  newPositionOrder: number
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      return true
    }

    const { error } = await supabase
      .from('student_plan_courses')
      .update({ position_order: newPositionOrder })
      .eq('plan_id', planId)
      .eq('semester_id', semesterId)
      .eq('course_id', courseId)

    if (error) {
      console.error('Error updating course position:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateCoursePosition:', error)
    return false
  }
}

/**
 * Move course between semesters
 */
export async function moveCourseBetweenSemesters(
  planId: string,
  courseId: string,
  fromSemesterId: string,
  toSemesterId: string,
  newPositionOrder: number
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      return true
    }

    const { error } = await supabase
      .from('student_plan_courses')
      .update({
        semester_id: toSemesterId,
        position_order: newPositionOrder
      })
      .eq('plan_id', planId)
      .eq('semester_id', fromSemesterId)
      .eq('course_id', courseId)

    if (error) {
      console.error('Error moving course between semesters:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in moveCourseBetweenSemesters:', error)
    return false
  }
}

/**
 * Update plan status
 */
export async function updatePlanStatus(
  planId: string,
  status: 'draft' | 'active' | 'completed'
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      return true
    }

    const { error } = await supabase
      .from('student_plans')
      .update({ plan_status: status })
      .eq('id', planId)

    if (error) {
      console.error('Error updating plan status:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updatePlanStatus:', error)
    return false
  }
}

/**
 * Delete a plan and all its semesters and courses
 */
export async function deleteStudentPlan(planId: string): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      return true
    }

    const { error } = await supabase
      .from('student_plans')
      .delete()
      .eq('id', planId)

    if (error) {
      console.error('Error deleting plan:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteStudentPlan:', error)
    return false
  }
}

// Student Course Selection Functions

export interface StudentCourse {
  id: string
  userId: string
  courseId: string
  status: 'selected' | 'enrolled' | 'completed' | 'dropped'
  selectionDate: string
  enrollmentDate?: string
  completionDate?: string
  grade?: string
  notes?: string
  priority: number
  createdAt: string
  updatedAt: string
  course?: Course // Include full course details when needed
}

export interface StudentCourseWithDetails extends StudentCourse {
  course: Course
}

/**
 * Add a course to student's selections
 */
export async function addStudentCourse(
  userId: string,
  courseId: string,
  priority: number = 1,
  notes?: string
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      return true // Mock success
    }

    const { error } = await supabase
      .from('student_courses')
      .insert({
        user_id: userId,
        course_id: courseId,
        priority,
        notes,
        status: 'selected'
      })

    if (error) {
      console.error('Error adding student course:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in addStudentCourse:', error)
    return false
  }
}

/**
 * Remove a course from student's selections
 */
export async function removeStudentCourse(
  userId: string,
  courseId: string
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      return true // Mock success
    }

    const { error } = await supabase
      .from('student_courses')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId)

    if (error) {
      console.error('Error removing student course:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in removeStudentCourse:', error)
    return false
  }
}

/**
 * Update student course status
 */
export async function updateStudentCourseStatus(
  userId: string,
  courseId: string,
  status: 'selected' | 'enrolled' | 'completed' | 'dropped',
  grade?: string,
  notes?: string
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      return true // Mock success
    }

    const updateData: any = { status }

    if (status === 'enrolled') {
      updateData.enrollment_date = new Date().toISOString()
    } else if (status === 'completed') {
      updateData.completion_date = new Date().toISOString()
    }

    if (grade) updateData.grade = grade
    if (notes) updateData.notes = notes

    const { error } = await supabase
      .from('student_courses')
      .update(updateData)
      .eq('user_id', userId)
      .eq('course_id', courseId)

    if (error) {
      console.error('Error updating student course status:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateStudentCourseStatus:', error)
    return false
  }
}

/**
 * Get all courses selected by a student
 */
export async function getStudentCourses(userId: string): Promise<StudentCourseWithDetails[]> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      return [] // Return empty array for mock data
    }

    const { data, error } = await supabase
      .from('student_courses')
      .select(`
        *,
        course:courses(*)
      `)
      .eq('user_id', userId)
      .order('priority', { ascending: true })
      .order('selection_date', { ascending: false })

    if (error) {
      console.error('Error fetching student courses:', error)
      return []
    }

    return data?.map(item => ({
      id: item.id,
      userId: item.user_id,
      courseId: item.course_id,
      status: item.status,
      selectionDate: item.selection_date,
      enrollmentDate: item.enrollment_date,
      completionDate: item.completion_date,
      grade: item.grade,
      notes: item.notes,
      priority: item.priority,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      course: {
        id: item.course.id,
        institution: item.course.institution,
        courseCode: item.course.course_code,
        courseName: item.course.course_name,
        department: item.course.department,
        credits: item.course.credits,
        description: item.course.description,
        prerequisites: item.course.prerequisites,
        corequisites: item.course.corequisites,
        professorName: item.course.professor_name,
        professorEmail: item.course.professor_email,
        professorRmpId: item.course.professor_rmp_id,
        professorRating: item.course.professor_rating,
        professorDifficulty: item.course.professor_difficulty,
        professorWouldTakeAgain: item.course.professor_would_take_again,
        professorTotalRatings: item.course.professor_total_ratings,
        classTimes: item.course.class_times ? JSON.parse(item.course.class_times) : [],
        location: item.course.location,
        capacity: item.course.capacity,
        enrolled: item.course.enrolled,
        waitlistCount: item.course.waitlist_count,
        semester: item.course.semester,
        academicYear: item.course.academic_year,
        transferCredits: item.course.transfer_credits,
        transferNotes: item.course.transfer_notes,
        created_at: item.course.created_at,
        updated_at: item.course.updated_at
      }
    })) || []
  } catch (error) {
    console.error('Error in getStudentCourses:', error)
    return []
  }
}

/**
 * Check if a course is selected by a student
 */
export async function isCourseSelected(
  userId: string,
  courseId: string
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      return false // Mock not selected
    }

    const { data, error } = await supabase
      .from('student_courses')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking if course is selected:', error)
      return false
    }

    return !!data
  } catch (error) {
    console.error('Error in isCourseSelected:', error)
    return false
  }
}

/**
 * Update course priority
 */
export async function updateCoursePriority(
  userId: string,
  courseId: string,
  priority: number
): Promise<boolean> {
  try {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data')
      return true // Mock success
    }

    const { error } = await supabase
      .from('student_courses')
      .update({ priority })
      .eq('user_id', userId)
      .eq('course_id', courseId)

    if (error) {
      console.error('Error updating course priority:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in updateCoursePriority:', error)
    return false
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

// ============================================================================
// MOCK DATA FUNCTIONS - These can be easily swapped out when Supabase is ready
// ============================================================================

// In-memory storage for mock data
let mockPlans: StudentPlan[] = []
let mockPlanSemesters: PlanSemester[] = []
let mockPlanCourses: PlanCourse[] = []

/**
 * Create a mock student plan with default semesters
 */
function createMockStudentPlan(userId: string, planData: CreatePlanData): StudentPlan {
  const planId = `mock-plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const currentYear = new Date().getFullYear()

  // Create the plan
  const plan: StudentPlan = {
    id: planId,
    userId,
    planName: planData.planName,
    transferTimeline: planData.transferTimeline,
    targetMajor: planData.targetMajor,
    targetUniversities: planData.targetUniversities,
    totalCreditsPlanned: 0,
    totalCreditsCompleted: 0,
    planStatus: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDefault: true,
    semesters: []
  }

  // Create default semesters
  const semesters = planData.transferTimeline === '1-year'
    ? [
      { name: `Fall ${currentYear}`, order: 1, year: `${currentYear}-${currentYear + 1}`, type: 'fall' },
      { name: `Spring ${currentYear + 1}`, order: 2, year: `${currentYear}-${currentYear + 1}`, type: 'spring' }
    ]
    : [
      { name: `Fall ${currentYear}`, order: 1, year: `${currentYear}-${currentYear + 1}`, type: 'fall' },
      { name: `Spring ${currentYear + 1}`, order: 2, year: `${currentYear}-${currentYear + 1}`, type: 'spring' },
      { name: `Fall ${currentYear + 1}`, order: 3, year: `${currentYear + 1}-${currentYear + 2}`, type: 'fall' },
      { name: `Spring ${currentYear + 2}`, order: 4, year: `${currentYear + 1}-${currentYear + 2}`, type: 'spring' }
    ]

  const mockSemesters: PlanSemester[] = semesters.map(sem => ({
    id: `mock-semester-${planId}-${sem.order}`,
    planId,
    semesterName: sem.name,
    semesterOrder: sem.order,
    academicYear: sem.year,
    semesterType: sem.type as 'fall' | 'spring' | 'summer',
    totalCredits: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    courses: []
  }))

  // Store in mock data
  mockPlans.push(plan)
  mockPlanSemesters.push(...mockSemesters)

  // Return plan with semesters
  return {
    ...plan,
    semesters: mockSemesters
  }
}

/**
 * Get mock student plans
 */
function getMockStudentPlans(userId: string): StudentPlan[] {
  return mockPlans.filter(plan => plan.userId === userId)
}

/**
 * Get mock student plan with details
 */
function getMockStudentPlanWithDetails(planId: string): StudentPlan | null {
  const plan = mockPlans.find(p => p.id === planId)
  if (!plan) return null

  const semesters = mockPlanSemesters
    .filter(sem => sem.planId === planId)
    .map(semester => {
      const courses = mockPlanCourses
        .filter(course => course.semesterId === semester.id)
        .map(course => ({
          ...course,
          course: {
            id: course.courseId,
            courseCode: `MOCK-${course.courseId}`,
            courseName: `Mock Course ${course.courseId}`,
            credits: 3,
            semester: 'fall',
            professor: 'Mock Professor',
            professorRating: 4.0,
            professorDifficulty: 3.0,
            professorWouldTakeAgain: 0.8,
            professorTotalRatings: 100,
            classTimes: [{ days: 'MWF', startTime: '10:00', endTime: '11:15', type: 'lecture' }],
            location: 'Mock Hall 101',
            availableSeats: 25,
            totalSeats: 30,
            description: 'Mock course description',
            prerequisites: [],
            institution: 'Mock Community College',
            department: 'Mock Department',
            enrolled: 25,
            waitlistCount: 0,
            academicYear: '2024-2025',
            transferCredits: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }))
        .sort((a, b) => a.positionOrder - b.positionOrder)

      return {
        ...semester,
        courses,
        totalCredits: courses.reduce((sum, course) => sum + (course.course?.credits || 0), 0)
      }
    })
    .sort((a, b) => a.semesterOrder - b.semesterOrder)

  return {
    ...plan,
    semesters,
    totalCreditsPlanned: semesters.reduce((sum, sem) => sum + sem.totalCredits, 0)
  }
}

/**
 * Add course to mock plan
 */
function addMockCourseToPlan(planId: string, semesterId: string, courseId: string): boolean {
  try {
    const existingCourse = mockPlanCourses.find(
      course => course.planId === planId && course.semesterId === semesterId && course.courseId === courseId
    )

    if (existingCourse) {
      console.log('Course already exists in this semester')
      return false
    }

    const maxPosition = Math.max(
      0,
      ...mockPlanCourses
        .filter(course => course.semesterId === semesterId)
        .map(course => course.positionOrder)
    )

    const newCourse: PlanCourse = {
      id: `mock-plan-course-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      planId,
      semesterId,
      courseId,
      positionOrder: maxPosition + 1,
      status: 'planned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    mockPlanCourses.push(newCourse)
    return true
  } catch (error) {
    console.error('Error adding mock course to plan:', error)
    return false
  }
}

/**
 * Remove course from mock plan
 */
function removeMockCourseFromPlan(planId: string, semesterId: string, courseId: string): boolean {
  try {
    const index = mockPlanCourses.findIndex(
      course => course.planId === planId && course.semesterId === semesterId && course.courseId === courseId
    )

    if (index === -1) return false

    mockPlanCourses.splice(index, 1)
    return true
  } catch (error) {
    console.error('Error removing mock course from plan:', error)
    return false
  }
}

/**
 * Update mock course position
 */
function updateMockCoursePosition(planId: string, semesterId: string, courseId: string, newPosition: number): boolean {
  try {
    const course = mockPlanCourses.find(
      course => course.planId === planId && course.semesterId === semesterId && course.courseId === courseId
    )

    if (!course) return false

    course.positionOrder = newPosition
    course.updatedAt = new Date().toISOString()
    return true
  } catch (error) {
    console.error('Error updating mock course position:', error)
    return false
  }
}

/**
 * Move course between mock semesters
 */
function moveMockCourseBetweenSemesters(
  planId: string,
  courseId: string,
  fromSemesterId: string,
  toSemesterId: string,
  newPosition: number
): boolean {
  try {
    const course = mockPlanCourses.find(
      course => course.planId === planId && course.semesterId === fromSemesterId && course.courseId === courseId
    )

    if (!course) return false

    course.semesterId = toSemesterId
    course.positionOrder = newPosition
    course.updatedAt = new Date().toISOString()
    return true
  } catch (error) {
    console.error('Error moving mock course between semesters:', error)
    return false
  }
}

/**
 * Update mock plan status
 */
function updateMockPlanStatus(planId: string, status: 'draft' | 'active' | 'completed'): boolean {
  try {
    const plan = mockPlans.find(p => p.id === planId)
    if (!plan) return false

    plan.planStatus = status
    plan.updatedAt = new Date().toISOString()
    return true
  } catch (error) {
    console.error('Error updating mock plan status:', error)
    return false
  }
}

/**
 * Delete mock student plan
 */
function deleteMockStudentPlan(planId: string): boolean {
  try {
    // Remove plan
    const planIndex = mockPlans.findIndex(p => p.id === planId)
    if (planIndex === -1) return false
    mockPlans.splice(planIndex, 1)

    // Remove associated semesters
    mockPlanSemesters = mockPlanSemesters.filter(sem => sem.planId !== planId)

    // Remove associated courses
    mockPlanCourses = mockPlanCourses.filter(course => course.planId !== planId)

    return true
  } catch (error) {
    console.error('Error deleting mock student plan:', error)
    return false
  }
} 