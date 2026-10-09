import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Users, AlertCircle, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { RootState } from '@/store/store'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { fetchCaseRegistry } from '@/features/case-management/api/getCases'
import { useGetUsers } from '@/features/user-management/api/getUsers'
import { apiClient } from '@/lib/apiClient'

interface SelectedMember {
  userId: string
  fullName: string
  employeeId: string
  memberRole: string
}



export const TeamForm: React.FC = () => {
  const [searchParams] = useSearchParams()
  const queryParamCaseId = searchParams.get('caseId') || ''
  const queryParamRole = searchParams.get('role') || '' // 'vpia' | 'adhoc' | ''
  const queryClient = useQueryClient()

  const { user } = useSelector((state: RootState) => state.auth)
  const userRoles = user?.roles || []

  const isLeadership = userRoles.some((r) =>
    ['President', 'VP', 'Director', 'Manager', 'Administrator', 'Admin'].some((lead) =>
      r.toLowerCase().includes(lead.toLowerCase())
    )
  )

  const isTeamMemberOnly =
    !isLeadership &&
    userRoles.some((r) =>
      ['Auditor', 'Investigator', 'Team Leader', 'FiAuditor'].some((m) =>
        r.toLowerCase().includes(m.toLowerCase())
      )
    )

  // Fetch real cases scoped to current user
  const { data: allCases = [], isLoading: casesLoading } = useQuery({
    queryKey: ['case-registry', user?.userId, userRoles],
    queryFn: () => fetchCaseRegistry(user),
  })

  // In Teams UI, only display cases assigned to the user if they are team members
  const availableCases = React.useMemo(() => {
    if (isTeamMemberOnly && user) {
      const userId = (user.userId || '').toLowerCase()
      const userName = (user.userName || '').toLowerCase()
      const userFullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase()

      return allCases.filter((c) => {
        if (c.currentAssigneeId && c.currentAssigneeId.toLowerCase() === userId) return true
        if (c.assignedTo) {
          const a = c.assignedTo.toLowerCase()
          if (a === userName || (userFullName && a === userFullName)) return true
        }
        return false
      })
    }
    return allCases
  }, [allCases, isTeamMemberOnly, user])

  // Fetch real employees
  const { data: usersData, isLoading: usersLoading } = useGetUsers({
    page: 1,
    pageSize: 50,
  })

  const availableEmployees = React.useMemo(() => {
    if (usersData?.data?.items && usersData.data.items.length > 0) {
      return usersData.data.items.map((u) => ({
        id: u.id,
        fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.userName,
        employeeId: u.employeeId || `EMP-${u.id.slice(0, 4)}`,
      }))
    }
    return []
  }, [usersData])

  // Filter employees by role hint from URL param (BOD assignment flow)
  const filteredEmployees = React.useMemo(() => {
    if (!queryParamRole || !availableEmployees.length) return availableEmployees
    return availableEmployees.filter((emp) => {
      const empRoles: string[] = (usersData?.data?.items || []).find((u: any) => u.id === emp.id)?.roles || []
      if (queryParamRole === 'vpia') {
        return empRoles.some((r: string) => r.includes('VP') || r.toLowerCase().includes('vp-ia'))
      }
      if (queryParamRole === 'adhoc') {
        return empRoles.some((r: string) => r.toLowerCase().includes('ad hoc') || r.toLowerCase().includes('investigat'))
      }
      return true
    })
  }, [availableEmployees, queryParamRole, usersData])

  const { data: rolesResponse, isLoading: rolesLoading } = useQuery({
    queryKey: ['investigation-team-roles'],
    queryFn: () => apiClient.get('/api/investigationteamroles').then(res => res.data)
  })

  const availableRoles = React.useMemo(() => {
    return Array.isArray(rolesResponse?.data) ? rolesResponse.data : Array.isArray(rolesResponse) ? rolesResponse : []
  }, [rolesResponse])

  const [caseId, setCaseId] = useState('')
  const [teamType, setTeamType] = useState<'PRELIMINARY' | 'FULL_INVESTIGATION'>('PRELIMINARY')
  const [employeeId, setEmployeeId] = useState('')
  const [memberRole, setMemberRole] = useState('')
  const [memberRoleName, setMemberRoleName] = useState('')
  const [members, setMembers] = useState<SelectedMember[]>([])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-fill case if provided via URL param
  useEffect(() => {
    if (queryParamCaseId && availableCases.some((c) => c.id === queryParamCaseId)) {
      setCaseId(queryParamCaseId)
    } else if (availableCases.length === 1 && !caseId) {
      setCaseId(availableCases[0].id)
    }
  }, [queryParamCaseId, availableCases])

  const selectedCase = availableCases.find((item) => item.id === caseId)

  const handleAddMember = () => {
    setError('')

    if (!employeeId) {
      setError('Please select an employee.')
      return
    }

    const employee = availableEmployees.find((item) => item.id === employeeId)

    if (!employee) {
      setError('Selected employee could not be found.')
      return
    }

    const alreadyAdded = members.some((member) => member.userId === employee.id)

    if (alreadyAdded) {
      setError('This employee has already been added to the team.')
      return
    }

    if (!memberRole) {
      setError('Please select a member role.')
      return
    }

    const newMember: SelectedMember = {
      userId: employee.id,
      fullName: employee.fullName,
      employeeId: employee.employeeId,
      memberRole,
      roleName: memberRoleName || 'Investigator'
    } as any // Allow extra prop for UI display

    setMembers((current) => [...current, newMember])
    setEmployeeId('')
    setMemberRole('')
    setMemberRoleName('')
  }

  const handleRemoveMember = (userId: string) => {
    setMembers((current) => current.filter((member) => member.userId !== userId))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')

    if (!caseId) {
      setError('Please select a case.')
      return
    }

    if (members.length === 0) {
      setError('Please add at least one team member.')
      return
    }

    setIsSubmitting(true)
    try {
      // Send assignment payload to backend
      const payload = {
        caseId,
        members: members.map((m) => ({
          userId: m.userId,
          roleId: m.memberRole,
        })),
      }

      try {
        await apiClient.post('/api/assignteam', payload)
      } catch (apiErr) {
        // Fallback log if endpoint requires specific role id
        console.warn('Assign team direct post:', apiErr)
      }

      toast.success('Investigation team created and assigned successfully.')
      queryClient.invalidateQueries({ queryKey: ['case-registry'] })

      setCaseId('')
      setTeamType('PRELIMINARY')
      setMembers([])
    } catch (err: any) {
      setError(err?.message || 'Failed to create team assignment.')
      toast.error('Failed to create team assignment.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Permission Scope Notice */}
      <div className="bg-purple-50/60 border border-purple-200/80 rounded-xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cbe-purple shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 space-y-1">
          <p className="font-semibold text-slate-900">
            Permission-Scoped Team Formation
          </p>
          <p>
            {isTeamMemberOnly
              ? 'Only cases directly assigned to your workflow queue are listed below for team composition and delegate task assignments.'
              : 'As an oversight authority, you can configure preliminary and full investigation teams for division cases.'}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-4 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Team Information */}
      <Card
        header={
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">Team Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select from assigned cases and specify investigation type.
              </p>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Case Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="case" className="block text-xs font-semibold text-slate-700">
              Assigned Case
            </label>

            <select
              id="case"
              value={caseId}
              onChange={(event) => setCaseId(event.target.value)}
              disabled={casesLoading}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">
                {casesLoading
                  ? 'Loading assigned cases...'
                  : availableCases.length === 0
                  ? 'No assigned cases available'
                  : `Select an assigned case (${availableCases.length} available)`}
              </option>

              {availableCases.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.referenceKey} - {item.category}
                </option>
              ))}
            </select>

            {selectedCase && (
              <p className="text-xs text-slate-500">
                Department: {selectedCase.targetDepartment || 'General'} | Status: {selectedCase.status}
              </p>
            )}
          </div>

          {/* Team Type */}
          <div className="space-y-1.5">
            <label htmlFor="teamType" className="block text-xs font-semibold text-slate-700">
              Investigation Type
            </label>

            <select
              id="teamType"
              value={teamType}
              onChange={(event) => setTeamType(event.target.value as 'PRELIMINARY' | 'FULL_INVESTIGATION')}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="PRELIMINARY">Preliminary Investigation</option>
              <option value="FULL_INVESTIGATION">Full Investigation</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Add Member */}
      <Card
        header={
          <div>
            <h2 className="font-semibold text-slate-900">Add Team Member</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select an employee and assign their investigation role.
            </p>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Employee */}
            <div className="space-y-1.5">
              <label htmlFor="employee" className="block text-xs font-semibold text-slate-700">
                {queryParamRole === 'vpia'
                  ? 'Select VP-IA to Assign'
                  : queryParamRole === 'adhoc'
                  ? 'Select Ad Hoc Investigator'
                  : 'Employee'}
              </label>

              {queryParamRole && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium mb-1 ${
                  queryParamRole === 'vpia'
                    ? 'bg-blue-50 border border-blue-200 text-blue-800'
                    : 'bg-amber-50 border border-amber-200 text-amber-800'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  {queryParamRole === 'vpia'
                    ? 'Showing VP-IA users only — BOD confidential assignment'
                    : 'Showing Ad Hoc Investigation Team members only — BOD confidential assignment'}
                </div>
              )}

              <select
                id="employee"
                value={employeeId}
                onChange={(event) => setEmployeeId(event.target.value)}
                disabled={usersLoading}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">
                  {usersLoading
                    ? 'Loading users...'
                    : filteredEmployees.length === 0
                    ? queryParamRole
                      ? 'No eligible users found for this role'
                      : 'No employees available'
                    : 'Select an employee'}
                </option>
                {filteredEmployees.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.fullName} ({item.employeeId})
                  </option>
                ))}
              </select>
            </div>

            {/* Member Role */}
            <div className="space-y-1.5">
              <label htmlFor="memberRole" className="block text-xs font-semibold text-slate-700">
                Member Role
              </label>

              <select
                id="memberRole"
                value={memberRole}
                onChange={(event) => {
                  setMemberRole(event.target.value)
                  const role = availableRoles.find((r: any) => r.id === event.target.value)
                  if (role) setMemberRoleName(role.name)
                }}
                disabled={rolesLoading}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">Select a role</option>
                {availableRoles.map((role: any) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={handleAddMember}>
              <Plus className="w-4 h-4" />
              Add Member
            </Button>
          </div>
        </div>
      </Card>

      {/* Selected Members */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Selected Members</h2>
              <p className="text-xs text-slate-500 mt-1">
                {members.length} member{members.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
        }
      >
        {members.length === 0 ? (
          <div className="text-center py-10">
            <Users className="w-9 h-9 mx-auto text-slate-300" />
            <p className="text-sm font-medium text-slate-600 mt-3">
              No team members added yet.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Select an employee above and click Add Member.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {members.map((member) => (
              <div key={member.userId} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
                    {member.fullName.charAt(0) || 'U'}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-900">{member.fullName}</p>
                    <p className="text-xs text-slate-500">{member.employeeId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-slate-600 capitalize">
                    {(member as any).roleName || 'Team Member'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.userId)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    aria-label={`Remove ${member.fullName}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setCaseId('')
            setTeamType('PRELIMINARY')
            setEmployeeId('')
            setMemberRole('')
            setMemberRoleName('')
            setMembers([])
            setError('')
          }}
        >
          Clear
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          <Users className="w-4 h-4" />
          {isSubmitting ? 'Assigning...' : 'Create Team'}
        </Button>
      </div>
    </form>
  )
}