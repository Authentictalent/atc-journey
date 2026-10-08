import { exerciseById, FORMATS } from './catalog'
import { addMinutes, daysBetween, fmtShort, fmtTime, todayISO } from './dates'
import { wording } from './wording'
import type { AppState, Participant, Phase, Project, SlotOption } from './types'

export const TRANSITION_MINUTES = 10

export function schedule(project: Project, startTime = project.startTime) {
  let cursor = startTime
  return project.exercises.map((ex, index) => {
    const start = cursor
    const end = addMinutes(start, ex.duration)
    cursor = addMinutes(end, TRANSITION_MINUTES)
    return { ...ex, index, start, end, catalog: exerciseById(ex.catalogId) }
  })
}

export const endTime = (project: Project, startTime = project.startTime) => {
  const s = schedule(project, startTime)
  return s.length ? s[s.length - 1].end : startTime
}

export const features = (project: Project) => FORMATS[project.format].features

/* ---------- Date du candidat ---------- */

export const participantDate = (p: Participant) => p.slot.confirmed?.date ?? null
export const participantStart = (project: Project, p: Participant) => p.slot.confirmed?.time ?? project.startTime
export const scheduleFor = (project: Project, p: Participant) => schedule(project, participantStart(project, p))

export type DayState = 'unscheduled' | 'future' | 'today' | 'past'
export function dayState(p: Participant): DayState {
  const date = participantDate(p)
  if (!date) return 'unscheduled'
  const d = daysBetween(todayISO(), date)
  return d > 0 ? 'future' : d === 0 ? 'today' : 'past'
}

export const fmtSlot = (o: SlotOption) => `${fmtShort(o.date)} · ${fmtTime(o.time)}`

export function venueLabel(project: Project) {
  if (project.venue.mode === 'teams') return 'Distanciel · Microsoft Teams'
  return project.venue.address ? `Présentiel · ${project.venue.address}` : 'Présentiel · adresse à définir'
}

export const isPreDone = (project: Project, p: Participant) =>
  p.hogan === 'done' && (!features(project).preQuestionnaire || p.preQuestionnaire === 'done')

export const isDayDone = (project: Project, p: Participant) => p.dayProgress >= project.exercises.length || dayState(p) === 'past'

export function phaseOf(project: Project, participants: Participant[]): Phase {
  if (participants.some((p) => dayState(p) === 'today' && !isDayDone(project, p))) return 'jour-j'
  if (!participants.length || !participants.every((p) => isDayDone(project, p))) return 'pre'
  if (!features(project).feedback) return 'clos'
  return participants.every((p) => p.feedback.status === 'unlocked') && project.debriefClientDone ? 'clos' : 'restitution'
}

export const PHASE_LABEL: Record<Phase, string> = {
  pre: 'Préparation',
  'jour-j': 'Jour J',
  restitution: 'Restitution',
  clos: 'Clôturé',
}

export function nextDate(participants: Participant[]) {
  const today = todayISO()
  return participants
    .map(participantDate)
    .filter((d): d is string => !!d && d >= today)
    .sort()[0]
}

/* ---------- Parcours ---------- */

export type StepState = 'done' | 'current' | 'upcoming'

export interface JourneyStep {
  key: string
  label: string
  detail: string
  state: StepState
}

function dateDetail(p: Participant) {
  switch (p.slot.status) {
    case 'confirmed':
      return p.slot.confirmed ? fmtSlot(p.slot.confirmed) : ''
    case 'proposed':
      return 'Créneaux à choisir'
    case 'counter':
      return 'Contre-proposition envoyée'
    default:
      return 'Créneaux bientôt proposés'
  }
}

export function journey(project: Project, p: Participant, audience: 'staff' | 'participant' = 'staff'): JourneyStep[] {
  const f = features(project)
  const w = wording(project.purpose)
  const date = participantDate(p)
  const steps: Omit<JourneyStep, 'state'>[] = [
    {
      key: 'invitation',
      label: 'Invitation',
      detail: p.welcomeSentAt ? `${audience === 'staff' ? 'Envoyée' : 'Reçue'} le ${fmtShort(p.welcomeSentAt)}` : audience === 'staff' ? 'Mail de bienvenue à envoyer' : 'Accès ouvert',
    },
    { key: 'date', label: 'Date de la journée', detail: dateDetail(p) },
    { key: 'hogan', label: 'Inventaires Hogan', detail: p.hogan === 'done' ? 'Complétés' : 'À compléter' },
  ]
  if (f.preQuestionnaire)
    steps.push({ key: 'pre', label: `Questionnaire ${w.pre}`, detail: p.preQuestionnaire === 'done' ? 'Envoyé' : 'À compléter' })
  steps.push({ key: 'day', label: w.assessment, detail: date ? fmtShort(date) : 'Date à fixer' })
  if (f.postQuestionnaire)
    steps.push({ key: 'post', label: `Questionnaire ${w.post}`, detail: p.postQuestionnaire === 'done' ? 'Envoyé' : 'Après la journée' })
  if (f.feedback)
    steps.push({
      key: 'feedback',
      label: 'Feedback',
      detail: p.feedback.status === 'unlocked' && p.feedback.sessionDate ? `Le ${fmtShort(p.feedback.sessionDate)}` : 'Après le debrief client',
    })

  const done: Record<string, boolean> = {
    invitation: audience === 'participant' || !!p.welcomeSentAt,
    date: p.slot.status === 'confirmed',
    hogan: p.hogan === 'done',
    pre: p.preQuestionnaire === 'done',
    day: isDayDone(project, p),
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

/* ---------- Actions requises ---------- */

export interface ActionItem {
  tone: 'peach' | 'lime' | 'teal'
  label: string
  target: 'participants' | 'planning' | 'team' | 'debrief'
}

const plural = (n: number, one: string, many: string) => `${n} ${n > 1 ? many : one}`

export function requiredActions(project: Project, participants: Participant[]): ActionItem[] {
  const out: ActionItem[] = []
  const f = features(project)
  const phase = phaseOf(project, participants)
  const w = wording(project.purpose)
  const minSeconds = FORMATS[project.format].minSeconds

  if (!project.leadAssessorId) out.push({ tone: 'peach', label: 'Assigner un lead assesseur', target: 'team' })
  const missing = minSeconds - project.secondAssessorIds.length
  if (missing > 0) out.push({ tone: 'peach', label: missing > 1 ? `Assigner ${missing} seconds assesseurs` : 'Assigner un second assesseur', target: 'team' })
  const unassigned = project.exercises.filter((e) => exerciseById(e.catalogId).kind !== 'break' && !e.assessorId).length
  if (unassigned) out.push({ tone: 'peach', label: plural(unassigned, 'exercice sans assesseur', 'exercices sans assesseur'), target: 'planning' })
  if (!participants.length) out.push({ tone: 'peach', label: `Ajouter des ${w.participants.toLowerCase()}`, target: 'participants' })

  const noMail = participants.filter((p) => !p.welcomeSentAt).length
  if (noMail) out.push({ tone: 'lime', label: plural(noMail, 'mail de bienvenue à envoyer', 'mails de bienvenue à envoyer'), target: 'participants' })
  const toPropose = participants.filter((p) => p.slot.status === 'todo').length
  if (toPropose) out.push({ tone: 'lime', label: plural(toPropose, 'date à proposer', 'dates à proposer'), target: 'participants' })
  const counters = participants.filter((p) => p.slot.status === 'counter').length
  if (counters) out.push({ tone: 'peach', label: plural(counters, 'contre-proposition de date à traiter', 'contre-propositions de date à traiter'), target: 'participants' })

  const late = participants.filter((p) => {
    const date = participantDate(p)
    return date && !isPreDone(project, p) && daysBetween(todayISO(), date) >= 0 && daysBetween(todayISO(), date) <= 14
  }).length
  if (late) out.push({ tone: 'lime', label: `Relancer ${plural(late, w.participant.toLowerCase(), w.participants.toLowerCase())} sur la ${w.pre}`, target: 'participants' })

  if (phase === 'restitution') {
    if (!project.debriefClientDone) out.push({ tone: 'lime', label: 'Organiser le debrief client', target: 'debrief' })
    else if (f.feedback) {
      const locked = participants.filter((p) => p.feedback.status === 'locked').length
      if (locked) out.push({ tone: 'lime', label: `Débloquer ${plural(locked, 'feedback', 'feedbacks')}`, target: 'participants' })
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

/* ---------- Assesseurs ---------- */

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
      const role = project.leadAssessorId === assessorId ? ('lead' as const) : ('second' as const)
      return projectParticipants(state, project.id).map((participant) => {
        const d = dayState(participant)
        const status: SessionStatus = d === 'today' ? 'live' : d === 'past' ? 'done' : 'preparation'
        return { project, participant, status, role }
      })
    })
    .sort((a, b) => (participantDate(a.participant) ?? '9999').localeCompare(participantDate(b.participant) ?? '9999'))
}

/* ---------- Divers ---------- */

export const fullName = (p: { firstName: string; lastName: string }) => `${p.firstName} ${p.lastName}`

export const noteKey = (participantId: string, exerciseId: string, assessorId: string) => `${participantId}:${exerciseId}:${assessorId}`

export const gridKey = (participantId: string, competencyId: string) => `${participantId}:${competencyId}`

export function teamsLink() {
  const id = Math.random().toString(36).slice(2, 12)
  return `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${id}%40thread.v2/0`
}

/** Patch à appliquer à un participant quand sa date est confirmée. */
export function confirmSlotPatch(project: Project, p: Participant, option: SlotOption): Partial<Participant> {
  return {
    slot: { ...p.slot, status: 'confirmed', confirmed: option },
    teamsUrl: project.venue.mode === 'teams' ? (p.teamsUrl ?? teamsLink()) : undefined,
  }
}

export const CHECKLIST = [
  { id: 'dossier', label: 'Lire le dossier et le CV du participant' },
  { id: 'hogan', label: 'Prendre connaissance des rapports Hogan' },
  { id: 'referentiel', label: 'Relire le référentiel de compétences' },
  { id: 'materiaux', label: 'Télécharger les supports des exercices' },
  { id: 'teams', label: 'Tester le lien Teams de la journée' },
]
