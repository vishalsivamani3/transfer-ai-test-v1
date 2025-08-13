import { supabase, isSupabaseConfigured } from './supabase'
import { TransferPathway } from '@/types'

export interface TransferPathwayFilters {
  state?: string
  major?: string
  guaranteedTransfer?: boolean
  minGPA?: number
  timeline?: string
}

import { generateMockTransferPathways } from './utils'

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