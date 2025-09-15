// Re-export from the new supabase-client.ts for backward compatibility
export { supabase, isSupabaseConfigured, testSupabaseConnection } from './supabase-client'

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
            student_plans: {
                Row: {
                    id: string
                    user_id: string
                    plan_name: string
                    transfer_timeline: '1-year' | '2-year'
                    target_major?: string
                    target_universities?: string[]
                    total_credits_planned: number
                    total_credits_completed: number
                    plan_status: 'draft' | 'active' | 'completed'
                    created_at: string
                    updated_at: string
                    is_default: boolean
                }
                Insert: {
                    id?: string
                    user_id: string
                    plan_name?: string
                    transfer_timeline: '1-year' | '2-year'
                    target_major?: string
                    target_universities?: string[]
                    total_credits_planned?: number
                    total_credits_completed?: number
                    plan_status?: 'draft' | 'active' | 'completed'
                    created_at?: string
                    updated_at?: string
                    is_default?: boolean
                }
                Update: {
                    id?: string
                    user_id?: string
                    plan_name?: string
                    transfer_timeline?: '1-year' | '2-year'
                    target_major?: string
                    target_universities?: string[]
                    total_credits_planned?: number
                    total_credits_completed?: number
                    plan_status?: 'draft' | 'active' | 'completed'
                    created_at?: string
                    updated_at?: string
                    is_default?: boolean
                }
            }
            student_plan_semesters: {
                Row: {
                    id: string
                    plan_id: string
                    semester_name: string
                    semester_order: number
                    academic_year: string
                    semester_type: 'fall' | 'spring' | 'summer'
                    total_credits: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    plan_id: string
                    semester_name: string
                    semester_order: number
                    academic_year: string
                    semester_type: 'fall' | 'spring' | 'summer'
                    total_credits?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    plan_id?: string
                    semester_name?: string
                    semester_order?: number
                    academic_year?: string
                    semester_type?: 'fall' | 'spring' | 'summer'
                    total_credits?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            student_plan_courses: {
                Row: {
                    id: string
                    plan_id: string
                    semester_id: string
                    course_id: string
                    position_order: number
                    status: 'planned' | 'enrolled' | 'completed' | 'dropped'
                    grade?: string
                    notes?: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    plan_id: string
                    semester_id: string
                    course_id: string
                    position_order: number
                    status?: 'planned' | 'enrolled' | 'completed' | 'dropped'
                    grade?: string
                    notes?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    plan_id?: string
                    semester_id?: string
                    course_id?: string
                    position_order?: number
                    status?: 'planned' | 'enrolled' | 'completed' | 'dropped'
                    grade?: string
                    notes?: string
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