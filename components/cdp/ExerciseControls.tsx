'use client'

import { useStore } from '@/lib/store'
import { DURATION_CHOICES, LIGHT_DURATIONS } from '@/lib/catalog'
import { fmtDuration } from '@/lib/dates'
import { cx } from '@/components/ui'

const pill = 'field !w-auto !rounded-full !py-1.5 !text-[13px]'

export function DurationSelect({ value, onChange, light = false }: { value: number; onChange: (d: number) => void; light?: boolean }) {
  const choices = Array.from(new Set(light ? LIGHT_DURATIONS : [...DURATION_CHOICES, value])).sort((a, b) => a - b)
  return (
    <select aria-label="Durée" value={value} onChange={(e) => onChange(Number(e.target.value))} className={pill}>
      {choices.map((d) => (
        <option key={d} value={d}>
          {fmtDuration(d)}
        </option>
      ))}
    </select>
  )
}

export function AssessorSelect({ value, onChange, team }: { value: string | null; onChange: (id: string | null) => void; team: string[] }) {
  const { state } = useStore()
  const inTeam = state.assessors.filter((a) => team.includes(a.id))
  const others = state.assessors.filter((a) => !team.includes(a.id) && a.active)
  return (
    <select
      aria-label="Assesseur"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      className={cx(pill, !value && '!border-peach !text-peach-dark')}
    >
      <option value="">Assesseur à choisir</option>
      {inTeam.length > 0 && (
        <optgroup label="Équipe du projet">
          {inTeam.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </optgroup>
      )}
      <optgroup label={inTeam.length ? 'Autres assesseurs ATC' : 'Assesseurs ATC'}>
        {others.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </optgroup>
    </select>
  )
}

export function NoAssessor() {
  return <span className="whitespace-nowrap px-2 text-[12.5px] text-navy/45">Sans assesseur</span>
}
