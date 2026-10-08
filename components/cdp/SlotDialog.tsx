'use client'

import { useState } from 'react'
import { Check, Plus, Send, Trash } from 'lucide-react'
import { useStore } from '@/lib/store'
import { addDays, businessDay, fmtDate, fmtTime, todayISO } from '@/lib/dates'
import { confirmSlotPatch, fullName } from '@/lib/project'
import type { Participant, Project, SlotOption } from '@/lib/types'
import { Button, Dialog, cx } from '@/components/ui'
import { dateReminderEmail } from '@/lib/welcome-email'
import { EmailCopySteps } from './EmailCopy'

type Mode = 'propose' | 'waiting' | 'remind' | 'review' | 'fix'

const suggestions = (project: Project): SlotOption[] =>
  [7, 9, 13].map((n, i) => ({ date: businessDay(addDays(todayISO(), n + i)), time: project.startTime }))

export function SlotDialog({ project, participant, onClose }: { project: Project; participant: Participant | null; onClose: () => void }) {
  if (!participant) return null
  return <SlotDialogBody key={participant.id} project={project} participant={participant} onClose={onClose} />
}

function SlotDialogBody({ project, participant: p, onClose }: { project: Project; participant: Participant; onClose: () => void }) {
  const { state, dispatch } = useStore()
  const cdp = state.users.find((u) => u.id === project.cdpId)
  const initial: Mode = p.slot.status === 'counter' ? 'review' : p.slot.status === 'confirmed' ? 'fix' : p.slot.status === 'proposed' ? 'waiting' : 'propose'
  const [mode, setMode] = useState<Mode>(initial)
  const [options, setOptions] = useState<SlotOption[]>(p.slot.status === 'proposed' && p.slot.proposals.length ? p.slot.proposals : suggestions(project))
  const [picked, setPicked] = useState(0)
  const [fixed, setFixed] = useState<SlotOption>(p.slot.confirmed ?? { date: businessDay(addDays(todayISO(), 7)), time: project.startTime })

  const update = (patch: Partial<Participant>) => dispatch({ type: 'updateParticipant', id: p.id, patch })
  const valid = options.every((o) => o.date && o.time)

  const titles: Record<Mode, string> = {
    propose: p.slot.status === 'proposed' ? 'Modifier les créneaux' : 'Proposer des créneaux',
    waiting: `En attente du choix de ${p.firstName}`,
    remind: 'Mail de relance à envoyer',
    review: `Les dates proposées par ${p.firstName}`,
    fix: p.slot.status === 'confirmed' ? 'Modifier la date' : 'Fixer la date',
  }

  return (
    <Dialog open onClose={onClose} eyebrow={fullName(p)} title={titles[mode]}>
      {mode === 'propose' && (
        <>
          <p className="text-[14px] leading-relaxed text-navy/65">
            {p.firstName} choisit l’un de ces créneaux dans son espace. Si aucun ne lui convient, il ou elle pourra en suggérer d’autres.
          </p>
          <ul className="mt-5 space-y-2.5">
            {options.map((o, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="tabular w-6 font-heading text-[14px] text-navy/35">{i + 1}</span>
                <input type="date" aria-label={`Date ${i + 1}`} className="field" value={o.date} onChange={(e) => setOptions(options.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))} />
                <input type="time" aria-label={`Heure ${i + 1}`} className="field !w-32" value={o.time} onChange={(e) => setOptions(options.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)))} />
                <button onClick={() => setOptions(options.filter((_, j) => j !== i))} disabled={options.length === 1} aria-label="Retirer ce créneau" className="stadium p-2 text-navy/40 hover:bg-peach-pale hover:text-peach-dark disabled:opacity-25">
                  <Trash size={14} />
                </button>
              </li>
            ))}
          </ul>
          {options.length < 4 && (
            <button onClick={() => setOptions([...options, { date: '', time: project.startTime }])} className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-teal-dark hover:underline">
              <Plus size={14} /> Ajouter un créneau
            </button>
          )}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <button onClick={() => setMode('fix')} className="text-[13px] text-navy/55 hover:text-navy hover:underline">
              Date déjà convenue ? La fixer directement
            </button>
            <Button
              disabled={!valid}
              onClick={() => {
                update({ slot: { status: 'proposed', proposals: [...options].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)), counter: [] } })
                onClose()
              }}
            >
              <Send size={14} /> Envoyer les créneaux
            </Button>
          </div>
        </>
      )}

      {mode === 'waiting' && (
        <>
          <p className="text-[14px] leading-relaxed text-navy/65">{p.firstName} n’a pas encore choisi parmi vos créneaux :</p>
          <ul className="mt-4 space-y-2">
            {p.slot.proposals.map((o, i) => (
              <li key={i} className="flex items-center justify-between rounded-2xl border border-navy/10 px-4 py-2.5">
                <span className="text-[14px] font-semibold first-letter:uppercase">{fmtDate(o.date)}</span>
                <span className="tabular font-mono text-[13px] text-navy/55">{fmtTime(o.time)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[12px] font-semibold uppercase tracking-wider text-navy/45">Pour avancer</p>
          <div className="mt-3 grid gap-2">
            <button onClick={() => setMode('remind')} className="rounded-2xl border border-navy/10 px-4 py-3 text-left transition-colors hover:border-lime-dark">
              <span className="block text-[14px] font-semibold">Le relancer par mail</span>
              <span className="block text-[12.5px] text-navy/55">Un court message prêt à copier dans Outlook.</span>
            </button>
            <button onClick={() => setMode('fix')} className="rounded-2xl border border-navy/10 px-4 py-3 text-left transition-colors hover:border-lime-dark">
              <span className="block text-[14px] font-semibold">Fixer la date moi-même</span>
              <span className="block text-[12.5px] text-navy/55">Si vous l’avez convenue avec lui ou elle par téléphone ou par mail.</span>
            </button>
            <button onClick={() => setMode('propose')} className="rounded-2xl border border-navy/10 px-4 py-3 text-left transition-colors hover:border-lime-dark">
              <span className="block text-[14px] font-semibold">Changer les créneaux proposés</span>
              <span className="block text-[12.5px] text-navy/55">Ils remplacent les précédents dans son espace.</span>
            </button>
          </div>
        </>
      )}

      {mode === 'remind' && (
        <>
          <EmailCopySteps to={p.email} {...dateReminderEmail(project, p, cdp, typeof window === 'undefined' ? '' : window.location.origin)} />
          <div className="mt-6 flex justify-between gap-3 border-t border-navy/[0.07] pt-5">
            <button onClick={() => setMode('waiting')} className="text-[13px] text-navy/55 hover:text-navy hover:underline">
              Retour
            </button>
            <Button variant="lime" onClick={onClose}>
              <Check size={14} /> C’est envoyé
            </Button>
          </div>
        </>
      )}

      {mode === 'review' && (
        <>
          <p className="text-[14px] leading-relaxed text-navy/65">Aucun de vos créneaux ne convenait. Confirmez l’une de ses propositions, ou proposez-en d’autres.</p>
          <ul className="mt-5 space-y-2" role="radiogroup" aria-label="Dates proposées">
            {p.slot.counter.map((o, i) => (
              <li key={i}>
                <button
                  role="radio"
                  aria-checked={picked === i}
                  onClick={() => setPicked(i)}
                  className={cx('flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors', picked === i ? 'border-navy bg-navy text-white' : 'border-navy/10 hover:border-lime-dark')}
                >
                  <span className="text-[14.5px] font-semibold first-letter:uppercase">{fmtDate(o.date)}</span>
                  <span className={cx('tabular font-mono text-[13px]', picked === i ? 'text-lime' : 'text-navy/55')}>{fmtTime(o.time)}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <button onClick={() => setMode('propose')} className="text-[13px] text-navy/55 hover:text-navy hover:underline">
              Proposer d’autres créneaux
            </button>
            <Button
              variant="lime"
              onClick={() => {
                update(confirmSlotPatch(project, p, p.slot.counter[picked]))
                onClose()
              }}
            >
              <Check size={14} /> Confirmer cette date
            </Button>
          </div>
        </>
      )}

      {mode === 'fix' && (
        <>
          <p className="text-[14px] leading-relaxed text-navy/65">
            {p.slot.status === 'confirmed' ? 'La nouvelle date remplace l’ancienne dans l’espace du candidat et des assesseurs.' : 'La date est confirmée tout de suite, sans passer par le choix du candidat.'}
            {project.venue.mode === 'teams' && ' Le lien Teams est créé automatiquement.'}
          </p>
          <div className="mt-5 flex gap-2">
            <input type="date" aria-label="Date" className="field" value={fixed.date} onChange={(e) => setFixed({ ...fixed, date: e.target.value })} />
            <input type="time" aria-label="Heure" className="field !w-32" value={fixed.time} onChange={(e) => setFixed({ ...fixed, time: e.target.value })} />
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
            <button onClick={() => setMode('propose')} className="text-[13px] text-navy/55 hover:text-navy hover:underline">
              Proposer plutôt des créneaux
            </button>
            <Button
              variant="lime"
              disabled={!fixed.date || !fixed.time}
              onClick={() => {
                update({ ...confirmSlotPatch(project, p, fixed), dayProgress: -1, exerciseStartedAt: undefined })
                onClose()
              }}
            >
              <Check size={14} /> Confirmer la date
            </Button>
          </div>
        </>
      )}
    </Dialog>
  )
}
