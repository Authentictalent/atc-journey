'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CalendarDays, Check, ChevronRight, LockOpen, Mail, UserPlus } from 'lucide-react'
import { uid, useStore } from '@/lib/store'
import { addDays, fmtShort, todayISO } from '@/lib/dates'
import { dayState, features, fmtSlot, fullName, isDayDone } from '@/lib/project'
import { wording } from '@/lib/wording'
import type { Participant, Project } from '@/lib/types'
import { Avatar, Button, Dialog, EmptyState, Field, cx } from '@/components/ui'
import { SlotDialog } from './SlotDialog'
import { WelcomeEmailDialog } from './WelcomeEmailDialog'

/** La date telle qu'on l'affiche : cliquable pour la proposer, la confirmer ou la modifier. */
export function SlotCell({ participant: p, onOpen }: { participant: Participant; onOpen: () => void }) {
  const label =
    p.slot.status === 'confirmed' && p.slot.confirmed
      ? fmtSlot(p.slot.confirmed)
      : p.slot.status === 'proposed'
        ? 'Créneaux envoyés'
        : p.slot.status === 'counter'
          ? 'Ses dates à valider'
          : 'À fixer'
  return (
    <button onClick={onOpen} className={cx('whitespace-nowrap text-left text-[13.5px] hover:underline', p.slot.status === 'confirmed' ? 'font-semibold' : 'text-navy/50')} title="Gérer la date">
      {label}
    </button>
  )
}

type NextAction = { label: string; open?: 'mail' | 'slot' | 'unlock'; primary?: boolean }

function nextAction(project: Project, p: Participant): NextAction {
  if (!p.welcomeSentAt) return { label: 'Envoyer le mail de bienvenue', open: 'mail', primary: true }
  if (p.slot.status === 'todo') return { label: 'Proposer des dates', open: 'slot', primary: true }
  if (p.slot.status === 'counter') return { label: 'Valider sa date', open: 'slot', primary: true }
  if (p.slot.status === 'proposed') return { label: 'Attend son choix de date', open: 'slot' }
  if (!isDayDone(project, p)) return { label: dayState(p) === 'today' ? 'Journée en cours' : 'Tout est prêt' }
  if (!features(project).feedback) return { label: 'Parcours terminé' }
  if (p.feedback.status === 'unlocked') return { label: p.feedback.sessionDate ? `Feedback le ${fmtShort(p.feedback.sessionDate)}` : 'Feedback débloqué' }
  if (!project.debriefClientDone) return { label: 'Après le debrief client' }
  return { label: 'Débloquer le feedback', open: 'unlock', primary: true }
}

function Prep({ project, p }: { project: Project; p: Participant }) {
  const items = [{ label: 'Hogan', done: p.hogan === 'done' }, ...(features(project).preQuestionnaire ? [{ label: 'Questionnaire', done: p.preQuestionnaire === 'done' }] : [])]
  return (
    <span className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <span key={i.label} className={cx('stadium inline-flex items-center gap-1 px-2 py-0.5 text-[12px]', i.done ? 'bg-lime-pale text-navy' : 'bg-navy/[0.05] text-navy/45')}>
          {i.done && <Check size={11} strokeWidth={3} className="text-lime-dark" />}
          {i.label}
        </span>
      ))}
    </span>
  )
}

export function ParticipantsTab({ project, participants }: { project: Project; participants: Participant[] }) {
  const w = wording(project.purpose)
  const [adding, setAdding] = useState(false)
  const [unlocking, setUnlocking] = useState<Participant | null>(null)
  const [slotFor, setSlotFor] = useState<Participant | null>(null)
  const [mailFor, setMailFor] = useState<Participant | null>(null)

  const open = (p: Participant, what: NextAction['open']) => (what === 'mail' ? setMailFor(p) : what === 'slot' ? setSlotFor(p) : what === 'unlock' ? setUnlocking(p) : undefined)

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          <UserPlus size={14} /> Ajouter un {w.participant.toLowerCase()}
        </Button>
      </div>

      {participants.length === 0 ? (
        <EmptyState icon={<UserPlus size={20} />} title={`Aucun ${w.participant.toLowerCase()} pour l’instant`}>
          Ajoutez les personnes évaluées, puis envoyez-leur le mail de bienvenue.
        </EmptyState>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-navy/[0.07] text-[11px] font-semibold uppercase tracking-wider text-navy/45">
                <th className="px-6 py-4 font-semibold">{w.participant}</th>
                <th className="px-3 py-4 font-semibold">Date</th>
                <th className="px-3 py-4 font-semibold">Préparation</th>
                <th className="px-3 py-4 font-semibold">Prochaine étape</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/[0.06]">
              {participants.map((p) => {
                const next = nextAction(project, p)
                return (
                  <tr key={p.id} className="group transition-colors hover:bg-cream-warm">
                    <td className="px-6 py-4">
                      <Link href={`/projets/${project.id}/participants/${p.id}`} className="flex items-center gap-3">
                        <Avatar name={fullName(p)} size={36} tone="navy" />
                        <span>
                          <span className="block text-[14.5px] font-semibold group-hover:underline">{fullName(p)}</span>
                          <span className="block text-[12.5px] text-navy/50">{p.currentRole}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 py-4">
                      <SlotCell participant={p} onOpen={() => setSlotFor(p)} />
                    </td>
                    <td className="px-3 py-4">
                      <Prep project={project} p={p} />
                    </td>
                    <td className="px-3 py-4">
                      {next.open ? (
                        <Button size="sm" variant={next.primary ? 'lime' : 'ghost'} onClick={() => open(p, next.open)}>
                          {next.open === 'mail' && <Mail size={13} />}
                          {next.open === 'slot' && <CalendarDays size={13} />}
                          {next.open === 'unlock' && <LockOpen size={13} />}
                          {next.label}
                        </Button>
                      ) : (
                        <span className="text-[13px] text-navy/50">{next.label}</span>
                      )}
                    </td>
                    <td className="pr-4">
                      <Link href={`/projets/${project.id}/participants/${p.id}`} aria-label={`Voir ${fullName(p)}`} className="text-navy/30 hover:text-navy">
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <AddParticipantDialog open={adding} onClose={() => setAdding(false)} project={project} />
      <UnlockFeedbackDialog participant={unlocking} onClose={() => setUnlocking(null)} />
      <SlotDialog project={project} participant={slotFor} onClose={() => setSlotFor(null)} />
      <WelcomeEmailDialog project={project} participant={mailFor} onClose={() => setMailFor(null)} />
    </div>
  )
}

function AddParticipantDialog({ open, onClose, project }: { open: boolean; onClose: () => void; project: Project }) {
  const { dispatch } = useStore()
  const w = wording(project.purpose)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', currentRole: '' })
  const valid = form.firstName.trim() && form.lastName.trim() && /\S+@\S+\.\S+/.test(form.email)

  const submit = () => {
    if (!valid) return
    dispatch({
      type: 'addParticipant',
      participant: {
        id: uid('pa'),
        projectId: project.id,
        ...form,
        invitedAt: todayISO(),
        slot: { status: 'todo', proposals: [], counter: [] },
        hogan: 'todo',
        preQuestionnaire: 'todo',
        preAnswers: {},
        dayProgress: -1,
        postQuestionnaire: 'todo',
        postAnswers: {},
        feedback: { status: 'locked' },
      },
    })
    setForm({ firstName: '', lastName: '', email: '', currentRole: '' })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} eyebrow="Invitation" title={`Ajouter un ${w.participant.toLowerCase()}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prénom">
          <input className="field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} autoFocus />
        </Field>
        <Field label="Nom">
          <input className="field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </Field>
        <Field label="Email professionnel" className="sm:col-span-2">
          <input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Fonction actuelle" className="sm:col-span-2">
          <input className="field" value={form.currentRole} onChange={(e) => setForm({ ...form, currentRole: e.target.value })} />
        </Field>
      </div>
      <p className="mt-4 text-[12.5px] text-navy/50">Vous pourrez ensuite lui envoyer le mail de bienvenue et lui proposer des dates.</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={submit} disabled={!valid}>
          Ajouter
        </Button>
      </div>
    </Dialog>
  )
}

export function UnlockFeedbackDialog({ participant, onClose }: { participant: Participant | null; onClose: () => void }) {
  const { dispatch } = useStore()
  const [date, setDate] = useState(addDays(todayISO(), 7))
  const [time, setTime] = useState('10:00')
  const [summary, setSummary] = useState('')

  if (!participant) return null
  const submit = () => {
    dispatch({
      type: 'setFeedback',
      id: participant.id,
      feedback: {
        ...participant.feedback,
        status: 'unlocked',
        sessionDate: date,
        sessionTime: time,
        summary: summary.trim() || participant.feedback.summary,
      },
    })
    setSummary('')
    onClose()
  }

  return (
    <Dialog open onClose={onClose} eyebrow="Après le debrief client" title={`Débloquer le feedback de ${participant.firstName}`}>
      <p className="text-[14px] leading-relaxed text-navy/65">
        {participant.firstName} verra la date de sa session de feedback et la synthèse dans son espace.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Date de la session">
          <input type="date" className="field" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Heure">
          <input type="time" className="field" value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
        <Field label="Synthèse partagée (facultatif)" className="sm:col-span-2" hint={participant.feedback.summary ? 'Une synthèse rédigée par le lead existe déjà.' : 'Sinon, la synthèse sera présentée pendant la session.'}>
          <textarea className="field min-h-24" value={summary} onChange={(e) => setSummary(e.target.value)} />
        </Field>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="lime" onClick={submit} disabled={!date || !time}>
          <LockOpen size={14} /> Débloquer
        </Button>
      </div>
    </Dialog>
  )
}
