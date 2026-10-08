'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { CalendarDays, Check, Clock, MapPin, ShieldCheck } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtDate, fmtDuration, fmtShort, relativeDay } from '@/lib/dates'
import { features, fullName, isDayDone, nextDate, PHASE_LABEL, phaseOf, projectParticipants, venueLabel } from '@/lib/project'
import { wording } from '@/lib/wording'
import { Avatar, FormatPill, PageHeader, Pill, PurposePill, Stat, cx } from '@/components/ui'

function Status({ done, label }: { done: boolean; label?: string }) {
  return done ? (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-lime-dark">
      <Check size={14} strokeWidth={3} /> {label ?? 'Fait'}
    </span>
  ) : (
    <span className="text-[13px] text-navy/40">{label ?? 'En attente'}</span>
  )
}

export default function SponsorPage() {
  const { state, dispatch } = useStore()
  const search = useSearchParams()
  const requested = search.get('projet')

  useEffect(() => {
    if (requested && requested !== state.session?.projectId && state.projects.some((p) => p.id === requested))
      dispatch({ type: 'signIn', session: { role: 'sponsor', projectId: requested } })
  }, [requested, state.session?.projectId, state.projects, dispatch])

  const project = state.projects.find((p) => p.id === (requested ?? state.session?.projectId))
  if (!project) return null

  const participants = projectParticipants(state, project.id)
  const w = wording(project.purpose)
  const f = features(project)
  const phase = phaseOf(project, participants)
  const n = participants.length
  const next = nextDate(participants)
  const cdp = state.users.find((u) => u.id === project.cdpId)
  const count = (fn: (p: (typeof participants)[number]) => boolean) => participants.filter(fn).length

  return (
    <>
      <PageHeader
        eyebrow={`${project.client} · ${w.center}`}
        tone="peach"
        title="Suivi du dispositif"
        description={
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1">{project.position}</span>
            <FormatPill format={project.format} />
            <PurposePill purpose={project.purpose} />
            <Pill tone="lime" dot>
              {PHASE_LABEL[phase]}
            </Pill>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label={w.participants} value={n} />
          <Stat label="Hogan complétés" value={`${count((p) => p.hogan === 'done')} / ${n}`} />
          <Stat label={`${w.pre} complète`} value={`${count((p) => p.hogan === 'done' && (!f.preQuestionnaire || p.preQuestionnaire === 'done'))} / ${n}`} />
          <Stat label={f.feedback ? 'Feedbacks organisés' : 'Journées réalisées'} value={`${f.feedback ? count((p) => p.feedback.status === 'unlocked') : count((p) => isDayDone(project, p))} / ${n}`} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="card self-start overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="border-b border-navy/[0.07] text-[11px] font-semibold uppercase tracking-wider text-navy/45">
                  <th className="px-6 py-4 font-semibold">{w.participant}</th>
                  <th className="px-3 py-4 font-semibold">Hogan</th>
                  {f.preQuestionnaire && <th className="px-3 py-4 font-semibold">Questionnaire</th>}
                  <th className="px-3 py-4 font-semibold">{w.short}</th>
                  {f.postQuestionnaire && <th className="px-3 py-4 font-semibold">Retour</th>}
                  {f.feedback && <th className="px-3 py-4 font-semibold">Feedback</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/[0.06]">
                {participants.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-3">
                        <Avatar name={fullName(p)} size={34} tone="navy" />
                        <span>
                          <span className="block text-[14.5px] font-semibold">{fullName(p)}</span>
                          <span className="block text-[12.5px] text-navy/50">{p.currentRole}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <Status done={p.hogan === 'done'} />
                    </td>
                    {f.preQuestionnaire && (
                      <td className="px-3 py-4">
                        <Status done={p.preQuestionnaire === 'done'} />
                      </td>
                    )}
                    <td className="px-3 py-4">
                      <Status done={isDayDone(project, p)} label={isDayDone(project, p) ? 'Réalisé' : p.slot.confirmed ? fmtShort(p.slot.confirmed.date) : 'Date à fixer'} />
                    </td>
                    {f.postQuestionnaire && (
                      <td className="px-3 py-4">
                        <Status done={p.postQuestionnaire === 'done'} label={p.postQuestionnaire === 'done' ? 'Reçu' : 'À venir'} />
                      </td>
                    )}
                    {f.feedback && (
                      <td className="px-3 py-4">
                        <Status
                          done={p.feedback.status === 'unlocked'}
                          label={p.feedback.status === 'unlocked' ? (p.feedback.sessionDate ? `Le ${fmtShort(p.feedback.sessionDate)}` : 'Organisé') : 'À organiser'}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <aside className="space-y-4">
            <div className="card p-6">
              <p className="eyebrow eyebrow--lime">Organisation</p>
              {next ? (
                <>
                  <p className="mt-3 font-heading text-[21px] font-medium leading-snug first-letter:uppercase">{fmtDate(next)}</p>
                  <p className="text-[13px] text-navy/55">Prochaine journée · {relativeDay(next)}</p>
                </>
              ) : (
                <p className="mt-3 font-heading text-[19px] font-medium leading-snug">{project.period || 'Dates en cours de planification'}</p>
              )}
              <ul className="mt-4 space-y-2.5 text-[14px]">
                <li className="flex items-center gap-3">
                  <Clock size={15} className="shrink-0 text-navy/40" /> {fmtDuration(project.exercises.reduce((s, e) => s + e.duration, 0))} d’exercices par {w.participant.toLowerCase()}
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={15} className="shrink-0 text-navy/40" /> {venueLabel(project)}
                </li>
                <li className="flex items-center gap-3">
                  <CalendarDays size={15} className="text-navy/40" /> Debrief avec ATC : {project.debriefClientDone ? 'réalisé' : 'après les journées'}
                </li>
              </ul>
            </div>
            <div className={cx('relative overflow-hidden rounded-3xl bg-navy p-6 text-white')}>
              <div className="deco-pill border-lime/35" style={{ width: 130, height: 44, top: -16, right: -26 }} aria-hidden />
              <ShieldCheck size={20} className="text-lime" />
              <p className="mt-3 text-[15px] font-semibold">Confidentialité des évaluations</p>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/60">
                Vous suivez l’avancement. Les observations et résultats vous sont restitués par {cdp?.name ?? 'votre cheffe de projet'} et le lead assesseur lors du debrief.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
