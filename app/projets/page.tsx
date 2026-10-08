'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, Check, Plus, Search } from 'lucide-react'
import { useStore } from '@/lib/store'
import { FORMATS } from '@/lib/catalog'
import { fmtDate, fmtTime, relativeDay } from '@/lib/dates'
import { dayState, fullName, isDayDone, nextDate, phaseOf, projectParticipants, requiredActions, scheduleFor } from '@/lib/project'
import type { Phase } from '@/lib/types'
import { Avatar, ButtonLink, EmptyState, FilterChips, PageHeader, cx } from '@/components/ui'

type Filter = 'all' | 'todo'
const PHASE_ORDER: Record<Phase, number> = { 'jour-j': 0, pre: 1, restitution: 2, clos: 3 }

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
          return { project, participants, phase: phaseOf(project, participants), actions: requiredActions(project, participants), next: nextDate(participants) }
        })
        .sort((a, b) => PHASE_ORDER[a.phase] - PHASE_ORDER[b.phase] || (a.next ?? '9999').localeCompare(b.next ?? '9999')),
    [state, owner],
  )

  const filtered = rows.filter((r) => {
    if (filter === 'todo' && !r.actions.length) return false
    const q = query.trim().toLowerCase()
    return !q || [r.project.client, r.project.position, ...r.participants.map(fullName)].some((s) => s.toLowerCase().includes(q))
  })

  const todayLive = rows.flatMap((r) => r.participants.filter((p) => dayState(p) === 'today').map((p) => ({ p, project: r.project })))

  return (
    <>
      <PageHeader
        eyebrow={`Bonjour ${me?.name.split(' ')[0] ?? ''}`}
        tone="lime"
        title={owner === me?.id ? 'Vos projets' : 'Les projets'}
        actions={
          <ButtonLink href="/projets/nouveau" variant="lime">
            <Plus size={16} /> Nouveau projet
          </ButtonLink>
        }
      />

      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6">
        {todayLive.length > 0 && (
          <div className="relative overflow-hidden rounded-3xl bg-navy p-7 text-white sm:p-8">
            <div className="deco-pill hidden border-lime/40 sm:block" style={{ width: 170, height: 56, top: -18, right: -40 }} aria-hidden />
            <span className="stadium inline-flex items-center gap-1.5 bg-lime/15 px-2.5 py-1 text-[11px] font-semibold text-lime">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" /> Aujourd’hui
            </span>
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
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <FilterChips<Filter>
              value={filter}
              onChange={setFilter}
              options={[
                { id: 'all', label: 'Tous', count: rows.length },
                { id: 'todo', label: 'À traiter', count: rows.filter((r) => r.actions.length).length },
              ]}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <select value={owner} onChange={(e) => setOwner(e.target.value)} className="field !w-auto !rounded-full !py-2 !text-[13.5px]" aria-label="Cheffe de projet">
                <option value="all">Toutes les cheffes de projet</option>
                {cdps.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.id === me?.id ? 'Mes projets' : u.name}
                  </option>
                ))}
              </select>
              <label className="stadium flex w-full items-center gap-2.5 bg-white px-4 py-2 ring-1 ring-navy/10 focus-within:ring-teal sm:w-64">
                <Search size={15} className="text-navy/40" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher…" className="w-full bg-transparent text-[14px] outline-none placeholder:text-navy/40" />
              </label>
            </div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={<Search size={20} />} title="Aucun projet ici">
              Changez de filtre ou de cheffe de projet.
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {filtered.map(({ project, actions, next }) => (
                <Link key={project.id} href={`/projets/${project.id}`} className="card card--hover group flex flex-wrap items-center gap-x-8 gap-y-4 p-6">
                  <div className="min-w-[220px] flex-1">
                    <h3 className="font-heading text-[20px] font-medium leading-snug">{project.client}</h3>
                    <p className="truncate text-[14px] text-navy/60">{project.position}</p>
                    <p className="mt-1 text-[12px] text-navy/40">
                      {project.purpose} {FORMATS[project.format].label}
                    </p>
                  </div>

                  <div className="w-44 text-[13.5px]">
                    <p className="font-semibold">{next ? relativeDay(next) : 'Pas de date'}</p>
                    <p className="text-navy/50">{next ? fmtDate(next, false) : project.period || 'à fixer'}</p>
                  </div>

                  <div className="w-64">
                    {actions.length ? (
                      <ul className="space-y-1">
                        {actions.slice(0, 2).map((a) => (
                          <li key={a.label} className="flex items-center gap-2 text-[13px]">
                            <span className={cx('h-1.5 w-1.5 shrink-0 rounded-full', a.tone === 'peach' ? 'bg-peach' : 'bg-lime-dark')} />
                            {a.label}
                          </li>
                        ))}
                        {actions.length > 2 && <li className="pl-3.5 text-[12.5px] text-navy/45">et {actions.length - 2} autre{actions.length > 3 ? 's' : ''}</li>}
                      </ul>
                    ) : (
                      <p className="flex items-center gap-2 text-[13px] text-navy/50">
                        <Check size={14} className="text-lime-dark" /> Rien à faire
                      </p>
                    )}
                  </div>

                  <ArrowRight size={18} className="text-navy/30 transition-transform group-hover:translate-x-0.5 group-hover:text-lime-dark" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
