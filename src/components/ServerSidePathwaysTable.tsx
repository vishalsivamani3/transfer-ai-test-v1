import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { fetchTransferPathways } from '@/lib/queries'

interface ServerSidePathwaysTableProps {
    limit?: number
}

export async function ServerSidePathwaysTable({ limit = 10 }: ServerSidePathwaysTableProps) {
    let pathways: any[] = []
    let error: string | null = null

    try {
        console.log('ServerSidePathwaysTable: Fetching pathways server-side...')
        pathways = await fetchTransferPathways({
            page: 1,
            limit,
            filters: {}
        })
        console.log('ServerSidePathwaysTable: Fetched', pathways.length, 'pathways')
    } catch (err) {
        console.error('ServerSidePathwaysTable: Error:', err)
        error = err instanceof Error ? err.message : 'Failed to fetch pathways'
    }

    if (error) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <div className="text-center">
                        <p className="text-red-600 font-medium mb-2">Failed to load transfer pathways</p>
                        <p className="text-muted-foreground text-sm">{error}</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Transfer Pathways ({pathways.length})</CardTitle>
            </CardHeader>
            <CardContent>
                {pathways.length === 0 ? (
                    <p className="text-muted-foreground">No pathways found.</p>
                ) : (
                    <div className="space-y-4">
                        {pathways.map((pathway) => (
                            <div key={pathway.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-medium">{pathway.major}</h4>
                                        <p className="text-sm text-muted-foreground">{pathway.targetUniversity}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Min GPA: {pathway.minGPA?.toFixed(1) || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">{pathway.state}</p>
                                        {pathway.guaranteedTransfer && (
                                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                Guaranteed
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}