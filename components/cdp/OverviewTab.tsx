'use client'

import { useState } from 'react'
import { Check, Clock, Copy, MapPin, UserRound, Video } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtDate, fmtTime, relativeDay } from '@/lib/dates'
import { endTime, isDayDone, isPreDone, PHASE_LABEL, phaseOf, requiredActions, features } from '@/lib/project'
import { wording } from '@/lib/wording'
import type { Participant, Phase, Project } from '@/lib/types'
import { Button, ProgressBar, SectionTitle, cx } from '@/components/ui'

const PHASES: Phase[] = ['pre', 'jour-j', 'restitution', 'clos']

export function OverviewTab({
  project,
  participants,
  onTab,
}: {
  project: Project
  participants: Participant[]
  onTab: (t: 'participants' | 'planning' | 'team') => void
}) {
  const { dispatch } = useStore()
  const [copied, setCopied] = useState(false)
  const w = wording(project.purpose)
  const f = features(project)
  const phase = phaseOf(project, participants)
  const actions = requiredActions(project, participants)
  const phaseIndex = PHASES.indexOf(phase)

  const n = participants.length || 1
  const metrics = [
    { label: 'Inventaires Hogan', value: participants.filter((p) => p.hogan === 'done').length },
    ...(f.preQuestionnaire ? [{ label: `Questionnaire ${w.pre}`, value: participants.filter((p) => p.preQuestionnaire === 'done').length }] : []),
    { label: w.assessment, value: participants.filter((p) => isDayDone(project, p)).length },
    ...(f.postQuestionnaire ? [{ label: `Questionnaire ${w.post}`, value: participants.filter((p) => p.postQuestionnaire === 'done').length }] : []),
    ...(f.feedback ? [{ label: 'Feedbacks débloqués', value: participants.filter((p) => p.feedback.status === 'unlocked').length }] : []),
  ]

  const copyTeams = async () => {
    try {
      await navigator.clipboard.writeText(project.teamsUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // presse-papiers indisponible
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-8">
        {/* Phases du dispositif */}
        <div className="card p-6 sm:p-7">
          <p className="eyebrow">Phase du dispositif</p>
          <ol className="mt-5 grid grid-cols-4 gap-2">
            {PHASES.map((ph, i) => (
              <li key={ph}>
                <div className={cx('h-1.5 rounded-full', i < phaseIndex ? 'bg-lime-dark' : i === phaseIndex ? 'bg-lime' : 'bg-navy/[0.07]')} />
                <p className={cx('mt-2.5 text-[13px]', i === phaseIndex ? 'font-semibold text-navy' : i < phaseIndex ? 'text-navy/60' : 'text-navy/35')}>
                  {PHASE_LABEL[ph]}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions requises */}
        <div>
          <SectionTitle eyebrow="À traiter" tone="peach" title={actions.length ? `${actions.length} action${actions.length > 1 ? 's' : ''} requise${actions.length > 1 ? 's' : ''}` : 'Rien à signaler'} />
          {actions.length === 0 ? (
            <div className="card flex items-center gap-4 p-5">
              <span className="stadium flex h-10 w-10 items-center justify-center bg-lime-pale text-lime-dark">
                <Check size={18} />
              </span>
              <p className="text-[14px] text-navy/65">Le dispositif est complet. Les prochaines étapes apparaîtront ici.</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {actions.map((a) => {
                const target = a.label.includes('assesseur') ? 'team' : a.label.includes('exercice') ? 'planning' : 'participants'
                return (
                  <li key={a.label} className="card flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <span className="flex items-center gap-3 text-[14.5px] font-medium">
                      <span className={cx('h-2 w-2 rounded-full', a.tone === 'peach' ? 'bg-peach' : 'bg-lime-dark')} />
                      {a.label}
                    </span>
                    {a.label === 'Organiser le debrief client' ? (
                      <Button size="sm" variant="lime" onClick={() => dispatch({ type: 'updateProject', id: project.id, patch: { debriefClientDone: true } })}>
                        Marquer comme réalisé
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => onTab(target)}>
                        Traiter
                      </Button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Avancement par étape */}
        <div>
          <SectionTitle eyebrow="Avancement" title={`Parcours des ${w.participants.toLowerCase()}`} />
          <div className="card divide-y divide-navy/[0.07]">
            {metrics.map((m) => (
              <div key={m.label} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 px-6 py-4 sm:grid-cols-[220px_1fr_auto]">
                <span className="text-[14px] font-medium">{m.label}</span>
                <ProgressBar value={(m.value / n) * 100} tone={m.value === participants.length && participants.length ? 'lime' : 'teal'} className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto" />
                <span className="tabular col-start-2 row-start-1 text-[13px] text-navy/55 sm:col-start-auto sm:row-start-auto">
                  {m.value} / {participants.length}
                </span>
              </div>
            ))}
          </div>
          {participants.some((p) => !isPreDone(project, p)) && phase === 'pre' && (
            <p className="mt-3 text-[13px] text-navy/55">
              {participants.filter((p) => !isPreDone(project, p)).length} {w.participant.toLowerCase()}(s) n’ont pas terminé leur {w.pre}.
            </p>
          )}
        </div>
      </div>

      {/* Fiche du dispositif */}
      <aside className="space-y-4">
        <div className="card p-6">
          <p className="eyebrow eyebrow--lime">La journée</p>
          <p className="mt-3 font-heading text-[22px] font-medium leading-snug">{fmtDate(project.date)}</p>
          <p className="text-[13.5px] text-navy/55">{relativeDay(project.date)}</p>
          <div className="tick-rule my-5" />
          <ul className="space-y-3.5 text-[14px]">
            <li className="flex items-start gap-3">
              <Clock size={16} className="mt-0.5 text-navy/40" />
              <span>
                {fmtTime(project.startTime)} – {fmtTime(endTime(project))}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 text-navy/40" />
              <span>{project.location}</span>
            </li>
            <li className="flex items-start gap-3">
              <Video size={16} className="mt-0.5 text-navy/40" />
              <button onClick={copyTeams} className="flex items-center gap-1.5 text-left text-teal-dark hover:underline">
                {copied ? 'Lien copié' : 'Copier le lien Teams'} {copied ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </li>
          </ul>
        </div>

        <div className="card p-6">
          <p className="eyebrow eyebrow--peach">Commanditaire</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="stadium flex h-10 w-10 items-center justify-center bg-peach-pale text-peach-dark">
              <UserRound size={18} />
            </span>
            <div>
              <p className="font-semibold">{project.sponsorName || 'Non renseigné'}</p>
              {project.sponsorTitle && <p className="text-[13px] text-navy/55">{project.sponsorTitle}</p>}
            </div>
          </div>
          <div className="tick-rule my-5" />
          <div className="flex items-center justify-between text-[13.5px]">
            <span className="text-navy/60">Debrief client</span>
            {project.debriefClientDone ? (
              <span className="flex items-center gap-1.5 font-semibold text-lime-dark">
                <Check size={14} /> Réalisé
              </span>
            ) : (
              <span className="text-navy/45">À organiser après la journée</span>
            )}
          </div>
        </div>
      </aside>
    </div>
  )
}
