'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, LogOut, Menu, RotateCcw, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { features, fullName } from '@/lib/project'
import { wording } from '@/lib/wording'
import type { AppState, Role, Session } from '@/lib/types'
import { Avatar, cx } from './ui'

export const HOME_BY_ROLE: Record<Role, string> = {
  admin: '/projets',
  cdp: '/projets',
  participant: '/participant',
  assessor: '/assesseur',
  sponsor: '/commanditaire',
}

export function identity(state: AppState, session: Session) {
  switch (session.role) {
    case 'admin':
    case 'cdp': {
      const u = state.users.find((x) => x.id === session.userId)
      return { name: u?.name ?? '', label: u?.title ?? '' }
    }
    case 'participant': {
      const p = state.participants.find((x) => x.id === session.participantId)
      const project = state.projects.find((x) => x.id === p?.projectId)
      return { name: p ? fullName(p) : '', label: project ? `${wording(project.purpose).participant} · ${project.client}` : '' }
    }
    case 'assessor': {
      const a = state.assessors.find((x) => x.id === session.assessorId)
      return { name: a?.name ?? '', label: 'Assesseur' }
    }
    case 'sponsor': {
      const project = state.projects.find((x) => x.id === session.projectId)
      return { name: project?.sponsorName ?? '', label: `Commanditaire · ${project?.client ?? ''}` }
    }
  }
}

function navFor(state: AppState, session: Session) {
  switch (session.role) {
    case 'admin':
      return [
        { href: '/projets', label: 'Projets', exact: true },
        { href: '/projets/nouveau', label: 'Nouveau projet' },
        { href: '/equipe', label: 'Équipe & accès' },
      ]
    case 'cdp':
      return [
        { href: '/projets', label: 'Projets', exact: true },
        { href: '/projets/nouveau', label: 'Nouveau projet' },
      ]
    case 'participant': {
      const p = state.participants.find((x) => x.id === session.participantId)
      const project = state.projects.find((x) => x.id === p?.projectId)
      const items = [
        { href: '/participant', label: 'Mon parcours', exact: true },
        { href: '/participant/date', label: 'Ma date' },
        { href: '/participant/jour-j', label: 'Jour J' },
      ]
      if (project && features(project).feedback) items.push({ href: '/participant/feedback', label: 'Feedback' })
      return items
    }
    case 'assessor':
      return [{ href: '/assesseur', label: 'Mes sessions' }]
    case 'sponsor':
      return [{ href: '/commanditaire', label: 'Suivi du dispositif' }]
  }
}

export function AppShell({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { state } = useStore()
  const router = useRouter()
  const session = state.session
  const allowed = !!session && roles.includes(session.role)

  useEffect(() => {
    if (!allowed) router.replace('/')
  }, [allowed, router])

  if (!allowed || !session) return <div className="min-h-screen bg-cream" />

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader session={session} />
      <main className="flex-1 pb-20">
        <Suspense fallback={null}>{children}</Suspense>
      </main>
      <AppFooter />
    </div>
  )
}

function AppHeader({ session }: { session: Session }) {
  const { state } = useStore()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const nav = navFor(state, session)
  const me = identity(state, session)

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname === href || pathname.startsWith(href + '/'))

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-deep/95 text-white backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href={nav[0].href} className="flex shrink-0 items-center gap-3" aria-label="ATC Journey, accueil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-atc-white.png" alt="Authentic Talent" className="h-9 w-auto" />
          <span className="hidden h-6 w-px bg-white/15 sm:block" aria-hidden />
          <span className="hidden font-heading text-[15px] font-medium tracking-tight text-white/90 sm:block">
            ATC Journey<span className="text-lime">.</span>
          </span>
        </Link>

        <nav className="ml-6 hidden flex-1 items-center gap-1 md:flex" aria-label="Navigation principale">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cx('rounded-lg px-3 py-2 text-[13.5px] transition-colors', isActive(item.href, item.exact) ? 'font-medium text-lime' : 'text-white/70 hover:text-white')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ProfileMenu name={me.name} label={me.label} />
          <button className="p-1.5 md:hidden" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-white/10 bg-navy-deep px-4 py-3 md:hidden" aria-label="Navigation mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cx('block rounded-lg px-3 py-2.5 text-[15px]', isActive(item.href, item.exact) ? 'font-semibold text-lime' : 'text-white/80')}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

function ProfileMenu({ name, label }: { name: string; label: string }) {
  const { dispatch } = useStore()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [open])

  const item = 'flex w-full items-center gap-2.5 px-5 py-2.5 text-left text-[13.5px] text-white/80 transition-colors hover:bg-white/5 hover:text-lime'

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="stadium flex items-center gap-2.5 py-1 pl-1 pr-2.5 transition-colors hover:bg-white/5">
        <Avatar name={name} size={32} />
        <span className="hidden text-left leading-tight lg:block">
          <span className="block text-[13px] font-semibold text-white">{name}</span>
          <span className="block text-[11px] text-white/50">{label}</span>
        </span>
        <ChevronDown size={14} className={cx('text-white/40 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-white/10 bg-navy-deep py-2 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.6)]">
          <div className="px-5 pb-3 pt-2 lg:hidden">
            <p className="text-[14px] font-semibold">{name}</p>
            <p className="text-[12px] text-white/50">{label}</p>
          </div>
          <button
            onClick={() => {
              dispatch({ type: 'signOut' })
              router.push('/')
            }}
            className={item}
          >
            <LogOut size={15} /> Se déconnecter
          </button>
          <div className="mx-5 my-1.5 border-t border-white/10" />
          <button
            onClick={() => {
              dispatch({ type: 'reset' })
              setOpen(false)
            }}
            className={item}
          >
            <RotateCcw size={15} /> Réinitialiser la démo
          </button>
        </div>
      )}
    </div>
  )
}

export function AppFooter() {
  return (
    <footer className="border-t border-navy/10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-7 text-[12.5px] text-navy/50 sm:flex-row sm:px-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-atc-color.png" alt="Authentic Talent" className="h-7 w-auto opacity-80" />
          <span>ATC Journey · Authentic Talent Consulting</span>
        </div>
        <span>Environnement de démonstration · données fictives</span>
      </div>
    </footer>
  )
}
