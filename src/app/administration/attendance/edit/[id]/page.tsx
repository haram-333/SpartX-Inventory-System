import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AttendanceForm } from "@/components/administration/attendance-form"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getAttendance(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/administration/attendance/${id}`,
      {
        cache: 'no-store'
      }
    )
    
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.success ? data.attendance : null
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return null
  }
}

export default async function EditAttendancePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params
  const session = await auth()

  if (!session) {
    redirect('/auth/signin')
  }

  // Check if user has permission
  const allowedRoles = ['SUPER_ADMIN', 'ADMIN']
  if (!allowedRoles.includes(session.user.role)) {
    redirect('/dashboard')
  }

  const attendance = await getAttendance(resolvedParams.id)

  if (!attendance) {
    redirect('/administration/attendance')
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Attendance</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update attendance record for {attendance.employeeName}
          </p>
        </div>
        <AttendanceForm initialData={attendance} isEdit={true} />
      </div>
    </DashboardLayout>
  )
}

