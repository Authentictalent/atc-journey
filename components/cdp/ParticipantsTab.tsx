'use client'

import Link from 'next/link'
import { useState } from 'react'
import { CalendarDays, Check, ChevronRight, LockOpen, Mail, UserPlus } from 'lucide-react'
import { uid, useStore } from '@/lib/store'
import { addDays, fmtShort, todayISO } from '@/lib/dates'
import { features, fmtSlot, fullName, isDayDone, phaseOf } from '@/lib/project'
import { wording } from '@/lib/wording'
import type { Participant, Project } from '@/lib/types'
import { Avatar, Button, Dialog, EmptyState, Field, Pill, cx } from '@/components/ui'
import { SlotDialog } from './SlotDialog'
import { WelcomeEmailDialog } from './WelcomeEmailDialog'

export function SlotCell({ participant: p, onOpen }: { participant: Participant; onOpen: () => void }) {
  switch (p.slot.status) {
    case 'todo':
      return (
        <Button size="sm" variant="outline" onClick={onOpen}>
          <CalendarDays size={13} /> Proposer des dates
        </Button>
      )
    case 'proposed':
      return (
        <button onClick={onOpen} className="text-left">
          <Pill tone="teal" dot>
            {p.slot.proposals.length} créneaux proposés
          </Pill>
          <span className="mt-1 block text-[12px] text-navy/45">En attente de son choix</span>
        </button>
      )
    case 'counter':
      return (
        <Button size="sm" variant="lime" onClick={onOpen}>
          Voir ses {p.slot.counter.length} dates
        </Button>
      )
    case 'confirmed':
      return (
        <button onClick={onOpen} className="group/date text-left" title="Modifier la date">
          <span className="block whitespace-nowrap text-[13.5px] font-semibold group-hover/date:underline">{p.slot.confirmed && fmtSlot(p.slot.confirmed)}</span>
          <span className="block text-[12px] text-navy/45">Confirmée</span>
        </button>
      )
  }
}

function Mark({ done, label }: { done: boolean; label: string }) {
  return (
    <span
      title={`${label} : ${done ? 'fait' : 'à faire'}`}
      className={cx('stadium inline-flex h-6 w-6 items-center justify-center', done ? 'bg-lime-dark text-white' : 'bg-navy/[0.06] text-navy/25')}
    >
      {done ? <Check size={13} strokeWidth={3} /> : <span className="h-1 w-1 rounded-full bg-current" />}
      <span className="sr-only">
        {label} : {done ? 'fait' : 'à faire'}
      </span>
    </span>
  )
}

export function ParticipantsTab({ project, participants }: { project: Project; participants: Participant[] }) {
  const w = wording(project.purpose)
  const f = features(project)
  const phase = phaseOf(project, participants)
  const [adding, setAdding] = useState(false)
  const [unlocking, setUnlocking] = useState<Participant | null>(null)
  const [slotFor, setSlotFor] = useState<Participant | null>(null)
  const [mailFor, setMailFor] = useState<Participant | null>(null)

  const columns = [
    { key: 'hogan', label: 'Hogan', done: (p: Participant) => p.hogan === 'done' },
    ...(f.preQuestionnaire ? [{ key: 'pre', label: w.pre, done: (p: Participant) => p.preQuestionnaire === 'done' }] : []),
    { key: 'day', label: 'Jour J', done: (p: Participant) => isDayDone(project, p) },
    ...(f.postQuestionnaire ? [{ key: 'post', label: w.post, done: (p: Participant) => p.postQuestionnaire === 'done' }] : []),
  ]

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-navy/60">
          {participants.length} {participants.length > 1 ? w.participants.toLowerCase() : w.participant.toLowerCase()} · cliquez sur une date pour la proposer, la confirmer ou la modifier. Les mails se copient dans Outlook.
        </p>
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          <UserPlus size={14} /> Ajouter un {w.participant.toLowerCase()}
        </Button>
      </div>

      {participants.length === 0 ? (
        <EmptyState icon={<UserPlus size={20} />} title={`Aucun ${w.participant.toLowerCase()} pour l’instant`}>
          Ajoutez les personnes évaluées : elles recevront leur accès au parcours.
        </EmptyState>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[960px] text-left">
            <thead>
              <tr className="border-b border-navy/[0.07] text-[11px] font-semibold uppercase tracking-wider text-navy/45">
                <th className="px-6 py-4 font-semibold">{w.participant}</th>
                <th className="px-3 py-4 font-semibold">Date</th>
                {columns.map((c) => (
                  <th key={c.key} className="px-3 py-4 text-center font-semibold">
                    {c.label}
                  </th>
                ))}
                {f.feedback && <th className="px-3 py-4 font-semibold">Feedback</th>}
                <th className="px-3 py-4 text-center font-semibold">Bienvenue</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/[0.06]">
              {participants.map((p) => (
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
                  {columns.map((c) => (
                    <td key={c.key} className="px-3 py-4 text-center">
                      <Mark done={c.done(p)} label={c.label} />
                    </td>
                  ))}
                  {f.feedback && (
                    <td className="px-3 py-4">
                      {p.feedback.status === 'unlocked' ? (
                        <Pill tone="lime" dot>
                          Débloqué{p.feedback.sessionDate ? ` · ${fmtShort(p.feedback.sessionDate)}` : ''}
                        </Pill>
                      ) : project.debriefClientDone ? (
                        <Button size="sm" variant="lime" onClick={() => setUnlocking(p)}>
                          <LockOpen size={13} /> Débloquer
                        </Button>
                      ) : (
                        <span className="text-[12.5px] text-navy/45">{phase === 'pre' || phase === 'jour-j' ? 'Après la journée' : 'Après debrief client'}</span>
                      )}
                    </td>
                  )}
                  <td className="px-3 py-4 text-center">
                    <button
                      onClick={() => setMailFor(p)}
                      title={p.welcomeSentAt ? 'Mail de bienvenue envoyé' : 'Préparer le mail de bienvenue à copier dans Outlook'}
                      aria-label={`Mail de bienvenue de ${fullName(p)}`}
                      className={cx('stadium inline-flex h-8 w-8 items-center justify-center transition-colors', p.welcomeSentAt ? 'bg-lime-pale text-lime-dark hover:bg-lime' : 'bg-peach-pale text-peach-dark ring-1 ring-peach/50 hover:bg-peach hover:text-white')}
                    >
                      {p.welcomeSentAt ? <Check size={14} strokeWidth={3} /> : <Mail size={14} />}
                    </button>
                  </td>
                  <td className="pr-4">
                    <Link href={`/projets/${project.id}/participants/${p.id}`} aria-label={`Voir ${fullName(p)}`} className="text-navy/30 hover:text-navy">
                      <ChevronRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
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
