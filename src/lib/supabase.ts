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
            student_courses: {
                Row: {
                    id: string
                    user_id: string
                    course_id: string
                    status: 'selected' | 'enrolled' | 'completed' | 'dropped'
                    selection_date: string
                    enrollment_date?: string
                    completion_date?: string
                    grade?: string
                    notes?: string
                    priority: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    course_id: string
                    status?: 'selected' | 'enrolled' | 'completed' | 'dropped'
                    selection_date?: string
                    enrollment_date?: string
                    completion_date?: string
                    grade?: string
                    notes?: string
                    priority?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    course_id?: string
                    status?: 'selected' | 'enrolled' | 'completed' | 'dropped'
                    selection_date?: string
                    enrollment_date?: string
                    completion_date?: string
                    grade?: string
                    notes?: string
                    priority?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            courses: {
                Row: {
                    id: string
                    institution: string
                    course_code: string
                    course_name: string
                    department: string
                    credits: number
                    description?: string
                    prerequisites?: string[]
                    corequisites?: string[]
                    professor_name?: string
                    professor_email?: string
                    professor_rmp_id?: string
                    professor_rating?: number
                    professor_difficulty?: number
                    professor_would_take_again?: number
                    professor_total_ratings: number
                    class_times?: any
                    location?: string
                    capacity?: number
                    enrolled: number
                    waitlist_count: number
                    semester: string
                    academic_year: string
                    transfer_credits: boolean
                    transfer_notes?: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    institution: string
                    course_code: string
                    course_name: string
                    department: string
                    credits: number
                    description?: string
                    prerequisites?: string[]
                    corequisites?: string[]
                    professor_name?: string
                    professor_email?: string
                    professor_rmp_id?: string
                    professor_rating?: number
                    professor_difficulty?: number
                    professor_would_take_again?: number
                    professor_total_ratings?: number
                    class_times?: any
                    location?: string
                    capacity?: number
                    enrolled?: number
                    waitlist_count?: number
                    semester: string
                    academic_year: string
                    transfer_credits?: boolean
                    transfer_notes?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    institution?: string
                    course_code?: string
                    course_name?: string
                    department?: string
                    credits?: number
                    description?: string
                    prerequisites?: string[]
                    corequisites?: string[]
                    professor_name?: string
                    professor_email?: string
                    professor_rmp_id?: string
                    professor_rating?: number
                    professor_difficulty?: number
                    professor_would_take_again?: number
                    professor_total_ratings?: number
                    class_times?: any
                    location?: string
                    capacity?: number
                    enrolled?: number
                    waitlist_count?: number
                    semester?: string
                    academic_year?: string
                    transfer_credits?: boolean
                    transfer_notes?: string
                    created_at?: string
                    updated_at?: string
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