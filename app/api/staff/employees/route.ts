import { getStaffEmployees, saveStaffEmployees, StaffEmployee } from '@/lib/edgeStore'

function auth(req: Request) {
  return req.headers.get('x-sync-secret') === process.env.SYNC_SECRET
}

export async function GET(req: Request) {
  if (!auth(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const employees = await getStaffEmployees()
    return Response.json(employees)
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  if (!auth(req)) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const employees: StaffEmployee[] = await req.json()
    await saveStaffEmployees(employees)
    return Response.json({ ok: true })
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
