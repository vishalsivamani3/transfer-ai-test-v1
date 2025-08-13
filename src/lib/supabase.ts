import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

// Only create the client if we have valid credentials
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
    return supabaseUrl !== 'https://placeholder.supabase.co' &&
        supabaseAnonKey !== 'placeholder_key' &&
        supabaseUrl !== 'https://your-project-id.supabase.co' &&
        supabaseAnonKey !== 'your_supabase_anon_key_here'
}

// Database types
export interface Database {
    public: {
        Tables: {
            student_profiles: {
                Row: {
                    id: string
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
                    completed_credits: number
                    transfer_goals?: string[]
                    career_interests?: string[]
                    onboarding_completed: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
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
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    email?: string
                    first_name?: string
                    last_name?: string
                    current_college?: string
                    academic_year?: string
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
                    created_at?: string
                    updated_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    email: string
                    first_name: string
                    last_name: string
                    current_college: string
                    academic_year: string
                    onboarding_completed: boolean
                    intended_major?: string
                    target_universities?: string[]
                    preferred_transfer_timeline?: string
                    current_gpa?: number
                    completed_credits?: number
                    transfer_goals?: string[]
                    career_interests?: string[]
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    first_name: string
                    last_name: string
                    current_college: string
                    academic_year: string
                    onboarding_completed?: boolean
                    intended_major?: string
                    target_universities?: string[]
                    preferred_transfer_timeline?: string
                    current_gpa?: number
                    completed_credits?: number
                    transfer_goals?: string[]
                    career_interests?: string[]
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    first_name?: string
                    last_name?: string
                    current_college?: string
                    academic_year?: string
                    onboarding_completed?: boolean
                    intended_major?: string
                    target_universities?: string[]
                    preferred_transfer_timeline?: string
                    current_gpa?: number
                    completed_credits?: number
                    transfer_goals?: string[]
                    career_interests?: string[]
                    created_at?: string
                    updated_at?: string
                }
            }
            courses: {
                Row: {
                    id: string
                    user_id: string
                    code: string
                    name: string
                    credits: number
                    grade?: string
                    semester?: string
                    year?: number
                    status: 'completed' | 'in_progress' | 'planned'
                    professor?: string
                    rating?: number
                    transfer_credits?: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    code: string
                    name: string
                    credits: number
                    grade?: string
                    semester?: string
                    year?: number
                    status: 'completed' | 'in_progress' | 'planned'
                    professor?: string
                    rating?: number
                    transfer_credits?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    code?: string
                    name?: string
                    credits?: number
                    grade?: string
                    semester?: string
                    year?: number
                    status?: 'completed' | 'in_progress' | 'planned'
                    professor?: string
                    rating?: number
                    transfer_credits?: number
                    created_at?: string
                }
            }
            transfer_pathways: {
                Row: {
                    id: string
                    user_id: string
                    target_university: string
                    major: string
                    state: string
                    guaranteed_transfer: boolean
                    requirements_met: number
                    total_requirements: number
                    estimated_transfer_credits: number
                    timeline: string
                    acceptance_rate?: number
                    min_gpa?: number
                    application_deadline?: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    target_university: string
                    major: string
                    state: string
                    guaranteed_transfer?: boolean
                    requirements_met?: number
                    total_requirements?: number
                    estimated_transfer_credits?: number
                    timeline?: string
                    acceptance_rate?: number
                    min_gpa?: number
                    application_deadline?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    target_university?: string
                    major?: string
                    state?: string
                    guaranteed_transfer?: boolean
                    requirements_met?: number
                    total_requirements?: number
                    estimated_transfer_credits?: number
                    timeline?: string
                    acceptance_rate?: number
                    min_gpa?: number
                    application_deadline?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
} 