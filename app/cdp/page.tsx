'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, MapPin, Plus, Search, TriangleAlert } from 'lucide-react'
import { useStore } from '@/lib/store'
import { DEMO_CDP } from '@/lib/seed'
import { fmtDate, relativeDay } from '@/lib/dates'
import { PHASE_LABEL, phaseOf, preProgress, projectParticipants, requiredActions, fullName, schedule } from '@/lib/project'
import { wording } from '@/lib/wording'
import type { Phase } from '@/lib/types'
import { Avatar, ButtonLink, EmptyState, FilterChips, FormatPill, PageHeader, Pill, ProgressBar, PurposePill, Stat, cx } from '@/components/ui'

type Filter = 'all' | 'actions' | 'AC' | 'DC'
const PHASE_ORDER: Record<Phase, number> = { 'jour-j': 0, pre: 1, restitution: 2, clos: 3 }
const PHASE_TONE = { 'jour-j': 'lime', pre: 'teal', restitution: 'peach', clos: 'muted' } as const

export default function CdpDashboard() {
  const { state } = useStore()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const rows = useMemo(
    () =>
      state.projects
        .map((project) => {
          const participants = projectParticipants(state, project.id)
          return {
            project,
            participants,
            phase: phaseOf(project, participants),
            actions: requiredActions(project, participants),
            pre: preProgress(project, participants),
          }
        })
        .sort((a, b) => PHASE_ORDER[a.phase] - PHASE_ORDER[b.phase] || a.project.date.localeCompare(b.project.date)),
    [state],
  )

  const filtered = rows.filter((r) => {
    if (filter === 'actions' && !r.actions.length) return false
    if ((filter === 'AC' || filter === 'DC') && r.project.purpose !== filter) return false
    const q = query.trim().toLowerCase()
    if (!q) return true
    return [r.project.client, r.project.position, ...r.participants.map(fullName)].some((s) => s.toLowerCase().includes(q))
  })

  const active = rows.filter((r) => r.phase !== 'clos')
  const allParticipants = active.flatMap((r) => r.participants)
  const preDone = active.length ? Math.round(active.reduce((s, r) => s + r.pre * r.participants.length, 0) / Math.max(1, allParticipants.length)) : 0
  const actionCount = rows.reduce((s, r) => s + r.actions.length, 0)
  const live = rows.find((r) => r.phase === 'jour-j')

  return (
    <>
      <PageHeader
        eyebrow={`Bonjour ${DEMO_CDP.name.split(' ')[0]}`}
        tone="lime"
        title="Vos dispositifs"
        description={`${active.length} dispositifs en cours, ${allParticipants.length} participants accompagnés.`}
        actions={
          <ButtonLink href="/cdp/projets/nouveau" variant="lime">
            <Plus size={16} /> Nouveau projet
          </ButtonLink>
        }
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Dispositifs actifs" value={active.length} hint={`${rows.length - active.length} clôturé${rows.length - active.length > 1 ? 's' : ''}`} />
          <Stat label="Participants" value={allParticipants.length} hint="sur les dispositifs actifs" />
          <Stat label="Pré-assessment complété" value={`${preDone} %`} hint="Hogan et questionnaires" />
          <Stat label="Actions à traiter" value={actionCount} tone={actionCount ? 'peach' : undefined} hint={actionCount ? 'Voir le détail ci-dessous' : 'Tout est en ordre'} />
        </div>

        {live && (
          <Link href={`/cdp/projets/${live.project.id}`} className="group relative block overflow-hidden rounded-3xl bg-navy p-7 text-white transition-shadow hover:shadow-[0_24px_60px_-24px_rgba(0,26,51,0.6)] sm:p-8">
            <div className="deco-pill hidden border-lime/40 sm:block" style={{ width: 170, height: 56, top: -18, right: -40 }} aria-hidden />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div>
                <span className="stadium inline-flex items-center gap-1.5 bg-lime/15 px-2.5 py-1 text-[11px] font-semibold text-lime">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" /> Jour J aujourd’hui
                </span>
                <h2 className="mt-3 text-[26px] font-medium leading-tight">
                  {live.project.client} · {live.project.position}
                </h2>
                <p className="mt-1.5 text-[14px] text-white/60">
                  {schedule(live.project).length} exercices · {live.participants.length} {wording(live.project.purpose).participants.toLowerCase()} · {live.project.location}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex -space-x-2">
                  {live.participants.map((p) => (
                    <span key={p.id} className="rounded-full ring-2 ring-navy">
                      <Avatar name={fullName(p)} size={38} />
                    </span>
                  ))}
                </div>
                <span className="stadium inline-flex items-center gap-2 bg-lime px-5 py-2.5 text-[14px] font-semibold text-navy">
                  Suivre la journée <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        )}

        <section>
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <FilterChips<Filter>
              value={filter}
              onChange={setFilter}
              options={[
                { id: 'all', label: 'Tous', count: rows.length },
                { id: 'actions', label: 'Actions requises', count: rows.filter((r) => r.actions.length).length },
                { id: 'AC', label: 'Sélection · AC', count: rows.filter((r) => r.project.purpose === 'AC').length },
                { id: 'DC', label: 'Développement · DC', count: rows.filter((r) => r.project.purpose === 'DC').length },
              ]}
            />
            <label className="stadium flex w-full items-center gap-2.5 bg-white px-4 py-2 ring-1 ring-navy/10 focus-within:ring-teal lg:w-80">
              <Search size={15} className="text-navy/40" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Client, poste, participant…"
                className="w-full bg-transparent text-[14px] outline-none placeholder:text-navy/40"
              />
            </label>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={<Search size={20} />} title="Aucun dispositif ne correspond">
              Essayez un autre mot-clé ou retirez le filtre.
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {filtered.map(({ project, participants, phase, actions, pre }) => {
                const w = wording(project.purpose)
                const lead = state.assessors.find((a) => a.id === project.leadAssessorId)
                return (
                  <Link key={project.id} href={`/cdp/projets/${project.id}`} className="card card--hover group block p-6">
                    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Pill tone={PHASE_TONE[phase]} dot>
                            {PHASE_LABEL[phase]}
                          </Pill>
                          <FormatPill format={project.format} />
                          <PurposePill purpose={project.purpose} />
                        </div>
                        <h3 className="mt-3 font-heading text-[21px] font-medium leading-snug">{project.client}</h3>
                        <p className="truncate text-[14px] text-navy/60">{project.position}</p>
                      </div>

                      <div className="space-y-1.5 text-[13.5px]">
                        <p className="flex items-center gap-2 font-semibold">
                          <CalendarDays size={14} className="text-navy/40" /> {relativeDay(project.date)}
                        </p>
                        <p className="pl-[22px] text-navy/55">{fmtDate(project.date, false)}</p>
                        <p className="flex items-center gap-2 text-navy/55">
                          <MapPin size={14} className="text-navy/40" /> {project.location.split(' · ')[0]}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between text-[13px]">
                          <span className="font-semibold">
                            {participants.length} {participants.length > 1 ? w.participants.toLowerCase() : w.participant.toLowerCase()}
                          </span>
                          <span className="tabular text-navy/50">{w.pre} {pre} %</span>
                        </div>
                        <ProgressBar value={pre} className="mt-2.5" />
                        <p className="mt-2.5 text-[12.5px] text-navy/50">{lead ? `Lead : ${lead.name}` : 'Lead à assigner'}</p>
                      </div>

                      <ArrowRight size={18} className="hidden text-navy/30 transition-transform group-hover:translate-x-0.5 group-hover:text-lime-dark lg:block" />
                    </div>

                    {actions.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2 border-t border-navy/[0.07] pt-4">
                        {actions.map((a) => (
                          <span
                            key={a.label}
                            className={cx(
                              'stadium inline-flex items-center gap-1.5 px-3 py-1 text-[12.5px] font-medium',
                              a.tone === 'peach' ? 'bg-peach-pale text-peach-dark' : 'bg-lime-pale text-navy',
                            )}
                          >
                            {a.tone === 'peach' && <TriangleAlert size={12} />}
                            {a.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
