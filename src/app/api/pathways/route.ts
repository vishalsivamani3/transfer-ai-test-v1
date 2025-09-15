import { NextRequest, NextResponse } from 'next/server'
import { fetchTransferPathways } from '@/lib/queries'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)

        // Get query parameters for filtering
        const filters = {
            state: searchParams.get('state') || undefined,
            major: searchParams.get('major') || undefined,
            guaranteedTransfer: searchParams.get('guaranteedTransfer') === 'true' ? true : undefined,
            minGPA: searchParams.get('minGPA') ? parseFloat(searchParams.get('minGPA')!) : undefined,
            timeline: searchParams.get('timeline') || undefined
        }

        // Get pagination parameters
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '200')

        // Filter out undefined values
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== undefined)
        )

        console.log('API: Fetching pathways with filters:', cleanFilters)

        // Fetch pathways using the working function
        const pathways = await fetchTransferPathways(cleanFilters, page, limit)

        console.log('API: Successfully fetched', pathways.length, 'pathways')

        return NextResponse.json({
            success: true,
            data: pathways,
            count: pathways.length,
            page,
            limit,
            filters: cleanFilters
        })
    } catch (error) {
        console.error('API Error in /api/pathways:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            data: [],
            count: 0
        }, { status: 500 })
    }
}