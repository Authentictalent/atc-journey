'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash } from 'lucide-react'
import { uid, useStore } from '@/lib/store'
import { EXERCISES } from '@/lib/catalog'
import { fmtDuration, fmtTime } from '@/lib/dates'
import { endTime, schedule } from '@/lib/project'
import type { Project, ProjectExercise } from '@/lib/types'
import { Button, ExerciseIcon, Pill, cx } from '@/components/ui'

const DURATIONS = [15, 20, 30, 45, 60, 75, 90, 105, 120]

export function PlanningTab({ project }: { project: Project }) {
  const { state, dispatch } = useStore()
  const [adding, setAdding] = useState('')
  const isLight = project.format === 'light'
  const slots = schedule(project)
  const team = [project.leadAssessorId, ...project.secondAssessorIds].filter(Boolean) as string[]

  const setExercises = (exercises: ProjectExercise[]) => dispatch({ type: 'updateProject', id: project.id, patch: { exercises } })
  const patch = (id: string, change: Partial<ProjectExercise>) => setExercises(project.exercises.map((e) => (e.id === id ? { ...e, ...change } : e)))
  const move = (index: number, dir: -1 | 1) => {
    const next = [...project.exercises]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setExercises(next)
  }
  const add = () => {
    const cat = EXERCISES.find((e) => e.id === adding)
    if (!cat) return
    setExercises([...project.exercises, { id: uid('ex'), catalogId: cat.id, duration: cat.defaultDuration, assessorId: null }])
    setAdding('')
  }

  const totalMinutes = project.exercises.reduce((s, e) => s + e.duration, 0)

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-3 text-[14px]">
            <span className="font-semibold">Début de la journée</span>
            <input
              type="time"
              value={project.startTime}
              onChange={(e) => e.target.value && dispatch({ type: 'updateProject', id: project.id, patch: { startTime: e.target.value } })}
              className="field !w-auto !py-1.5 font-mono text-[13px]"
            />
          </label>
          <p className="text-[13px] text-navy/55">
            Fin prévue à <span className="font-semibold text-navy">{fmtTime(endTime(project))}</span> · transitions de 10 min incluses
          </p>
        </div>

        <ol className="space-y-3">
          {slots.map((s, i) => {
            const isBreak = s.catalog.kind === 'break'
            return (
              <li key={s.id} className={cx('card flex flex-col gap-4 p-5 sm:flex-row sm:items-center', isBreak && '!bg-cream-warm')}>
                <div className="flex items-center gap-4 sm:w-[132px] sm:shrink-0">
                  <span className="tabular font-mono text-[13px] leading-tight text-navy/70">
                    {fmtTime(s.start)}
                    <span className="block text-navy/35">{fmtTime(s.end)}</span>
                  </span>
                  <ExerciseIcon kind={s.catalog.kind} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[16.5px] font-medium leading-snug">{s.catalog.name}</p>
                  <p className="mt-0.5 truncate text-[13px] text-navy/50">{s.catalog.pitch}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    aria-label="Durée"
                    value={s.duration}
                    onChange={(e) => patch(s.id, { duration: Number(e.target.value) })}
                    className="field !w-auto !rounded-full !py-1.5 !text-[13px]"
                  >
                    {Array.from(new Set([...DURATIONS, s.duration]))
                      .sort((a, b) => a - b)
                      .map((d) => (
                        <option key={d} value={d}>
                          {fmtDuration(d)}
                        </option>
                      ))}
                  </select>
                  {!isBreak && (
                    <select
                      aria-label="Assesseur"
                      value={s.assessorId ?? ''}
                      onChange={(e) => patch(s.id, { assessorId: e.target.value || null })}
                      className={cx('field !w-auto !rounded-full !py-1.5 !text-[13px]', !s.assessorId && '!border-peach !text-peach-dark')}
                    >
                      <option value="">Assesseur à choisir</option>
                      <optgroup label="Équipe du dispositif">
                        {state.assessors
                          .filter((a) => team.includes(a.id))
                          .map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name}
                            </option>
                          ))}
                      </optgroup>
                      <optgroup label="Autres assesseurs ATC">
                        {state.assessors
                          .filter((a) => !team.includes(a.id))
                          .map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name}
                            </option>
                          ))}
                      </optgroup>
                    </select>
                  )}
                  {!isLight && (
                    <div className="flex items-center">
                      <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter" className="stadium p-1.5 text-navy/50 hover:bg-navy/5 hover:text-navy disabled:opacity-25">
                        <ArrowUp size={15} />
                      </button>
                      <button
                        onClick={() => move(i, 1)}
                        disabled={i === slots.length - 1}
                        aria-label="Descendre"
                        className="stadium p-1.5 text-navy/50 hover:bg-navy/5 hover:text-navy disabled:opacity-25"
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        onClick={() => setExercises(project.exercises.filter((e) => e.id !== s.id))}
                        disabled={slots.length === 1}
                        aria-label="Retirer"
                        className="stadium p-1.5 text-navy/40 hover:bg-peach-pale hover:text-peach-dark disabled:opacity-25"
                      >
                        <Trash size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        {isLight ? (
          <p className="mt-5 text-[13px] text-navy/55">Le format Light repose sur un entretien seul : vous pouvez ajuster sa durée et son assesseur.</p>
        ) : (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <select value={adding} onChange={(e) => setAdding(e.target.value)} className="field !w-auto !rounded-full !py-2 !text-[13.5px]" aria-label="Exercice à ajouter">
              <option value="">Ajouter un exercice du catalogue ATC…</option>
              {EXERCISES.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} · {fmtDuration(e.defaultDuration)}
                </option>
              ))}
            </select>
            <Button size="sm" variant="outline" onClick={add} disabled={!adding}>
              <Plus size={14} /> Ajouter
            </Button>
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <div className="card p-6">
          <p className="eyebrow eyebrow--lime">Résumé</p>
          <p className="mt-3 font-heading text-[30px] font-medium leading-none">{fmtDuration(totalMinutes)}</p>
          <p className="mt-1.5 text-[13px] text-navy/55">d’exercices sur la journée</p>
          <div className="tick-rule my-5" />
          <ul className="space-y-2.5 text-[13.5px]">
            {team.map((id) => {
              const a = state.assessors.find((x) => x.id === id)
              const count = project.exercises.filter((e) => e.assessorId === id).length
              return (
                <li key={id} className="flex items-center justify-between">
                  <span>{a?.name}</span>
                  <Pill tone={count ? 'navy' : 'muted'}>
                    {count} exercice{count > 1 ? 's' : ''}
                  </Pill>
                </li>
              )
            })}
            {!team.length && <li className="text-navy/50">Aucun assesseur dans l’équipe.</li>}
          </ul>
        </div>
        <div className="rounded-2xl bg-teal-pale p-5 text-[13px] leading-relaxed text-teal-dark">
          Côté {project.purpose === 'AC' ? 'candidat' : 'bénéficiaire'}, le planning reste caché jusqu’au matin de la journée, puis chaque exercice se révèle au moment où il commence.
        </div>
      </aside>
    </div>
  )
}
