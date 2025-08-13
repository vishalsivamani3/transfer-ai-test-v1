import { supabase } from './supabase'
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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project-id.supabase.co') {
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
    // Fallback to mock data on error
    return generateMockTransferPathways()
  }
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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project-id.supabase.co') {
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
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://your-project-id.supabase.co') {
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