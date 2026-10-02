'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Check, LockOpen, Mail, Send, UserRound } from 'lucide-react'
import { useStore } from '@/lib/store'
import { COMPETENCIES, POST_QUESTIONS, PRE_QUESTIONS, SCALE, competencyById } from '@/lib/catalog'
import { fmtDate, fmtTime } from '@/lib/dates'
import { features, fullName, gridKey, journey } from '@/lib/project'
import { wording } from '@/lib/wording'
import { JourneyTrack } from '@/components/JourneyTrack'
import { Button, EmptyState, PageHeader, Pill, SectionTitle } from '@/components/ui'
import { UnlockFeedbackDialog } from '@/components/cdp/ParticipantsTab'

export default function ParticipantProfile() {
  const { id, pid } = useParams<{ id: string; pid: string }>()
  const { state } = useStore()
  const [unlocking, setUnlocking] = useState(false)
  const [reminded, setReminded] = useState(false)

  const project = state.projects.find((p) => p.id === id)
  const p = state.participants.find((x) => x.id === pid)
  if (!project || !p)
    return (
      <div className="mx-auto max-w-3xl px-4 pt-16">
        <EmptyState icon={<UserRound size={20} />} title="Participant introuvable" />
      </div>
    )

  const w = wording(project.purpose)
  const f = features(project)
  const steps = journey(project, p)
  const pending = steps.find((s) => s.state === 'current')
  const gridScores = project.competencyIds.map((c) => ({ c: competencyById(c), entry: state.grid[gridKey(p.id, c)] })).filter((x) => x.c)
  const hasGrid = f.grid && gridScores.some((g) => g.entry?.score)

  return (
    <>
      <PageHeader
        back={{ href: `/cdp/projets/${project.id}?onglet=participants`, label: `${project.client} · ${w.participants}` }}
        eyebrow={`${w.participant} · ${project.client}`}
        tone="peach"
        title={fullName(p)}
        description={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>{p.currentRole}</span>
            <span className="flex items-center gap-1.5 text-[14px] text-navy/50">
              <Mail size={14} /> {p.email}
            </span>
          </span>
        }
        actions={
          pending && pending.key !== 'day' && pending.key !== 'feedback' ? (
            <Button variant={reminded ? 'ghost' : 'outline'} size="sm" onClick={() => setReminded(true)} disabled={reminded}>
              {reminded ? (
                <>
                  <Check size={14} /> Relance envoyée
                </>
              ) : (
                <>
                  <Send size={14} /> Relancer · {pending.label}
                </>
              )}
            </Button>
          ) : undefined
        }
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6">
        <div className="card p-6 sm:p-8">
          <p className="eyebrow mb-6">Parcours</p>
          <JourneyTrack steps={steps} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-10">
            {f.preQuestionnaire && (
              <section>
                <SectionTitle eyebrow={w.pre} title="Ce que nous a confié le participant" />
                {p.preQuestionnaire === 'done' && Object.keys(p.preAnswers).length ? (
                  <div className="card divide-y divide-navy/[0.07]">
                    {PRE_QUESTIONS.filter((q) => p.preAnswers[q.id]).map((q) => (
                      <div key={q.id} className="px-6 py-5">
                        <p className="text-[12.5px] font-semibold text-navy/50">{q.label}</p>
                        <p className="mt-1.5 text-[14.5px] leading-relaxed">{p.preAnswers[q.id]}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card px-6 py-5 text-[14px] text-navy/55">
                    {p.preQuestionnaire === 'done' ? 'Questionnaire envoyé.' : 'Questionnaire pas encore complété.'}
                  </div>
                )}
              </section>
            )}

            {hasGrid && (
              <section>
                <SectionTitle eyebrow="Évaluation" title="Grille comportementale" />
                <div className="card divide-y divide-navy/[0.07]">
                  {gridScores.map(({ c, entry }) => (
                    <div key={c.id} className="grid gap-2 px-6 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <p className="text-[14.5px] font-semibold">{c.name}</p>
                        {entry?.evidence && <p className="mt-0.5 text-[13px] text-navy/55">{entry.evidence}</p>}
                      </div>
                      <div className="flex items-center gap-1" aria-label={entry?.score ? `${entry.score} sur 5` : 'Non évalué'}>
                        {SCALE.map((s) => (
                          <span key={s.value} className={`h-2 w-7 rounded-full ${entry?.score && s.value <= entry.score ? 'bg-lime-dark' : 'bg-navy/[0.08]'}`} />
                        ))}
                        <span className="tabular ml-2 w-20 text-right text-[12.5px] text-navy/55">{entry?.score ? SCALE[entry.score - 1].label : '—'}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[12.5px] text-navy/45">Renseignée par le lead assesseur. Visible par l’équipe ATC uniquement.</p>
              </section>
            )}

            {f.postQuestionnaire && p.postQuestionnaire === 'done' && (
              <section>
                <SectionTitle eyebrow={w.post} title="Retour à chaud" />
                <div className="card divide-y divide-navy/[0.07]">
                  {POST_QUESTIONS.filter((q) => p.postAnswers[q.id]).map((q) => (
                    <div key={q.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                      <p className="text-[14px]">{q.label}</p>
                      {q.kind === 'rating' ? (
                        <Pill tone="lime">{p.postAnswers[q.id]} / 5</Pill>
                      ) : (
                        <p className="w-full text-[14px] text-navy/65">« {p.postAnswers[q.id]} »</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card p-6">
              <p className="eyebrow eyebrow--lime">Inventaires Hogan</p>
              <p className="mt-3 text-[15px] font-semibold">{p.hogan === 'done' ? 'Complétés' : 'En attente'}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-navy/55">
                Les rapports sont consultés par les assesseurs sur la plateforme Hogan. Le participant voit uniquement son statut.
              </p>
            </div>

            {f.feedback && (
              <div className="card p-6">
                <p className="eyebrow eyebrow--peach">Feedback</p>
                {p.feedback.status === 'unlocked' ? (
                  <>
                    <p className="mt-3 text-[15px] font-semibold">Débloqué</p>
                    {p.feedback.sessionDate && (
                      <p className="mt-1 text-[13.5px] text-navy/60">
                        Session le {fmtDate(p.feedback.sessionDate)}
                        {p.feedback.sessionTime ? ` à ${fmtTime(p.feedback.sessionTime)}` : ''}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="mt-3 text-[15px] font-semibold">Verrouillé</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-navy/55">
                      {project.debriefClientDone ? 'Le debrief client a eu lieu : vous pouvez organiser la session.' : 'Il se débloque après le debrief client.'}
                    </p>
                    {project.debriefClientDone && (
                      <Button variant="lime" size="sm" className="mt-4" onClick={() => setUnlocking(true)}>
                        <LockOpen size={13} /> Débloquer le feedback
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}

            {f.grid && !hasGrid && (
              <div className="rounded-2xl bg-teal-pale p-5 text-[13px] leading-relaxed text-teal-dark">
                La grille comportementale ({COMPETENCIES.filter((c) => project.competencyIds.includes(c.id)).length} compétences) apparaîtra ici une fois renseignée par le lead.
              </div>
            )}
          </aside>
        </div>
      </div>

      <UnlockFeedbackDialog participant={unlocking ? p : null} onClose={() => setUnlocking(false)} />
    </>
  )
}
