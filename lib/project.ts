import { exerciseById, FORMATS } from './catalog'
import { addMinutes, daysBetween, fmtShort, todayISO } from './dates'
import { wording } from './wording'
import type { AppState, Participant, Phase, Project } from './types'

export const TRANSITION_MINUTES = 10

export function schedule(project: Project) {
  let cursor = project.startTime
  return project.exercises.map((ex, index) => {
    const start = cursor
    const end = addMinutes(start, ex.duration)
    cursor = addMinutes(end, TRANSITION_MINUTES)
    return { ...ex, index, start, end, catalog: exerciseById(ex.catalogId) }
  })
}

export const endTime = (project: Project) => {
  const s = schedule(project)
  return s.length ? s[s.length - 1].end : project.startTime
}

export function phaseOf(project: Project, participants: Participant[]): Phase {
  const d = daysBetween(todayISO(), project.date)
  if (d > 0) return 'pre'
  if (d === 0) return 'jour-j'
  const features = FORMATS[project.format].features
  if (!features.feedback) return 'clos'
  return participants.every((p) => p.feedback.status === 'unlocked') && project.debriefClientDone ? 'clos' : 'restitution'
}

export const PHASE_LABEL: Record<Phase, string> = {
  pre: 'Préparation',
  'jour-j': 'Jour J',
  restitution: 'Restitution',
  clos: 'Clôturé',
}

export const features = (project: Project) => FORMATS[project.format].features

export function isPreDone(project: Project, p: Participant) {
  return p.hogan === 'done' && (!features(project).preQuestionnaire || p.preQuestionnaire === 'done')
}

export function isDayDone(project: Project, p: Participant) {
  return p.dayProgress >= project.exercises.length || daysBetween(todayISO(), project.date) < 0
}

export type StepState = 'done' | 'current' | 'upcoming'

export interface JourneyStep {
  key: string
  label: string
  detail: string
  state: StepState
}

export function journey(project: Project, p: Participant): JourneyStep[] {
  const f = features(project)
  const w = wording(project.purpose)
  const dayDone = isDayDone(project, p)
  const steps: Omit<JourneyStep, 'state'>[] = [
    { key: 'invitation', label: 'Invitation', detail: `Reçue le ${fmtShort(p.invitedAt)}` },
    { key: 'hogan', label: 'Inventaires Hogan', detail: p.hogan === 'done' ? 'Complétés' : 'À compléter' },
  ]
  if (f.preQuestionnaire)
    steps.push({ key: 'pre', label: `Questionnaire ${w.pre}`, detail: p.preQuestionnaire === 'done' ? 'Envoyé' : 'À compléter' })
  steps.push({ key: 'day', label: w.assessment, detail: fmtShort(project.date) })
  if (f.postQuestionnaire)
    steps.push({ key: 'post', label: `Questionnaire ${w.post}`, detail: p.postQuestionnaire === 'done' ? 'Envoyé' : 'Après la journée' })
  if (f.feedback)
    steps.push({
      key: 'feedback',
      label: 'Feedback',
      detail: p.feedback.status === 'unlocked' && p.feedback.sessionDate ? `Le ${fmtShort(p.feedback.sessionDate)}` : 'Après le debrief client',
    })

  const done: Record<string, boolean> = {
    invitation: true,
    hogan: p.hogan === 'done',
    pre: p.preQuestionnaire === 'done',
    day: dayDone,
    post: p.postQuestionnaire === 'done',
    feedback: p.feedback.status === 'unlocked',
  }
  let currentAssigned = false
  return steps.map((s) => {
    if (done[s.key]) return { ...s, state: 'done' as const }
    if (!currentAssigned) {
      currentAssigned = true
      return { ...s, state: 'current' as const }
    }
    return { ...s, state: 'upcoming' as const }
  })
}

export interface ActionItem {
  tone: 'peach' | 'lime' | 'teal'
  label: string
}

export function requiredActions(project: Project, participants: Participant[]): ActionItem[] {
  const out: ActionItem[] = []
  const f = features(project)
  const phase = phaseOf(project, participants)
  const w = wording(project.purpose)
  const minSeconds = FORMATS[project.format].minSeconds

  if (!project.leadAssessorId) out.push({ tone: 'peach', label: 'Assigner un lead assesseur' })
  if (project.secondAssessorIds.length < minSeconds)
    out.push({ tone: 'peach', label: minSeconds - project.secondAssessorIds.length > 1 ? `Assigner ${minSeconds - project.secondAssessorIds.length} seconds assesseurs` : 'Assigner un second assesseur' })
  const unassigned = project.exercises.filter((e) => exerciseById(e.catalogId).kind !== 'break' && !e.assessorId).length
  if (unassigned) out.push({ tone: 'peach', label: `${unassigned} exercice${unassigned > 1 ? 's' : ''} sans assesseur` })
  if (!participants.length) out.push({ tone: 'peach', label: `Ajouter des ${w.participants.toLowerCase()}` })

  if (phase === 'pre') {
    const late = participants.filter((p) => !isPreDone(project, p)).length
    if (late && daysBetween(todayISO(), project.date) <= 14)
      out.push({ tone: 'lime', label: `Relancer ${late} ${late > 1 ? w.participants.toLowerCase() : w.participant.toLowerCase()} sur la ${w.pre}` })
  }
  if (phase === 'restitution') {
    if (!project.debriefClientDone) out.push({ tone: 'lime', label: 'Organiser le debrief client' })
    else if (f.feedback) {
      const locked = participants.filter((p) => p.feedback.status === 'locked').length
      if (locked) out.push({ tone: 'lime', label: `Débloquer ${locked} feedback${locked > 1 ? 's' : ''}` })
    }
  }
  return out
}

export function preProgress(project: Project, participants: Participant[]) {
  if (!participants.length) return 0
  return Math.round((participants.filter((p) => isPreDone(project, p)).length / participants.length) * 100)
}

export function projectParticipants(state: AppState, projectId: string) {
  return state.participants.filter((p) => p.projectId === projectId)
}

export type SessionStatus = 'preparation' | 'live' | 'done'

export function assessorSessions(state: AppState, assessorId: string) {
  return state.projects
    .filter(
      (pr) =>
        pr.leadAssessorId === assessorId ||
        pr.secondAssessorIds.includes(assessorId) ||
        pr.exercises.some((e) => e.assessorId === assessorId),
    )
    .flatMap((project) => {
      const d = daysBetween(todayISO(), project.date)
      const status: SessionStatus = d > 0 ? 'preparation' : d === 0 ? 'live' : 'done'
      const role = project.leadAssessorId === assessorId ? ('lead' as const) : ('second' as const)
      return projectParticipants(state, project.id).map((participant) => ({ project, participant, status, role }))
    })
    .sort((a, b) => a.project.date.localeCompare(b.project.date))
}

export const fullName = (p: { firstName: string; lastName: string }) => `${p.firstName} ${p.lastName}`

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')

export const noteKey = (participantId: string, exerciseId: string, assessorId: string) =>
  `${participantId}:${exerciseId}:${assessorId}`

export const gridKey = (participantId: string, competencyId: string) => `${participantId}:${competencyId}`

export const CHECKLIST = [
  { id: 'dossier', label: 'Lire le dossier et le CV du participant' },
  { id: 'hogan', label: 'Prendre connaissance des rapports Hogan' },
  { id: 'referentiel', label: 'Relire le référentiel de compétences' },
  { id: 'materiaux', label: 'Télécharger les supports des exercices' },
  { id: 'teams', label: 'Tester le lien Teams de la journée' },
]
