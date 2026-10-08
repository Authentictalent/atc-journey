'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, CalendarDays, MapPin, Plus, Search, TriangleAlert } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtDate, fmtTime, relativeDay } from '@/lib/dates'
import { dayState, fullName, isDayDone, nextDate, PHASE_LABEL, phaseOf, preProgress, projectParticipants, requiredActions, scheduleFor, venueLabel } from '@/lib/project'
import { wording } from '@/lib/wording'
import type { Phase } from '@/lib/types'
import { Avatar, ButtonLink, EmptyState, FilterChips, FormatPill, PageHeader, Pill, ProgressBar, PurposePill, Stat, cx } from '@/components/ui'

type Filter = 'all' | 'actions' | 'AC' | 'DC'
const PHASE_ORDER: Record<Phase, number> = { 'jour-j': 0, pre: 1, restitution: 2, clos: 3 }
const PHASE_TONE = { 'jour-j': 'lime', pre: 'teal', restitution: 'peach', clos: 'muted' } as const

export default function ProjectsDashboard() {
  const { state } = useStore()
  const me = state.users.find((u) => u.id === state.session?.userId)
  const isAdmin = state.session?.role === 'admin'
  const cdps = state.users.filter((u) => u.role === 'cdp')

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [owner, setOwner] = useState<string>(isAdmin ? 'all' : (me?.id ?? 'all'))

  const rows = useMemo(
    () =>
      state.projects
        .filter((project) => owner === 'all' || project.cdpId === owner)
        .map((project) => {
          const participants = projectParticipants(state, project.id)
          return {
            project,
            participants,
            phase: phaseOf(project, participants),
            actions: requiredActions(project, participants),
            pre: preProgress(project, participants),
            next: nextDate(participants),
            unscheduled: participants.filter((p) => p.slot.status !== 'confirmed').length,
            cdp: state.users.find((u) => u.id === project.cdpId),
          }
        })
        .sort((a, b) => PHASE_ORDER[a.phase] - PHASE_ORDER[b.phase] || (a.next ?? '9999').localeCompare(b.next ?? '9999')),
    [state, owner],
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
  const preDone = allParticipants.length ? Math.round(active.reduce((s, r) => s + r.pre * r.participants.length, 0) / allParticipants.length) : 0
  const actionCount = rows.reduce((s, r) => s + r.actions.length, 0)
  const todayLive = rows.flatMap((r) => r.participants.filter((p) => dayState(p) === 'today').map((p) => ({ p, project: r.project })))

  return (
    <>
      <PageHeader
        eyebrow={`Bonjour ${me?.name.split(' ')[0] ?? ''}`}
        tone="lime"
        title={owner === me?.id ? 'Vos projets' : 'Les projets'}
        description={`${active.length} dispositif${active.length > 1 ? 's' : ''} en cours, ${allParticipants.length} participant${allParticipants.length > 1 ? 's' : ''} accompagné${allParticipants.length > 1 ? 's' : ''}.`}
        actions={
          <ButtonLink href="/projets/nouveau" variant="lime">
            <Plus size={16} /> Nouveau projet
          </ButtonLink>
        }
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Dispositifs actifs" value={active.length} hint={`${rows.length - active.length} clôturé${rows.length - active.length > 1 ? 's' : ''}`} />
          <Stat label="Participants" value={allParticipants.length} hint={`${allParticipants.filter((p) => p.slot.status !== 'confirmed').length} date(s) encore à fixer`} />
          <Stat label="Pré-assessment complété" value={`${preDone} %`} hint="Hogan et questionnaires" />
          <Stat label="Actions à traiter" value={actionCount} tone={actionCount ? 'peach' : undefined} hint={actionCount ? 'Voir le détail ci-dessous' : 'Tout est en ordre'} />
        </div>

        {todayLive.length > 0 && (
          <div className="relative overflow-hidden rounded-3xl bg-navy p-7 text-white sm:p-8">
            <div className="deco-pill hidden border-lime/40 sm:block" style={{ width: 170, height: 56, top: -18, right: -40 }} aria-hidden />
            <span className="stadium inline-flex items-center gap-1.5 bg-lime/15 px-2.5 py-1 text-[11px] font-semibold text-lime">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" /> Aujourd’hui
            </span>
            <h2 className="mt-3 text-[24px] font-medium leading-tight">
              {todayLive.length} {todayLive.length > 1 ? 'journées' : 'journée'} en cours
            </h2>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {todayLive.map(({ p, project }) => {
                const s = scheduleFor(project, p)
                const current = s[p.dayProgress]
                return (
                  <li key={p.id}>
                    <Link href={`/projets/${project.id}/participants/${p.id}`} className="group flex items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-3 transition-colors hover:bg-white/[0.1]">
                      <Avatar name={fullName(p)} size={34} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold">
                          {fullName(p)} · {project.client}
                        </span>
                        <span className="block truncate text-[12.5px] text-white/55">
                          {isDayDone(project, p) ? 'Journée terminée' : current ? `En cours : ${current.catalog.name}` : `Début à ${fmtTime(s[0]?.start ?? project.startTime)}`}
                        </span>
                      </span>
                      <ArrowRight size={15} className="text-lime transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <section>
          <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
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
            <div className="flex flex-col gap-3 sm:flex-row">
              <select value={owner} onChange={(e) => setOwner(e.target.value)} className="field !w-auto !rounded-full !py-2 !text-[13.5px]" aria-label="Cheffe de projet">
                <option value="all">Toutes les cheffes de projet</option>
                {cdps.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.id === me?.id ? `Mes projets (${u.name})` : u.name}
                  </option>
                ))}
              </select>
              <label className="stadium flex w-full items-center gap-2.5 bg-white px-4 py-2 ring-1 ring-navy/10 focus-within:ring-teal sm:w-72">
                <Search size={15} className="text-navy/40" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Client, poste, participant…" className="w-full bg-transparent text-[14px] outline-none placeholder:text-navy/40" />
              </label>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={<Search size={20} />} title="Aucun projet ne correspond">
              Essayez un autre mot-clé, une autre cheffe de projet ou retirez le filtre.
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {filtered.map(({ project, participants, phase, actions, pre, next, unscheduled, cdp }) => {
                const w = wording(project.purpose)
                const lead = state.assessors.find((a) => a.id === project.leadAssessorId)
                return (
                  <Link key={project.id} href={`/projets/${project.id}`} className="card card--hover group block p-6">
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
                        <p className="mt-1 text-[12.5px] text-navy/45">Suivi par {cdp?.name ?? 'cheffe de projet à définir'}</p>
                      </div>

                      <div className="space-y-1.5 text-[13.5px]">
                        <p className="flex items-center gap-2 font-semibold">
                          <CalendarDays size={14} className="text-navy/40" /> {next ? relativeDay(next) : project.period || 'Dates à fixer'}
                        </p>
                        <p className="pl-[22px] text-navy/55">{next ? `Prochaine journée le ${fmtDate(next, false)}` : 'Aucune date confirmée'}</p>
                        {unscheduled > 0 && <p className="pl-[22px] text-[12.5px] font-semibold text-peach-dark">{unscheduled} date{unscheduled > 1 ? 's' : ''} à fixer</p>}
                        <p className="flex items-center gap-2 text-navy/55">
                          <MapPin size={14} className="text-navy/40" /> {venueLabel(project).split(' · ')[0]}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-baseline justify-between text-[13px]">
                          <span className="font-semibold">
                            {participants.length} {participants.length > 1 ? w.participants.toLowerCase() : w.participant.toLowerCase()}
                          </span>
                          <span className="tabular text-navy/50">
                            {w.pre} {pre} %
                          </span>
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
                            className={cx('stadium inline-flex items-center gap-1.5 px-3 py-1 text-[12.5px] font-medium', a.tone === 'peach' ? 'bg-peach-pale text-peach-dark' : 'bg-lime-pale text-navy')}
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
