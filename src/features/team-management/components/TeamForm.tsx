import React, { useState } from 'react'
import { Plus, Trash2, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

interface CaseOption {
  id: number
  referenceKey: string
  description: string
}

interface EmployeeOption {
  id: string
  fullName: string
  employeeId: string
}

interface SelectedMember {
  userId: string
  fullName: string
  employeeId: string
  memberRole: string
}

const MOCK_CASES: CaseOption[] = [
  {
    id: 1,
    referenceKey: 'FIRMS-2026-0001',
    description: 'Suspected procurement irregularity',
  },
  {
    id: 2,
    referenceKey: 'FIRMS-2026-0002',
    description: 'Suspected financial misconduct',
  },
  {
    id: 3,
    referenceKey: 'FIRMS-2026-0003',
    description: 'Reported conflict of interest',
  },
]

const MOCK_EMPLOYEES: EmployeeOption[] = [
  {
    id: 'user-001',
    fullName: 'Hana Alemayehu',
    employeeId: 'EMP-001',
  },
  {
    id: 'user-002',
    fullName: 'Abebe Kebede',
    employeeId: 'EMP-002',
  },
  {
    id: 'user-003',
    fullName: 'Sara Mohammed',
    employeeId: 'EMP-003',
  },
  {
    id: 'user-004',
    fullName: 'Daniel Tesfaye',
    employeeId: 'EMP-004',
  },
]

const MEMBER_ROLES = [
  'TEAM_LEADER',
  'INVESTIGATOR',
  'REVIEWER',
]

export const TeamForm: React.FC = () => {
  const [caseId, setCaseId] = useState('')
  const [teamType, setTeamType] = useState<
    'PRELIMINARY' | 'FULL_INVESTIGATION'
  >('PRELIMINARY')

  const [employeeId, setEmployeeId] = useState('')
  const [memberRole, setMemberRole] = useState('INVESTIGATOR')

  const [members, setMembers] = useState<SelectedMember[]>([])

  const [error, setError] = useState('')

  const selectedCase = MOCK_CASES.find(
    (item) => item.id.toString() === caseId
  )

  const handleAddMember = () => {
    setError('')

    if (!employeeId) {
      setError('Please select an employee.')
      return
    }

    const employee = MOCK_EMPLOYEES.find(
      (item) => item.id === employeeId
    )

    if (!employee) {
      setError('Selected employee could not be found.')
      return
    }

    const alreadyAdded = members.some(
      (member) => member.userId === employee.id
    )

    if (alreadyAdded) {
      setError('This employee has already been added to the team.')
      return
    }

    const newMember: SelectedMember = {
      userId: employee.id,
      fullName: employee.fullName,
      employeeId: employee.employeeId,
      memberRole,
    }

    setMembers((current) => [...current, newMember])

    setEmployeeId('')
    setMemberRole('INVESTIGATOR')
  }

  const handleRemoveMember = (userId: string) => {
    setMembers((current) =>
      current.filter((member) => member.userId !== userId)
    )
  }

  const handleSubmit = (event: React.FormEvent) => {
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

    const request = {
      caseId: Number(caseId),
      teamType,
      members: members.map((member) => ({
        userId: member.userId,
        memberRole: member.memberRole,
      })),
    }

    console.log('Team creation request:', request)

    alert('Team created successfully.')

    setCaseId('')
    setTeamType('PRELIMINARY')
    setMembers([])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Team Information */}
      <Card
        header={
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Team Information
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Select the case and investigation type.
              </p>
            </div>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Case */}
          <div className="space-y-1.5">
            <label
              htmlFor="case"
              className="block text-xs font-semibold text-slate-700"
            >
              Case
            </label>

            <select
              id="case"
              value={caseId}
              onChange={(event) => setCaseId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">Select a case</option>

              {MOCK_CASES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.referenceKey}
                </option>
              ))}
            </select>

            {selectedCase && (
              <p className="text-xs text-slate-500">
                {selectedCase.description}
              </p>
            )}
          </div>

          {/* Team Type */}
          <div className="space-y-1.5">
            <label
              htmlFor="teamType"
              className="block text-xs font-semibold text-slate-700"
            >
              Investigation Type
            </label>

            <select
              id="teamType"
              value={teamType}
              onChange={(event) =>
                setTeamType(
                  event.target.value as
                    | 'PRELIMINARY'
                    | 'FULL_INVESTIGATION'
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="PRELIMINARY">
                Preliminary Investigation
              </option>

              <option value="FULL_INVESTIGATION">
                Full Investigation
              </option>
            </select>
          </div>
        </div>
      </Card>

      {/* Add Member */}
      <Card
        header={
          <div>
            <h2 className="font-semibold text-slate-900">
              Add Team Member
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Select an employee and assign their role.
            </p>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          {/* Employee */}
          <div className="space-y-1.5">
            <label
              htmlFor="employee"
              className="block text-xs font-semibold text-slate-700"
            >
              Employee
            </label>

            <select
              id="employee"
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="">Select employee</option>

              {MOCK_EMPLOYEES.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName} ({employee.employeeId})
                </option>
              ))}
            </select>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label
              htmlFor="memberRole"
              className="block text-xs font-semibold text-slate-700"
            >
              Member Role
            </label>

            <select
              id="memberRole"
              value={memberRole}
              onChange={(event) => setMemberRole(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {MEMBER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Add */}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddMember}
          >
            <Plus className="w-4 h-4" />
            Add Member
          </Button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
      </Card>

      {/* Selected Members */}
      <Card
        header={
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Selected Members
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                {members.length} member
                {members.length !== 1 ? 's' : ''} selected
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
              <div
                key={member.userId}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700">
                    {member.fullName.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {member.fullName}
                    </p>

                    <p className="text-xs text-slate-500">
                      {member.employeeId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-slate-600 capitalize">
                    {member.memberRole
                      .toLowerCase()
                      .replace('_', ' ')}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveMember(member.userId)
                    }
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
            setMemberRole('INVESTIGATOR')
            setMembers([])
            setError('')
          }}
        >
          Clear
        </Button>

        <Button type="submit">
          <Users className="w-4 h-4" />
          Create Team
        </Button>
      </div>
    </form>
  )
}