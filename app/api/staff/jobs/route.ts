import { listAssignments, listAssignmentsByStaff, QuoteAssignment } from '@/lib/edgeStore'

function auth(req: Request) {
  return req.headers.get('x-sync-secret') === process.env.SYNC_SECRET
}

export async function GET(req: Request) {
  if (!auth(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const jobs: QuoteAssignment[] = userId
      ? await listAssignmentsByStaff(userId)
      : await listAssignments()
    return Response.json(jobs)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
