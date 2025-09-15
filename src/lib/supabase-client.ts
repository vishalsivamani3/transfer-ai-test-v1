import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection function
export const testSupabaseConnection = async () => {
    try {
        console.log('Testing Supabase connection...')
        console.log('URL:', supabaseUrl)
        console.log('Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...')

        // Test basic connection by fetching a simple query
        const { data, error } = await supabase
            .from('transfer_pathways')
            .select('count')
            .limit(1)

        if (error) {
            console.error('Supabase connection test failed:', error)
            return { success: false, error: error.message }
        }

        console.log('Supabase connection test successful!')
        return { success: true, data }
    } catch (error) {
        console.error('Supabase connection test error:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
    const isConfigured = supabaseUrl &&
        supabaseAnonKey &&
        supabaseUrl !== 'https://placeholder.supabase.co' &&
        supabaseAnonKey !== 'placeholder_key' &&
        supabaseUrl !== 'https://your-project-id.supabase.co' &&
        supabaseAnonKey !== 'your_supabase_anon_key_here'

    console.log('Supabase configured:', isConfigured, 'URL:', supabaseUrl)
    return isConfigured
}

// Database types (simplified for now)
export interface Database {
    public: {
        Tables: {
            transfer_pathways: {
                Row: {
                    id: string
                    source_code: string
                    target_code: string
                    source_college: string
                    target_college: string
                    major_name: string
                    transfer_types: string
                    total_courses: string
                    created_at: string
                    updated_at: string
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
                    created_at: string
                    updated_at: string
                }
            }
        }
    }
}
