export type Purpose = 'AC' | 'DC'
export type Format = 'light' | 'robuste' | 'premium'
export type Role = 'cdp' | 'participant' | 'assessor' | 'sponsor'
export type StepStatus = 'todo' | 'done'
export type Phase = 'pre' | 'jour-j' | 'restitution' | 'clos'

export interface ProjectExercise {
  id: string
  catalogId: string
  duration: number
  assessorId: string | null
}

export interface Project {
  id: string
  purpose: Purpose
  format: Format
  client: string
  position: string
  sponsorName: string
  sponsorTitle: string
  date: string
  startTime: string
  location: string
  teamsUrl: string
  exercises: ProjectExercise[]
  competencyIds: string[]
  leadAssessorId: string | null
  secondAssessorIds: string[]
  debriefClientDone: boolean
}

export interface Feedback {
  status: 'locked' | 'unlocked'
  sessionDate?: string
  sessionTime?: string
  summary?: string
  strengths?: string[]
  development?: string[]
}

export interface Participant {
  id: string
  projectId: string
  firstName: string
  lastName: string
  email: string
  currentRole: string
  invitedAt: string
  hogan: StepStatus
  preQuestionnaire: StepStatus
  preAnswers: Record<string, string>
  dayProgress: number
  exerciseStartedAt?: string
  postQuestionnaire: StepStatus
  postAnswers: Record<string, string>
  feedback: Feedback
}

export interface Assessor {
  id: string
  name: string
  title: string
  email: string
}

export interface GridEntry {
  score: number | null
  evidence: string
}

export interface Session {
  role: Role
  participantId?: string
  assessorId?: string
  projectId?: string
}

export interface AppState {
  seededOn: string
  session: Session | null
  projects: Project[]
  participants: Participant[]
  assessors: Assessor[]
  notes: Record<string, { text: string; updatedAt: string }>
  grid: Record<string, GridEntry>
  checklist: Record<string, boolean>
}
