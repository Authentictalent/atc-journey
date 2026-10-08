export type Purpose = 'AC' | 'DC'
export type Format = 'light' | 'robuste' | 'premium'
export type Role = 'admin' | 'cdp' | 'participant' | 'assessor' | 'sponsor'
export type StaffRole = 'admin' | 'cdp'
export type StepStatus = 'todo' | 'done'
export type Phase = 'pre' | 'jour-j' | 'restitution' | 'clos'

export interface User {
  id: string
  name: string
  email: string
  role: StaffRole
  title: string
  active: boolean
}

export interface ProjectExercise {
  id: string
  catalogId: string
  duration: number
  assessorId: string | null
}

export interface Venue {
  mode: 'teams' | 'site'
  address: string
}

export interface Project {
  id: string
  cdpId: string
  purpose: Purpose
  format: Format
  client: string
  position: string
  sponsorName: string
  sponsorTitle: string
  sponsorEmail: string
  period: string
  startTime: string
  venue: Venue
  exercises: ProjectExercise[]
  competencyIds: string[]
  leadAssessorId: string | null
  secondAssessorIds: string[]
  debriefClientDone: boolean
}

export interface SlotOption {
  date: string
  time: string
}

export interface Slot {
  status: 'todo' | 'proposed' | 'counter' | 'confirmed'
  proposals: SlotOption[]
  counter: SlotOption[]
  confirmed?: SlotOption
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
  welcomeSentAt?: string
  slot: Slot
  teamsUrl?: string
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
  active: boolean
}

export interface GridEntry {
  score: number | null
  evidence: string
}

export interface Session {
  role: Role
  userId?: string
  participantId?: string
  assessorId?: string
  projectId?: string
}

export interface AppState {
  seededOn: string
  session: Session | null
  users: User[]
  projects: Project[]
  participants: Participant[]
  assessors: Assessor[]
  notes: Record<string, { text: string; updatedAt: string }>
  grid: Record<string, GridEntry>
  checklist: Record<string, boolean>
}
