import { NextRequest, NextResponse } from 'next/server'
import { searchCoursesAdvanced } from '@/lib/queries'
import { supabase } from '@/lib/supabase-client'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('query') || ''
        const limit = parseInt(searchParams.get('limit') || '10')
        const department = searchParams.get('department') || undefined
        const college = searchParams.get('college') || undefined
        const transferType = searchParams.get('transferType') || undefined
        const geArea = searchParams.get('geArea') || undefined
        const geSystem = searchParams.get('geSystem') || undefined

        console.log('API: Fetching ASSIST courses with filters:', {
            query, limit, department, college, transferType, geArea, geSystem
        })

        // Use real ASSIST data from Supabase
        console.log('API: Using real ASSIST data from Supabase')

        let queryBuilder = supabase
            .from('courses')
            .select(`
                id,
                college_id,
                course_code,
                course_title,
                department,
                units,
                description,
                created_at,
                updated_at
            `)

        // Apply filters
        if (query) {
            queryBuilder = queryBuilder.or(`course_title.ilike.%${query}%,course_code.ilike.%${query}%,description.ilike.%${query}%`)
        }

        if (department) {
            queryBuilder = queryBuilder.eq('department', department)
        }

        if (college) {
            queryBuilder = queryBuilder.eq('college_id', parseInt(college))
        }

        // Apply limit and ordering
        queryBuilder = queryBuilder
            .order('course_code')
            .limit(limit)

        const { data: courses, error, count } = await queryBuilder

        if (error) {
            console.error('API: Error fetching courses from Supabase:', error)
            throw error
        }

        // Transform the data to match expected format
        const transformedCourses = courses?.map(course => ({
            id: course.id,
            courseCode: course.course_code,
            courseTitle: course.course_title,
            department: course.department,
            units: course.units,
            description: course.description,
            college: {
                id: course.college_id,
                name: getCollegeName(course.college_id),
                state: 'CA',
                type: getCollegeType(course.college_id)
            },
            transferCredits: true,
            transferNotes: `Transfers as ${course.course_code} sequence at UC and CSU campuses`,
            createdAt: course.created_at,
            updatedAt: course.updated_at
        })) || []

        console.log(`API: Successfully fetched ${transformedCourses.length} ASSIST courses`)

        return NextResponse.json({
            success: true,
            data: transformedCourses,
            count: transformedCourses.length,
            total: count || transformedCourses.length,
            filters: {
                query,
                limit,
                department,
                college,
                transferType,
                geArea,
                geSystem
            }
        })

    } catch (error) {
        console.error('API: Error fetching courses:', error)
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch courses'
            },
            { status: 500 }
        )
    }
}

// Helper functions for ASSIST data
function getCollegeName(collegeId: number): string {
    const collegeMap: Record<number, string> = {
        1: 'University of California, Berkeley',
        2: 'University of California, Los Angeles',
        3: 'California State University, Long Beach',
        4: 'Santa Monica College',
        10: 'California State University, Long Beach'
    }
    return collegeMap[collegeId] || 'Unknown College'
}

function getCollegeType(collegeId: number): string {
    const typeMap: Record<number, string> = {
        1: 'UC',
        2: 'UC',
        3: 'CSU',
        4: 'CCC',
        10: 'CSU'
    }
    return typeMap[collegeId] || 'UC'
}
