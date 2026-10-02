'use client'

import { Check } from 'lucide-react'
import type { JourneyStep } from '@/lib/project'
import { cx } from './ui'

export function JourneyTrack({ steps, onNavy = false }: { steps: JourneyStep[]; onNavy?: boolean }) {
  const doneCount = steps.filter((s) => s.state === 'done').length
  const progress = steps.length > 1 ? (Math.max(0, doneCount - 1) / (steps.length - 1)) * 100 : 0

  return (
    <div className="relative">
      <div className={cx('absolute inset-x-[7px] top-[7px] hidden h-px md:block', onNavy ? 'bg-white/15' : 'bg-navy/10')} aria-hidden />
      <div
        className={cx('bar-in absolute left-[7px] top-[7px] hidden h-px md:block', onNavy ? 'bg-lime' : 'bg-lime-dark')}
        style={{ width: `calc((100% - 14px) * ${progress / 100})` }}
        aria-hidden
      />
      <div className={cx('absolute bottom-3 left-[7px] top-3 w-px md:hidden', onNavy ? 'bg-white/15' : 'bg-navy/10')} aria-hidden />

      <ol className="grid gap-5 md:auto-cols-fr md:grid-flow-col md:gap-3">
          {steps.map((s) => (
            <li key={s.key} className="relative flex items-start gap-3 md:flex-col md:gap-0">
              <span
                className={cx(
                  'relative z-10 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full ring-4',
                  onNavy ? 'ring-navy-deep' : 'ring-cream',
                  s.state === 'done' && (onNavy ? 'bg-lime text-navy' : 'bg-lime-dark text-white'),
                  s.state === 'current' && 'pulse-dot bg-lime',
                  s.state === 'upcoming' && (onNavy ? 'bg-white/20' : 'bg-navy/15'),
                )}
              >
                {s.state === 'done' && <Check size={9} strokeWidth={3.5} />}
              </span>
              <div className="md:mt-3.5 md:pr-3">
                <p
                  className={cx(
                    'text-[14px] font-semibold leading-snug',
                    onNavy ? (s.state === 'upcoming' ? 'text-white/45' : 'text-white') : s.state === 'upcoming' ? 'text-navy/40' : 'text-navy',
                  )}
                >
                  {s.label}
                </p>
                <p
                  className={cx(
                    'mt-0.5 text-[12.5px]',
                    onNavy ? 'text-white/50' : 'text-navy/50',
                    s.state === 'current' && (onNavy ? '!text-lime' : '!text-lime-dark font-semibold'),
                  )}
                >
                  {s.state === 'current' ? `En cours · ${s.detail}` : s.detail}
                </p>
              </div>
            </li>
          ))}
      </ol>
    </div>
  )
}
