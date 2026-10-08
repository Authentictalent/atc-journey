'use client'

import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Check, Crown, Download, Lock, Sparkles, UserRound } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PRE_QUESTIONS, SCALE, competencyById } from '@/lib/catalog'
import { daysBetween, fmtDate, fmtDuration, fmtTime, todayISO } from '@/lib/dates'
import { CHECKLIST, features, fullName, gridKey, noteKey, participantDate, scheduleFor } from '@/lib/project'
import { wording } from '@/lib/wording'
import type { GridEntry } from '@/lib/types'
import { Avatar, Button, EmptyState, ExerciseIcon, PageHeader, Pill, ProgressBar, Tabs, cx } from '@/components/ui'

type Tab = 'prep' | 'notes' | 'grid'

export default function AssessorSession() {
  const { pid } = useParams<{ pid: string }>()
  const { state, dispatch } = useStore()
  const assessorId = state.session?.assessorId ?? ''
  const p = state.participants.find((x) => x.id === pid)
  const project = state.projects.find((x) => x.id === p?.projectId)
  const date = p ? participantDate(p) : null
  const d = date ? daysBetween(todayISO(), date) : 1
  const [tab, setTab] = useState<Tab>(d > 0 ? 'prep' : 'notes')

  if (!p || !project)
    return (
      <div className="mx-auto max-w-3xl px-4 pt-16">
        <EmptyState icon={<UserRound size={20} />} title="Session introuvable" />
      </div>
    )

  const w = wording(project.purpose)
  const f = features(project)
  const isLead = project.leadAssessorId === assessorId
  const slots = scheduleFor(project, p).filter((s) => s.catalog.assessed)
  const mineSlots = isLead ? slots : slots.filter((s) => s.assessorId === assessorId)
  const checkDone = CHECKLIST.filter((c) => state.checklist[`${assessorId}:${p.id}:${c.id}`]).length
  const graded = project.competencyIds.filter((c) => state.grid[gridKey(p.id, c)]?.score).length

  const download = (slot: (typeof slots)[number]) => {
    const text = [
      `${slot.catalog.name} · ${project.client}`,
      `${w.participant} : ${fullName(p)}`,
      `${date ? fmtDate(date) : 'Date à fixer'} · ${fmtTime(slot.start)} à ${fmtTime(slot.end)}`,
      '',
      'OBJECTIF',
      slot.catalog.objective,
      '',
      'CONSIGNES DONNÉES AU PARTICIPANT',
      ...slot.catalog.instructions.map((i) => `- ${i}`),
      '',
      'SUPPORTS',
      ...slot.catalog.materials.map((m) => `- ${m.name}`),
    ].join('\n')
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `fiche-${slot.catalog.id}-${p.lastName.toLowerCase()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <PageHeader
        back={{ href: '/assesseur', label: 'Mes sessions' }}
        eyebrow={`${w.participant} · ${project.client} · ${!date ? 'Date à fixer' : d > 0 ? fmtDate(date, false) : d === 0 ? 'Aujourd’hui' : 'Session passée'}`}
        tone="lime"
        title={fullName(p)}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <span className="mr-1">{p.currentRole}</span>
            {isLead ? (
              <Pill tone="solid">
                <Crown size={11} /> Vous êtes lead
              </Pill>
            ) : (
              <Pill tone="navy">Second assesseur</Pill>
            )}
          </span>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Tabs<Tab>
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'prep', label: 'Préparation', count: checkDone },
            { id: 'notes', label: 'Notes en direct', count: mineSlots.length },
            ...(f.grid ? [{ id: 'grid' as const, label: 'Grille comportementale', count: graded }] : []),
          ]}
        />

        <div className="pt-8">
          {/* ---------- Préparation ---------- */}
          {tab === 'prep' && (
            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div className="space-y-8">
                <section className="card p-6 sm:p-7">
                  <p className="eyebrow">Dossier du participant</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Avatar name={fullName(p)} size={44} tone="navy" />
                    <div>
                      <p className="text-[16px] font-semibold">{fullName(p)}</p>
                      <p className="text-[13px] text-navy/55">{p.currentRole}</p>
                    </div>
                  </div>
                  <div className="tick-rule my-6" />
                  {f.preQuestionnaire && p.preQuestionnaire === 'done' && Object.keys(p.preAnswers).length ? (
                    <dl className="space-y-5">
                      {PRE_QUESTIONS.filter((q) => p.preAnswers[q.id]).map((q) => (
                        <div key={q.id}>
                          <dt className="text-[12.5px] font-semibold text-navy/50">{q.label}</dt>
                          <dd className="mt-1 text-[14.5px] leading-relaxed">{p.preAnswers[q.id]}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-[14px] text-navy/55">{f.preQuestionnaire ? `Le questionnaire ${w.pre} n’est pas encore complété.` : 'Format Light : pas de questionnaire préalable.'}</p>
                  )}
                  <div className="mt-6 flex items-center gap-3 rounded-2xl bg-teal-pale px-5 py-4 text-[13.5px] text-teal-dark">
                    <Sparkles size={16} />
                    {p.hogan === 'done' ? 'Rapports Hogan disponibles sur la plateforme Hogan.' : 'Inventaires Hogan pas encore complétés.'}
                  </div>
                </section>

                <section>
                  <p className="eyebrow">Supports {isLead ? 'de la journée' : 'de vos exercices'}</p>
                  <div className="mt-4 space-y-3">
                    {mineSlots.map((s) => (
                      <div key={s.id} className="card p-5">
                        <div className="flex flex-wrap items-start gap-4">
                          <ExerciseIcon kind={s.catalog.kind} />
                          <div className="min-w-0 flex-1">
                            <p className="font-heading text-[16.5px] font-medium">{s.catalog.name}</p>
                            <p className="tabular font-mono text-[12.5px] text-navy/50">
                              {fmtTime(s.start)} · {fmtDuration(s.duration)} · {state.assessors.find((a) => a.id === s.assessorId)?.name ?? 'assesseur à définir'}
                            </p>
                            <p className="mt-2 text-[13.5px] leading-relaxed text-navy/65">{s.catalog.objective}</p>
                            <ul className="mt-3 flex flex-wrap gap-2">
                              {s.catalog.materials.map((m) => (
                                <li key={m.name}>
                                  <Pill tone="muted">
                                    {m.name} · {m.size}
                                  </Pill>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => download(s)}>
                            <Download size={13} /> Fiche
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <aside>
                <div className="card p-6 lg:sticky lg:top-24">
                  <div className="flex items-baseline justify-between">
                    <p className="eyebrow eyebrow--lime">Avant le jour J</p>
                    <span className="tabular text-[13px] text-navy/55">
                      {checkDone} / {CHECKLIST.length}
                    </span>
                  </div>
                  <ProgressBar value={(checkDone / CHECKLIST.length) * 100} className="mt-3" />
                  <ul className="mt-5 space-y-1">
                    {CHECKLIST.map((c) => {
                      const key = `${assessorId}:${p.id}:${c.id}`
                      const on = !!state.checklist[key]
                      return (
                        <li key={c.id}>
                          <button onClick={() => dispatch({ type: 'toggleCheck', key })} className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left text-[14px] hover:bg-cream-warm" aria-pressed={on}>
                            <span className={cx('stadium flex h-5 w-5 shrink-0 items-center justify-center', on ? 'bg-lime-dark text-white' : 'ring-1 ring-inset ring-navy/20')}>
                              {on && <Check size={12} strokeWidth={3} />}
                            </span>
                            <span className={cx(on && 'text-navy/45 line-through')}>{c.label}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </aside>
            </div>
          )}

          {/* ---------- Notes en direct ---------- */}
          {tab === 'notes' && (
            <div className="space-y-4">
              {d > 0 && (
                <p className="rounded-2xl bg-cream-warm px-5 py-4 text-[13.5px] text-navy/60">La journée n’a pas commencé : vous pouvez déjà préparer vos premières questions.</p>
              )}
              {slots.map((s) => {
                const canEdit = s.assessorId === assessorId || (isLead && !s.assessorId)
                const live = d === 0 && p.dayProgress === scheduleFor(project, p).findIndex((x) => x.id === s.id)
                const others = state.assessors.filter((a) => a.id !== assessorId && state.notes[noteKey(p.id, s.id, a.id)]?.text)
                if (!canEdit && !isLead && !others.length) return null
                return (
                  <div key={s.id} className={cx('card p-6', live && '!border-lime-dark shadow-[0_16px_40px_-24px_rgba(0,36,70,0.35)]')}>
                    <div className="flex flex-wrap items-center gap-3">
                      <ExerciseIcon kind={s.catalog.kind} size={36} />
                      <div className="flex-1">
                        <p className="font-heading text-[17px] font-medium">{s.catalog.name}</p>
                        <p className="tabular font-mono text-[12.5px] text-navy/50">
                          {fmtTime(s.start)} à {fmtTime(s.end)} · {state.assessors.find((a) => a.id === s.assessorId)?.name ?? 'assesseur à définir'}
                        </p>
                      </div>
                      {live && (
                        <span className="stadium inline-flex items-center gap-1.5 bg-lime px-2.5 py-1 text-[11px] font-semibold text-navy">
                          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-navy" /> En cours
                        </span>
                      )}
                    </div>
                    {canEdit ? (
                      <NoteEditor key={noteKey(p.id, s.id, assessorId)} storeKey={noteKey(p.id, s.id, assessorId)} />
                    ) : (
                      <p className="mt-4 flex items-center gap-2 text-[13px] text-navy/45">
                        <Lock size={13} /> Exercice mené par un autre assesseur.
                      </p>
                    )}
                    {others.map((a) => (
                      <div key={a.id} className="mt-4 rounded-2xl bg-cream-warm px-5 py-4">
                        <p className="text-[12px] font-semibold text-navy/50">{a.name}</p>
                        <p className="mt-1 whitespace-pre-line text-[14px] leading-relaxed">{state.notes[noteKey(p.id, s.id, a.id)].text}</p>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}

          {/* ---------- Grille ---------- */}
          {tab === 'grid' && f.grid && (
            <div>
              {!isLead ? (
                <EmptyState icon={<Crown size={20} />} title="La grille est tenue par le lead">
                  {state.assessors.find((a) => a.id === project.leadAssessorId)?.name ?? 'Le lead'} consolide la grille à partir des notes de chacun.
                </EmptyState>
              ) : (
                <>
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[14px] text-navy/60">Échelle de 1 à 5, appuyée sur des comportements observés. Les ancrages vous guident.</p>
                    <span className="tabular text-[13px] font-semibold">
                      {graded} / {project.competencyIds.length} compétences évaluées
                    </span>
                  </div>
                  <div className="space-y-4">
                    {project.competencyIds.map((cid) => (
                      <GridRow key={cid} participantId={p.id} competencyId={cid} entry={state.grid[gridKey(p.id, cid)]} />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function NoteEditor({ storeKey }: { storeKey: string }) {
  const { state, dispatch } = useStore()
  const saved = state.notes[storeKey]
  const [text, setText] = useState(saved?.text ?? '')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const onChange = (value: string) => {
    setText(value)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => dispatch({ type: 'saveNote', key: storeKey, text: value }), 600)
  }

  return (
    <div className="mt-4">
      <textarea
        className="field min-h-32 resize-y leading-relaxed"
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Comportements observés, verbatims, situations STAR…"
        aria-label="Notes"
      />
      <p className="mt-1.5 h-4 text-right text-[12px] text-navy/45">
        {saved && saved.text === text ? `Enregistré à ${new Date(saved.updatedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : text !== (saved?.text ?? '') ? 'Enregistrement…' : ''}
      </p>
    </div>
  )
}

function GridRow({ participantId, competencyId, entry }: { participantId: string; competencyId: string; entry?: GridEntry }) {
  const { dispatch } = useStore()
  const c = competencyById(competencyId)
  const [evidence, setEvidence] = useState(entry?.evidence ?? '')
  const set = (patch: Partial<GridEntry>) =>
    dispatch({ type: 'setGrid', key: gridKey(participantId, competencyId), entry: { score: entry?.score ?? null, evidence, ...patch } })

  return (
    <div className="card p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="font-heading text-[18px] font-medium">{c.name}</p>
          <p className="mt-1 text-[13.5px] text-navy/60">{c.definition}</p>
          <dl className="mt-4 space-y-2 text-[12.5px] leading-relaxed">
            {[
              ['1', c.anchors.low],
              ['3', c.anchors.mid],
              ['5', c.anchors.high],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <dt className="tabular w-4 shrink-0 font-mono font-medium text-navy/40">{k}</dt>
                <dd className="text-navy/60">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={`Score ${c.name}`}>
            {SCALE.map((s) => {
              const on = entry?.score === s.value
              return (
                <button
                  key={s.value}
                  role="radio"
                  aria-checked={on}
                  onClick={() => set({ score: on ? null : s.value })}
                  className={cx(
                    'stadium flex items-center gap-2 px-3.5 py-2 text-[13px] transition-colors',
                    on ? 'bg-navy font-semibold text-lime' : 'bg-white text-navy/65 ring-1 ring-inset ring-navy/12 hover:ring-lime-dark',
                  )}
                >
                  <span className="tabular font-mono">{s.value}</span> {s.label}
                </button>
              )
            })}
          </div>
          <textarea
            className="field mt-4 min-h-20 resize-y text-[13.5px]"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            onBlur={() => evidence !== (entry?.evidence ?? '') && set({ evidence })}
            placeholder="Preuves comportementales qui fondent ce score"
            aria-label={`Preuves ${c.name}`}
          />
        </div>
      </div>
    </div>
  )
}
