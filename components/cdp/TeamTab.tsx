'use client'

import { Check, Crown } from 'lucide-react'
import { useStore } from '@/lib/store'
import { FORMATS } from '@/lib/catalog'
import { exerciseById } from '@/lib/catalog'
import type { Project } from '@/lib/types'
import { Avatar, Button, Pill, cx } from '@/components/ui'

export function TeamTab({ project }: { project: Project }) {
  const { state, dispatch } = useStore()
  const preset = FORMATS[project.format]
  const update = (patch: Partial<Project>) => dispatch({ type: 'updateProject', id: project.id, patch })

  const setLead = (id: string) =>
    update({
      leadAssessorId: id,
      secondAssessorIds: project.secondAssessorIds.filter((s) => s !== id),
    })
  const toggleSecond = (id: string) =>
    update({
      secondAssessorIds: project.secondAssessorIds.includes(id) ? project.secondAssessorIds.filter((s) => s !== id) : [...project.secondAssessorIds, id],
      leadAssessorId: project.leadAssessorId === id ? null : project.leadAssessorId,
    })

  const missing = Math.max(0, preset.minSeconds - project.secondAssessorIds.length)

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <div className="grid gap-3 sm:grid-cols-2">
        {state.assessors.map((a) => {
          const isLead = project.leadAssessorId === a.id
          const isSecond = project.secondAssessorIds.includes(a.id)
          const exercises = project.exercises.filter((e) => e.assessorId === a.id)
          return (
            <div key={a.id} className={cx('card p-5', (isLead || isSecond) && '!border-lime-dark')}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={a.name} size={42} tone={isLead ? 'navy' : isSecond ? 'lime' : 'teal'} />
                  <div>
                    <p className="font-semibold">{a.name}</p>
                    <p className="text-[12.5px] text-navy/55">{a.title}</p>
                  </div>
                </div>
                {isLead && (
                  <Pill tone="solid">
                    <Crown size={11} /> Lead
                  </Pill>
                )}
                {isSecond && <Pill tone="lime">Second</Pill>}
              </div>
              <p className="mt-4 min-h-5 text-[12.5px] text-navy/50">
                {exercises.length ? exercises.map((e) => exerciseById(e.catalogId).name).join(' · ') : 'Aucun exercice assigné'}
              </p>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant={isLead ? 'primary' : 'outline'} onClick={() => setLead(a.id)} disabled={isLead}>
                  {isLead ? (
                    <>
                      <Check size={13} /> Lead
                    </>
                  ) : (
                    'Nommer lead'
                  )}
                </Button>
                {preset.minSeconds > 0 || isSecond ? (
                  <Button size="sm" variant={isSecond ? 'lime' : 'ghost'} onClick={() => toggleSecond(a.id)}>
                    {isSecond ? 'Retirer' : 'Second'}
                  </Button>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      <aside className="space-y-4">
        <div className="card p-6">
          <p className="eyebrow eyebrow--lime">Format {preset.label}</p>
          <ul className="mt-4 space-y-3 text-[14px]">
            <li className="flex items-center justify-between">
              <span>Lead assesseur</span>
              {project.leadAssessorId ? <Check size={16} className="text-lime-dark" /> : <span className="text-[12.5px] font-semibold text-peach-dark">À nommer</span>}
            </li>
            <li className="flex items-center justify-between">
              <span>Seconds assesseurs</span>
              <span className={cx('tabular text-[13px] font-semibold', missing ? 'text-peach-dark' : 'text-lime-dark')}>
                {project.secondAssessorIds.length} / {preset.minSeconds}
              </span>
            </li>
          </ul>
          <div className="tick-rule my-5" />
          <p className="text-[13px] leading-relaxed text-navy/55">
            {project.format === 'light'
              ? 'Le format Light mobilise un seul assesseur, qui mène l’entretien.'
              : 'Le lead tient la grille comportementale et la synthèse. Les seconds peuvent mener des exercices et prendre leurs notes.'}
          </p>
        </div>
      </aside>
    </div>
  )
}
