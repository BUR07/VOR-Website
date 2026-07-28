import { patchAssignment } from '@/lib/edgeStore'

function auth(req: Request) {
  return req.headers.get('x-sync-secret') === process.env.SYNC_SECRET
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ refCode: string }> }
) {
  if (!auth(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { refCode } = await params
    const patch = await req.json()
    const updated = await patchAssignment(refCode.toUpperCase(), patch)

    // Notify Staff App of the change so it can revalidate
    const staffUrl = process.env.STAFF_APP_URL
    if (staffUrl) {
      fetch(`${staffUrl}/api/sync/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-sync-secret': process.env.SYNC_SECRET! },
        body: JSON.stringify({ refCode, event: 'job.updated' }),
      }).catch(() => {})
    }

    return Response.json(updated)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
