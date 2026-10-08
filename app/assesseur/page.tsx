'use client'

import Link from 'next/link'
import { ArrowRight, CalendarDays, Crown, MapPin } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtDate, fmtTime, relativeDay } from '@/lib/dates'
import { assessorSessions, CHECKLIST, endTime, fullName, gridKey, isDayDone, schedule, scheduleFor, venueLabel, type SessionStatus } from '@/lib/project'
import { wording } from '@/lib/wording'
import type { Project } from '@/lib/types'
import { Avatar, EmptyState, FormatPill, PageHeader, Pill, ProgressBar, Stat, cx } from '@/components/ui'

const GROUPS: { status: SessionStatus; eyebrow: string; title: string }[] = [
  { status: 'live', eyebrow: 'Aujourd’hui', title: 'En direct' },
  { status: 'preparation', eyebrow: 'À venir', title: 'À préparer' },
  { status: 'done', eyebrow: 'Historique', title: 'Sessions passées' },
]

export default function AssessorDashboard() {
  const { state } = useStore()
  const assessorId = state.session?.assessorId ?? ''
  const me = state.assessors.find((a) => a.id === assessorId)
  const sessions = assessorSessions(state, assessorId)

  const prep = (participantId: string) => CHECKLIST.filter((c) => state.checklist[`${assessorId}:${participantId}:${c.id}`]).length
  const upcoming = sessions.filter((s) => s.status === 'preparation')
  const prepRate = upcoming.length ? Math.round((upcoming.reduce((n, s) => n + prep(s.participant.id), 0) / (upcoming.length * CHECKLIST.length)) * 100) : 100

  const byProject = (status: SessionStatus) => {
    const map = new Map<string, { project: Project; role: 'lead' | 'second'; items: typeof sessions }>()
    sessions
      .filter((s) => s.status === status)
      .forEach((s) => {
        const entry = map.get(s.project.id) ?? { project: s.project, role: s.role, items: [] }
        entry.items.push(s)
        map.set(s.project.id, entry)
      })
    return [...map.values()]
  }

  return (
    <>
      <PageHeader eyebrow={`Bonjour ${me?.name.split(' ')[0] ?? ''}`} tone="lime" title="Vos sessions" description="Préparez chaque participant, prenez vos notes en direct, consolidez la grille." />

      <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Aujourd’hui" value={sessions.filter((s) => s.status === 'live').length} hint="participants en direct" />
          <Stat label="À venir" value={upcoming.length} hint="participants à préparer" />
          <Stat label="En tant que lead" value={new Set(sessions.filter((s) => s.role === 'lead').map((s) => s.project.id)).size} hint="dispositifs" />
          <Stat label="Préparation" value={`${prepRate} %`} hint="checklists des sessions à venir" />
        </div>

        {sessions.length === 0 && (
          <EmptyState icon={<CalendarDays size={20} />} title="Aucune session assignée">
            Les dispositifs sur lesquels vous êtes positionné·e apparaîtront ici.
          </EmptyState>
        )}

        {GROUPS.map((g) => {
          const groups = byProject(g.status)
          if (!groups.length) return null
          return (
            <section key={g.status}>
              <p className={cx('eyebrow', g.status === 'live' && 'eyebrow--lime', g.status === 'done' && 'eyebrow--muted')}>{g.eyebrow}</p>
              <h2 className="dot mt-1.5 text-[26px] font-medium">{g.title}</h2>
              <div className="mt-6 space-y-5">
                {groups.map(({ project, role, items }) => {
                  const w = wording(project.purpose)
                  const mine = project.exercises.filter((e) => e.assessorId === assessorId).length
                  const live = g.status === 'live'
                  return (
                    <div key={project.id} className={cx('overflow-hidden rounded-3xl', live ? 'bg-navy text-white' : 'card')}>
                      <div className="flex flex-wrap items-start justify-between gap-4 p-6 sm:p-7">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            {role === 'lead' ? (
                              <Pill tone={live ? 'lime' : 'solid'}>
                                <Crown size={11} /> Lead
                              </Pill>
                            ) : (
                              <Pill tone={live ? 'lime' : 'navy'}>Second assesseur</Pill>
                            )}
                            <FormatPill format={project.format} />
                            {live && (
                              <span className="stadium inline-flex items-center gap-1.5 bg-lime/15 px-2.5 py-1 text-[11px] font-semibold text-lime">
                                <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" /> En direct
                              </span>
                            )}
                          </div>
                          <h3 className="mt-3 font-heading text-[22px] font-medium">{project.client}</h3>
                          <p className={cx('text-[14px]', live ? 'text-white/60' : 'text-navy/60')}>{project.position}</p>
                        </div>
                        <div className={cx('space-y-1 text-right text-[13px]', live ? 'text-white/60' : 'text-navy/55')}>
                          <p className="flex items-center justify-end gap-1.5">
                            <MapPin size={13} /> {venueLabel(project)}
                          </p>
                          <p>
                            {mine} exercice{mine > 1 ? 's' : ''} sur {schedule(project).filter((s) => s.catalog.assessed).length} à mener
                          </p>
                        </div>
                      </div>
                      <ul className={cx('divide-y', live ? 'divide-white/10 border-t border-white/10' : 'divide-navy/[0.07] border-t border-navy/[0.07]')}>
                        {items.map(({ participant: p }) => {
                          const done = prep(p.id)
                          const graded = project.competencyIds.filter((c) => state.grid[gridKey(p.id, c)]?.score).length
                          const current = scheduleFor(project, p)[p.dayProgress]
                          return (
                            <li key={p.id}>
                              <Link
                                href={`/assesseur/sessions/${p.id}`}
                                className={cx('group flex flex-wrap items-center gap-4 px-6 py-4 transition-colors sm:px-7', live ? 'hover:bg-white/[0.05]' : 'hover:bg-cream-warm')}
                              >
                                <Avatar name={fullName(p)} size={36} tone={live ? 'lime' : 'navy'} />
                                <span className="min-w-[180px] flex-1">
                                  <span className="block text-[14.5px] font-semibold">{fullName(p)}</span>
                                  <span className={cx('block text-[12.5px]', live ? 'text-white/50' : 'text-navy/50')}>
                                    {w.participant} · {p.currentRole}
                                  </span>
                                </span>
                                <span className={cx('w-40 text-[12.5px]', live ? 'text-white/70' : 'text-navy/60')}>
                                  {p.slot.confirmed ? (
                                    <>
                                      <span className={cx('flex items-center gap-1.5 font-semibold', live ? 'text-white' : 'text-navy')}>
                                        <CalendarDays size={13} /> {g.status === 'done' ? fmtDate(p.slot.confirmed.date, false) : relativeDay(p.slot.confirmed.date)}
                                      </span>
                                      <span className="tabular font-mono">
                                        {fmtTime(p.slot.confirmed.time)} à {fmtTime(endTime(project, p.slot.confirmed.time))}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="font-semibold text-peach-dark">Date à fixer</span>
                                  )}
                                </span>
                                <span className="w-56 text-[12.5px]">
                                  {g.status === 'preparation' && (
                                    <>
                                      <span className="flex justify-between text-navy/55">
                                        <span>Préparation</span>
                                        <span className="tabular">
                                          {done} / {CHECKLIST.length}
                                        </span>
                                      </span>
                                      <ProgressBar value={(done / CHECKLIST.length) * 100} className="mt-1.5" />
                                    </>
                                  )}
                                  {g.status === 'live' && (
                                    <span className="text-white/70">
                                      {isDayDone(project, p) ? 'Journée terminée' : current ? `En cours : ${current.catalog.name}` : 'Pas encore commencé'}
                                    </span>
                                  )}
                                  {g.status === 'done' && (
                                    <span className="text-navy/55">
                                      {role === 'lead' && project.format !== 'light' ? `Grille ${graded} / ${project.competencyIds.length}` : 'Notes archivées'}
                                    </span>
                                  )}
                                </span>
                                <ArrowRight size={16} className={cx('transition-transform group-hover:translate-x-0.5', live ? 'text-lime' : 'text-navy/30')} />
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </>
  )
}
