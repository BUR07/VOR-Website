import { getStaffEmployees } from '@/lib/edgeStore'

// Internal endpoint — no sync secret needed, Admin App reads its own Redis directly
export async function GET() {
  try {
    const employees = await getStaffEmployees()
    return Response.json(employees)
  } catch (err) {
    return Response.json([], { status: 500 })
  }
}
