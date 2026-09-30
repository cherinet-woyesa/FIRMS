export type TeamType = 'PRELIMINARY' | 'FULL_INVESTIGATION'

export interface TeamMember {
  userId: string
  fullName: string
  staffId?: string
  role: string
}

export interface InvestigationTeam {
  id: string
  caseId: number
  teamType: TeamType
  members: TeamMember[]
}

export interface CreateTeamRequest {
  caseId: number
  teamType: TeamType
  members: {
    userId: string
    memberRole: string
  }[]
}