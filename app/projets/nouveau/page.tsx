'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, Plus, Trash, UserPlus } from 'lucide-react'
import { uid, useStore } from '@/lib/store'
import { EXERCISES, FORMATS, LIGHT_DURATIONS, exerciseById } from '@/lib/catalog'
import { AssessorSelect, DurationSelect, NoAssessor } from '@/components/cdp/ExerciseControls'
import { fmtDuration, fmtTime, todayISO } from '@/lib/dates'
import { endTime, schedule, venueLabel } from '@/lib/project'
import { wording } from '@/lib/wording'
import type { Format, Participant, Project, ProjectExercise, Purpose } from '@/lib/types'
import { Avatar, Button, ExerciseIcon, Field, FormatPill, PageHeader, PurposePill, cx } from '@/components/ui'
import { VenueFields } from '@/components/cdp/OverviewTab'

const STEPS = ['Cadre', 'Équipe', 'Exercices', 'Participants', 'Récapitulatif'] as const

type Draft = Omit<Project, 'id'>
type PersonDraft = { key: string; firstName: string; lastName: string; email: string; currentRole: string }

const presetExercises = (format: Format): ProjectExercise[] =>
  FORMATS[format].defaultExercises.map((e) => ({
    id: uid('ex'),
    catalogId: e.catalogId,
    duration: e.duration ?? exerciseById(e.catalogId).defaultDuration,
    assessorId: null,
  }))

export default function NewProjectPage() {
  const { state, dispatch } = useStore()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Draft>({
    purpose: 'AC',
    format: 'robuste',
    client: '',
    position: '',
    sponsorName: '',
    sponsorTitle: '',
    startTime: '09:00',
    venue: { mode: 'teams', address: '' },
    period: '',
    sponsorEmail: '',
    cdpId: state.session?.role === 'cdp' ? (state.session.userId ?? '') : (state.users.find((u) => u.role === 'cdp' && u.active)?.id ?? ''),
    exercises: presetExercises('robuste'),
    competencyIds: ['vision', 'leadership', 'resultats', 'influence'],
    leadAssessorId: null,
    secondAssessorIds: [],
    debriefClientDone: false,
  })
  const [people, setPeople] = useState<PersonDraft[]>([])
  const [person, setPerson] = useState({ firstName: '', lastName: '', email: '', currentRole: '' })
  const [adding, setAdding] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const w = wording(draft.purpose)
  const preset = FORMATS[draft.format]
  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }))
  const setFormat = (format: Format) => set({ format, exercises: presetExercises(format), secondAssessorIds: format === 'light' ? [] : draft.secondAssessorIds })

  const canContinue = [
    draft.client.trim() && draft.position.trim() && draft.startTime && draft.cdpId,
    !!draft.leadAssessorId,
    draft.exercises.length > 0,
    true,
    true,
  ][step]

  const setEx = (id: string, change: Partial<ProjectExercise>) => set({ exercises: draft.exercises.map((e) => (e.id === id ? { ...e, ...change } : e)) })

  const moveEx = (i: number, dir: -1 | 1) => {
    const next = [...draft.exercises]
    if (i + dir < 0 || i + dir >= next.length) return
    ;[next[i], next[i + dir]] = [next[i + dir], next[i]]
    set({ exercises: next })
  }

  const addPerson = () => {
    if (!person.firstName.trim() || !person.lastName.trim() || !/\S+@\S+\.\S+/.test(person.email)) return
    setPeople((p) => [...p, { ...person, key: uid('k') }])
    setPerson({ firstName: '', lastName: '', email: '', currentRole: '' })
  }

  const toggleSecond = (id: string) =>
    set({ secondAssessorIds: draft.secondAssessorIds.includes(id) ? draft.secondAssessorIds.filter((x) => x !== id) : [...draft.secondAssessorIds, id] })

  const create = () => {
    const id = uid('pr')
    const exercises = draft.exercises
    const participants: Participant[] = people.map((p) => ({
      id: uid('pa'),
      projectId: id,
      firstName: p.firstName.trim(),
      lastName: p.lastName.trim(),
      email: p.email.trim(),
      currentRole: p.currentRole.trim(),
      invitedAt: todayISO(),
      slot: { status: 'todo', proposals: [], counter: [] },
      hogan: 'todo',
      preQuestionnaire: 'todo',
      preAnswers: {},
      dayProgress: -1,
      postQuestionnaire: 'todo',
      postAnswers: {},
      feedback: { status: 'locked' },
    }))
    dispatch({
      type: 'createProject',
      project: { ...draft, id, exercises },
      participants,
    })
    router.push(`/projets/${id}`)
  }

  return (
    <>
      <PageHeader back={{ href: '/projets', label: 'Tous les projets' }} eyebrow="Nouveau dispositif" tone="lime" title="Créer un projet" description="Cinq étapes pour cadrer le dispositif. Tout reste modifiable ensuite." />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[240px_1fr]">
        {/* Étapes */}
        <ol className="flex gap-2 overflow-x-auto lg:sticky lg:top-24 lg:flex-col lg:self-start">
          {STEPS.map((label, i) => (
            <li key={label}>
              <button
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={cx(
                  'flex w-full items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-left text-[14px] transition-colors',
                  i === step ? 'bg-white font-semibold shadow-[0_2px_8px_rgba(0,36,70,0.07)] ring-1 ring-navy/[0.08]' : i < step ? 'text-navy/70 hover:bg-white/60' : 'text-navy/35',
                )}
              >
                <span
                  className={cx(
                    'stadium flex h-7 w-7 shrink-0 items-center justify-center font-heading text-[13px]',
                    i < step ? 'bg-lime-dark text-white' : i === step ? 'bg-navy text-lime' : 'bg-navy/[0.06]',
                  )}
                >
                  {i < step ? <Check size={14} strokeWidth={3} /> : i + 1}
                </span>
                {label}
              </button>
            </li>
          ))}
        </ol>

        <div className="min-w-0">
          <div className="card p-6 sm:p-9">
            {/* ---------- 1. Cadre ---------- */}
            {step === 0 && (
              <div className="space-y-9">
                <div>
                  <p className="eyebrow">Nature du dispositif</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {(['AC', 'DC'] as Purpose[]).map((p) => {
                      const pw = wording(p)
                      return (
                        <button
                          key={p}
                          onClick={() => set({ purpose: p })}
                          className={cx('rounded-2xl border p-5 text-left transition-colors', draft.purpose === p ? 'border-navy bg-navy text-white' : 'border-navy/10 hover:border-lime-dark')}
                        >
                          <p className={cx('eyebrow', draft.purpose === p ? 'eyebrow--on-navy' : 'eyebrow--lime')}>{pw.center}</p>
                          <p className="mt-2 font-heading text-[19px] font-medium">{pw.assessment}</p>
                          <p className={cx('mt-1 text-[13px]', draft.purpose === p ? 'text-white/60' : 'text-navy/55')}>
                            On parle de {pw.participants.toLowerCase()} sur toute la plateforme.
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <p className="eyebrow">Format</p>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {(Object.keys(FORMATS) as Format[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={cx('rounded-2xl border p-5 text-left transition-colors', draft.format === f ? 'border-lime-dark bg-lime-pale' : 'border-navy/10 hover:border-lime-dark')}
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-navy/45">{FORMATS[f].length}</p>
                        <p className="mt-1.5 font-heading text-[19px] font-medium">{FORMATS[f].label}</p>
                        <p className="mt-1 text-[13px] leading-relaxed text-navy/60">{FORMATS[f].description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Client">
                    <input className="field" value={draft.client} onChange={(e) => set({ client: e.target.value })} placeholder="Ex. Danone" />
                  </Field>
                  <Field label={draft.purpose === 'AC' ? 'Poste à pourvoir' : 'Programme'}>
                    <input
                      className="field"
                      value={draft.position}
                      onChange={(e) => set({ position: e.target.value })}
                      placeholder={draft.purpose === 'AC' ? 'Ex. Directeur·rice financier·ère' : 'Ex. Programme hauts potentiels'}
                    />
                  </Field>
                  <Field label="Commanditaire">
                    <input className="field" value={draft.sponsorName} onChange={(e) => set({ sponsorName: e.target.value })} placeholder="Prénom Nom" />
                  </Field>
                  <Field label="Fonction du commanditaire">
                    <input className="field" value={draft.sponsorTitle} onChange={(e) => set({ sponsorTitle: e.target.value })} placeholder="Ex. DRH" />
                  </Field>
                  <Field label="Email du commanditaire" className="sm:col-span-2" hint="Facultatif : lui ouvre l’accès à la vue de suivi.">
                    <input type="email" className="field" value={draft.sponsorEmail} onChange={(e) => set({ sponsorEmail: e.target.value })} placeholder="prenom.nom@client.fr" />
                  </Field>
                  <Field label="Période envisagée" hint="Facultatif. Chaque date se fixe ensuite avec le candidat.">
                    <input className="field" value={draft.period} onChange={(e) => set({ period: e.target.value })} placeholder="Ex. novembre 2026" />
                  </Field>
                  <Field label="Heure de début habituelle" hint="Modifiable pour chaque candidat.">
                    <input type="time" className="field" value={draft.startTime} onChange={(e) => set({ startTime: e.target.value })} />
                  </Field>
                  <VenueFields value={draft.venue} onChange={(venue) => set({ venue })} />
                  {state.session?.role === 'admin' && (
                    <Field label="Cheffe de projet" className="sm:col-span-2">
                      <select className="field" value={draft.cdpId} onChange={(e) => set({ cdpId: e.target.value })}>
                        {state.users
                          .filter((u) => u.role === 'cdp' && u.active)
                          .map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.name}
                            </option>
                          ))}
                      </select>
                    </Field>
                  )}
                </div>
              </div>
            )}

            {/* ---------- 3. Exercices ---------- */}
            {step === 2 && (
              <div className="space-y-9">
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="eyebrow">Planning · format {preset.label}</p>
                    <p className="text-[13px] text-navy/55">
                      {fmtTime(draft.startTime)} à {fmtTime(endTime({ ...draft, id: 'draft' }))}
                    </p>
                  </div>
                  <ol className="mt-4 space-y-2.5">
                    {schedule({ ...draft, id: 'draft' }).map((s, i) => (
                      <li key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-2xl border border-navy/[0.08] px-4 py-3">
                        <span className="tabular w-14 shrink-0 font-mono text-[12.5px] text-navy/55">{fmtTime(s.start)}</span>
                        <ExerciseIcon kind={s.catalog.kind} size={34} />
                        <span className="min-w-[160px] flex-1 text-[14.5px] font-medium">{s.catalog.name}</span>
                        <span className="ml-auto flex flex-wrap items-center justify-end gap-2">
                        {draft.format === 'light' ? (
                          <span className="text-[12.5px] text-navy/50">{fmtDuration(s.duration)}</span>
                        ) : (
                          <DurationSelect value={s.duration} onChange={(duration) => setEx(s.id, { duration })} />
                        )}
                        {s.catalog.assessed ? (
                          <AssessorSelect value={s.assessorId} onChange={(assessorId) => setEx(s.id, { assessorId })} team={[draft.leadAssessorId, ...draft.secondAssessorIds].filter(Boolean) as string[]} />
                        ) : (
                          <NoAssessor />
                        )}
                        {draft.format !== 'light' && (
                          <span className="flex">
                            <button onClick={() => moveEx(i, -1)} disabled={i === 0} aria-label="Monter" className="stadium p-1.5 text-navy/45 hover:bg-navy/5 disabled:opacity-25">
                              <ArrowUp size={14} />
                            </button>
                            <button onClick={() => moveEx(i, 1)} disabled={i === draft.exercises.length - 1} aria-label="Descendre" className="stadium p-1.5 text-navy/45 hover:bg-navy/5 disabled:opacity-25">
                              <ArrowDown size={14} />
                            </button>
                            <button
                              onClick={() => set({ exercises: draft.exercises.filter((e) => e.id !== s.id) })}
                              disabled={draft.exercises.length === 1}
                              aria-label="Retirer"
                              className="stadium p-1.5 text-navy/40 hover:bg-peach-pale hover:text-peach-dark disabled:opacity-25"
                            >
                              <Trash size={14} />
                            </button>
                          </span>
                        )}
                        </span>
                      </li>
                    ))}
                  </ol>
                  {draft.format === 'light' ? (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <span className="text-[13.5px] text-navy/60">Durée de l’entretien</span>
                      {LIGHT_DURATIONS.map((d) => (
                        <button
                          key={d}
                          onClick={() => set({ exercises: draft.exercises.map((e) => ({ ...e, duration: d })) })}
                          aria-pressed={draft.exercises[0]?.duration === d}
                          className={cx(
                            'stadium px-4 py-1.5 text-[13.5px] transition-colors',
                            draft.exercises[0]?.duration === d ? 'bg-navy font-semibold text-lime' : 'bg-white text-navy/65 ring-1 ring-inset ring-navy/12 hover:ring-lime-dark',
                          )}
                        >
                          {fmtDuration(d)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <select value={adding} onChange={(e) => setAdding(e.target.value)} className="field !w-auto !rounded-full !py-2 !text-[13.5px]" aria-label="Exercice à ajouter">
                        <option value="">Ajouter depuis le catalogue ATC…</option>
                        {EXERCISES.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name} · {fmtDuration(e.defaultDuration)}
                          </option>
                        ))}
                      </select>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!adding}
                        onClick={() => {
                          const cat = exerciseById(adding)
                          set({ exercises: [...draft.exercises, { id: uid('ex'), catalogId: cat.id, duration: cat.defaultDuration, assessorId: null }] })
                          setAdding('')
                        }}
                      >
                        <Plus size={14} /> Ajouter
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ---------- 4. Participants ---------- */}
            {step === 3 && (
              <div className="space-y-7">
                <div>
                  <p className="eyebrow">{w.participants}</p>
                  <p className="mt-1.5 text-[13.5px] text-navy/55">Chaque personne ajoutée recevra son invitation au parcours. Vous pourrez en ajouter plus tard.</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <input className="field" placeholder="Prénom" value={person.firstName} onChange={(e) => setPerson({ ...person, firstName: e.target.value })} aria-label="Prénom" />
                  <input className="field" placeholder="Nom" value={person.lastName} onChange={(e) => setPerson({ ...person, lastName: e.target.value })} aria-label="Nom" />
                  <input className="field" placeholder="Email" type="email" value={person.email} onChange={(e) => setPerson({ ...person, email: e.target.value })} aria-label="Email" />
                  <input
                    className="field"
                    placeholder="Fonction actuelle"
                    value={person.currentRole}
                    onChange={(e) => setPerson({ ...person, currentRole: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && addPerson()}
                    aria-label="Fonction actuelle"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={addPerson} disabled={!person.firstName.trim() || !person.lastName.trim() || !/\S+@\S+\.\S+/.test(person.email)}>
                  <UserPlus size={14} /> Ajouter à la liste
                </Button>
                {people.length > 0 ? (
                  <ul className="divide-y divide-navy/[0.07] rounded-2xl border border-navy/[0.08]">
                    {people.map((p) => (
                      <li key={p.key} className="flex items-center gap-3 px-5 py-3.5">
                        <Avatar name={`${p.firstName} ${p.lastName}`} size={34} tone="navy" />
                        <span className="flex-1">
                          <span className="block text-[14.5px] font-semibold">
                            {p.firstName} {p.lastName}
                          </span>
                          <span className="block text-[12.5px] text-navy/50">{[p.currentRole, p.email].filter(Boolean).join(' · ')}</span>
                        </span>
                        <button onClick={() => setPeople((all) => all.filter((x) => x.key !== p.key))} aria-label="Retirer" className="stadium p-1.5 text-navy/40 hover:bg-peach-pale hover:text-peach-dark">
                          <Trash size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="rounded-2xl bg-cream-warm px-5 py-4 text-[13.5px] text-navy/55">Aucun {w.participant.toLowerCase()} pour l’instant.</p>
                )}
              </div>
            )}

            {/* ---------- 2. Équipe ---------- */}
            {step === 1 && (
              <div className="space-y-8">
                <div>
                  <p className="eyebrow">Lead assesseur</p>
                  <p className="mt-1.5 text-[13.5px] text-navy/55">{draft.format === 'light' ? 'Il mène l’entretien.' : 'Il pilote la journée, tient la grille et rédige la synthèse.'}</p>
                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {state.assessors.filter((a) => a.active).map((a) => (
                      <button
                        key={a.id}
                        onClick={() => set({ leadAssessorId: a.id, secondAssessorIds: draft.secondAssessorIds.filter((x) => x !== a.id) })}
                        className={cx('flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors', draft.leadAssessorId === a.id ? 'border-navy bg-navy text-white' : 'border-navy/10 hover:border-lime-dark')}
                      >
                        <Avatar name={a.name} size={34} tone={draft.leadAssessorId === a.id ? 'lime' : 'teal'} />
                        <span>
                          <span className="block text-[14px] font-semibold">{a.name}</span>
                          <span className={cx('block text-[12px]', draft.leadAssessorId === a.id ? 'text-white/55' : 'text-navy/50')}>{a.title}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                {preset.minSeconds > 0 && (
                  <div>
                    <p className="eyebrow">Seconds assesseurs · {preset.minSeconds} minimum</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {state.assessors
                        .filter((a) => a.active && a.id !== draft.leadAssessorId)
                        .map((a) => {
                          const on = draft.secondAssessorIds.includes(a.id)
                          return (
                            <button
                              key={a.id}
                              onClick={() => toggleSecond(a.id)}
                              aria-pressed={on}
                              className={cx(
                                'stadium flex items-center gap-1.5 px-3.5 py-2 text-[13px] transition-colors',
                                on ? 'bg-lime font-semibold text-navy' : 'bg-white text-navy/65 ring-1 ring-inset ring-navy/10 hover:ring-lime-dark',
                              )}
                            >
                              {on && <Check size={13} />} {a.name}
                            </button>
                          )
                        })}
                    </div>
                  </div>
                )}
                <p className="text-[13px] text-navy/50">À l’étape suivante, vous attribuez un assesseur à chaque exercice, dans cette équipe ou parmi les autres assesseurs ATC.</p>
              </div>
            )}

            {/* ---------- 5. Récapitulatif ---------- */}
            {step === 4 && (
              <div className="space-y-7">
                <div className="flex flex-wrap items-center gap-2">
                  <FormatPill format={draft.format} />
                  <PurposePill purpose={draft.purpose} />
                </div>
                <div>
                  <h2 className="dot font-heading text-[30px] font-medium leading-tight">{draft.client}</h2>
                  <p className="text-[15px] text-navy/60">{draft.position}</p>
                </div>
                <div className="tick-rule" />
                <dl className="grid gap-x-8 gap-y-5 text-[14px] sm:grid-cols-2">
                  {[
                    ['Période', draft.period || 'Dates à fixer avec chaque candidat'],
                    ['Horaires habituels', `${fmtTime(draft.startTime)} à ${fmtTime(endTime({ ...draft, id: 'draft' }))}`],
                    ['Lieu', venueLabel({ ...draft, id: 'draft' })],
                    ['Cheffe de projet', state.users.find((u) => u.id === draft.cdpId)?.name ?? 'À définir'],
                    ['Commanditaire', [draft.sponsorName, draft.sponsorTitle].filter(Boolean).join(' · ') || 'Non renseigné'],
                    ['Exercices', draft.exercises.map((e) => exerciseById(e.catalogId).name).join(' · ')],
                    [w.participants, people.length ? people.map((p) => `${p.firstName} ${p.lastName}`).join(', ') : 'À ajouter'],
                    ['Lead assesseur', state.assessors.find((a) => a.id === draft.leadAssessorId)?.name ?? 'À définir'],
                    ['Seconds', draft.secondAssessorIds.map((id) => state.assessors.find((a) => a.id === id)?.name).join(', ') || 'Aucun'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-navy/45">{k}</dt>
                      <dd className="mt-1">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
              <ArrowLeft size={15} /> Précédent
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
                Continuer <ArrowRight size={15} />
              </Button>
            ) : (
              <Button variant="lime" size="lg" onClick={create}>
                <Check size={16} /> Créer le dispositif
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
