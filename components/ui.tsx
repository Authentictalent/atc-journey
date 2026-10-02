'use client'

import Link from 'next/link'
import { useEffect, type ComponentProps, type ReactNode } from 'react'
import { Coffee, Drama, FileSearch, Inbox, MessageSquare, Presentation, UsersRound, X } from 'lucide-react'
import type { ExerciseKind } from '@/lib/catalog'
import type { Format, Purpose } from '@/lib/types'
import { FORMATS } from '@/lib/catalog'

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/* ---------- En-tête de page : eyebrow + titre à point lime + ticks ---------- */

export function PageHeader({
  eyebrow,
  tone = 'teal',
  title,
  description,
  actions,
  back,
}: {
  eyebrow: string
  tone?: 'teal' | 'lime' | 'peach'
  title: string
  description?: ReactNode
  actions?: ReactNode
  back?: { href: string; label: string }
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
      {back && (
        <Link href={back.href} className="rise-in mb-6 inline-flex items-center gap-1.5 text-[13px] text-navy/55 transition-colors hover:text-navy">
          <span aria-hidden>←</span> {back.label}
        </Link>
      )}
      <p className={cx('eyebrow rise-in', tone === 'lime' && 'eyebrow--lime', tone === 'peach' && 'eyebrow--peach')}>{eyebrow}</p>
      <div className="mt-2.5 flex flex-wrap items-end justify-between gap-4">
        <h1 className="dot rise-in max-w-3xl text-[36px] font-medium leading-[1.08] sm:text-[48px]" style={{ animationDelay: '0.06s' }}>
          {title.replace(/[.]\s*$/, '')}
        </h1>
        {actions && (
          <div className="rise-in flex flex-wrap gap-2" style={{ animationDelay: '0.12s' }}>
            {actions}
          </div>
        )}
      </div>
      {description && (
        <div className="rise-in mt-4 max-w-2xl text-[16px] leading-relaxed text-navy/65" style={{ animationDelay: '0.12s' }}>
          {description}
        </div>
      )}
      <div className="tick-rule mt-8" />
    </div>
  )
}

export function SectionTitle({ eyebrow, title, tone = 'teal', action }: { eyebrow?: string; title: string; tone?: 'teal' | 'lime' | 'peach'; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className={cx('eyebrow', tone === 'lime' && 'eyebrow--lime', tone === 'peach' && 'eyebrow--peach')}>{eyebrow}</p>}
        <h2 className="dot mt-1.5 text-[24px] font-medium leading-tight sm:text-[28px]">{title}</h2>
      </div>
      {action}
    </div>
  )
}

/* ---------- Boutons ---------- */

type Variant = 'primary' | 'lime' | 'outline' | 'ghost' | 'danger'
const variants: Record<Variant, string> = {
  primary: 'bg-navy text-white hover:bg-navy-light',
  lime: 'bg-lime text-navy hover:bg-lime-light',
  outline: 'border border-navy/15 bg-white text-navy hover:border-lime-dark',
  ghost: 'text-navy/70 hover:bg-navy/5 hover:text-navy',
  danger: 'border border-peach/50 bg-white text-peach-dark hover:bg-peach-pale',
}

function btnClass(variant: Variant, size: 'sm' | 'md' | 'lg', className?: string) {
  return cx(
    'stadium inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40',
    size === 'sm' && 'px-3.5 py-1.5 text-[12.5px]',
    size === 'md' && 'px-5 py-2.5 text-[14px]',
    size === 'lg' && 'px-7 py-3.5 text-[15px]',
    variants[variant],
    className,
  )
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ComponentProps<'button'> & { variant?: Variant; size?: 'sm' | 'md' | 'lg' }) {
  return <button type="button" className={btnClass(variant, size, className)} {...props} />
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: 'sm' | 'md' | 'lg' }) {
  return <Link className={btnClass(variant, size, className)} {...props} />
}

/* ---------- Pilules ---------- */

export type Tone = 'lime' | 'teal' | 'peach' | 'navy' | 'muted' | 'solid'
const tones: Record<Tone, string> = {
  lime: 'bg-lime-pale text-navy',
  teal: 'bg-teal-pale text-teal-dark',
  peach: 'bg-peach-pale text-peach-dark',
  navy: 'bg-navy/[0.06] text-navy',
  muted: 'bg-transparent text-navy/50 ring-1 ring-inset ring-navy/12',
  solid: 'bg-navy text-lime',
}
const dotTones: Record<Tone, string> = {
  lime: 'bg-lime-dark',
  teal: 'bg-teal',
  peach: 'bg-peach',
  navy: 'bg-navy',
  muted: 'bg-navy/30',
  solid: 'bg-lime',
}

export function Pill({ tone = 'navy', dot, children, className }: { tone?: Tone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cx('stadium inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 text-[11.5px] font-semibold', tones[tone], className)}>
      {dot && <span className={cx('h-1.5 w-1.5 rounded-full', dotTones[tone])} />}
      {children}
    </span>
  )
}

export function FormatPill({ format }: { format: Format }) {
  const tone: Tone = format === 'premium' ? 'solid' : format === 'robuste' ? 'lime' : 'teal'
  return <Pill tone={tone}>{FORMATS[format].label}</Pill>
}

export function PurposePill({ purpose }: { purpose: Purpose }) {
  return (
    <Pill tone="muted" className="tracking-wider">
      {purpose === 'AC' ? 'AC · Sélection' : 'DC · Développement'}
    </Pill>
  )
}

/* ---------- Données ---------- */

export function Stat({ label, value, hint, tone }: { label: string; value: ReactNode; hint?: string; tone?: 'peach' | 'lime' }) {
  return (
    <div className="card p-5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-navy/45">{label}</p>
      <p className={cx('tabular mt-2 font-heading text-[34px] font-medium leading-none', tone === 'peach' && 'text-peach-dark')}>{value}</p>
      {hint && <p className="mt-2 text-[12.5px] text-navy/55">{hint}</p>}
    </div>
  )
}

export function ProgressBar({ value, tone = 'lime', className }: { value: number; tone?: 'lime' | 'teal' | 'navy'; className?: string }) {
  return (
    <div className={cx('h-1.5 overflow-hidden rounded-full bg-navy/[0.07]', className)}>
      <div
        className={cx('bar-in h-full rounded-full', tone === 'lime' && 'bg-lime-dark', tone === 'teal' && 'bg-teal', tone === 'navy' && 'bg-navy')}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  )
}

export function Avatar({ name, size = 36, tone = 'lime' }: { name: string; size?: number; tone?: 'lime' | 'navy' | 'teal' | 'peach' }) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')
  return (
    <span
      className={cx(
        'stadium inline-flex shrink-0 items-center justify-center font-heading font-medium',
        tone === 'lime' && 'bg-lime text-navy',
        tone === 'navy' && 'bg-navy text-lime',
        tone === 'teal' && 'bg-teal-pale text-teal-dark',
        tone === 'peach' && 'bg-peach-pale text-peach-dark',
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden
    >
      {letters}
    </span>
  )
}

/* ---------- Navigation ---------- */

export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange: (id: T) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-navy/10" role="tablist">
      {tabs.map((t) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cx(
              'relative -mb-px flex items-center gap-2 whitespace-nowrap px-4 py-3 text-[14px] transition-colors',
              active ? 'font-semibold text-navy' : 'text-navy/50 hover:text-navy',
            )}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={cx('stadium tabular px-1.5 text-[11px]', active ? 'bg-lime text-navy' : 'bg-navy/[0.06] text-navy/55')}>{t.count}</span>
            )}
            {active && <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-navy" />}
          </button>
        )
      })}
    </div>
  )
}

export function FilterChips<T extends string>({ options, value, onChange }: { options: { id: T; label: string; count?: number }[]; value: T; onChange: (id: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.id === value
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            aria-pressed={active}
            className={cx(
              'stadium flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] transition-colors',
              active ? 'bg-navy font-semibold text-white' : 'bg-white text-navy/65 ring-1 ring-inset ring-navy/10 hover:text-navy hover:ring-lime-dark',
            )}
          >
            {o.label}
            {o.count !== undefined && <span className={cx('tabular text-[11px]', active ? 'text-lime' : 'text-navy/40')}>{o.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

/* ---------- Formulaires ---------- */

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1.5 block text-[13px] font-semibold text-navy">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[12px] text-navy/50">{hint}</span>}
    </label>
  )
}

/* ---------- Divers ---------- */

export function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <span className="stadium flex h-12 w-12 items-center justify-center bg-lime-pale text-lime-dark">{icon}</span>
      <h3 className="mt-4 text-[18px] font-medium">{title}</h3>
      {children && <div className="mt-2 max-w-md text-[14px] leading-relaxed text-navy/60">{children}</div>}
    </div>
  )
}

export function Dialog({ open, onClose, title, eyebrow, children }: { open: boolean; onClose: () => void; title: string; eyebrow?: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-deep/50 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="rise-in w-full max-w-lg rounded-3xl bg-white p-7 shadow-[0_30px_80px_-20px_rgba(0,26,51,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow && <p className="eyebrow eyebrow--lime">{eyebrow}</p>}
            <h2 className="dot mt-1.5 text-[24px] font-medium leading-tight">{title}</h2>
          </div>
          <button onClick={onClose} className="stadium p-1.5 text-navy/40 transition-colors hover:bg-navy/5 hover:text-navy" aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}

const KIND_ICON: Record<ExerciseKind, typeof X> = {
  interview: MessageSquare,
  case: FileSearch,
  roleplay: Drama,
  presentation: Presentation,
  inbox: Inbox,
  group: UsersRound,
  break: Coffee,
}

export function ExerciseIcon({ kind, size = 40, onNavy = false }: { kind: ExerciseKind; size?: number; onNavy?: boolean }) {
  const Icon = KIND_ICON[kind]
  return (
    <span
      className={cx(
        'stadium inline-flex shrink-0 items-center justify-center',
        onNavy ? 'bg-white/10 text-lime' : kind === 'break' ? 'bg-peach-pale text-peach-dark' : 'bg-teal-pale text-teal-dark',
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <Icon size={size * 0.45} strokeWidth={1.9} />
    </span>
  )
}

export { cx }
