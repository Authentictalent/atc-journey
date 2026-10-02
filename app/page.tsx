'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Clock, MapPin } from 'lucide-react'
import { useStore } from '@/lib/store'
import { DEMO_CDP } from '@/lib/seed'
import { FORMATS } from '@/lib/catalog'
import { fmtDate, fmtDuration, fmtTime } from '@/lib/dates'
import { fullName, schedule } from '@/lib/project'
import type { Format, Session } from '@/lib/types'
import { AppFooter } from '@/components/AppShell'
import { Avatar, cx } from '@/components/ui'

const JOURNEY = [
  { label: 'Invitation', text: 'Le participant reçoit son accès et découvre son parcours.' },
  { label: 'Hogan', text: 'Les inventaires de personnalité, en accès libre.' },
  { label: 'Questionnaire', text: 'Son parcours, ses motivations, ses attentes.' },
  { label: 'Jour J', text: 'Les mises en situation, révélées une à une.' },
  { label: 'Retour', text: 'Un questionnaire à chaud sur l’expérience vécue.' },
  { label: 'Feedback', text: 'La restitution, débloquée après le debrief client.' },
]

export default function HomePage() {
  const { state, dispatch } = useStore()
  const router = useRouter()

  const sanofi = state.projects.find((p) => p.id === 'pr-sanofi')
  const jean = state.participants.find((p) => p.id === 'pa-jean')
  const leila = state.participants.find((p) => p.id === 'pa-leila')
  const sophie = state.assessors.find((a) => a.id === 'a-sophie')

  const enter = (session: Session, href: string) => {
    dispatch({ type: 'signIn', session })
    router.push(href)
  }

  const profiles = [
    {
      key: 'cdp',
      eyebrow: 'Cheffe de projet',
      name: DEMO_CDP.name,
      text: 'Cadrez un dispositif, composez le planning, assignez les assesseurs et débloquez les feedbacks.',
      session: { role: 'cdp' } as Session,
      href: '/cdp',
      featured: true,
    },
    {
      key: 'assessor',
      eyebrow: 'Assesseur',
      name: sophie?.name ?? 'Assesseur',
      text: 'Préparez vos sessions, prenez vos notes en direct, complétez la grille.',
      session: { role: 'assessor', assessorId: 'a-sophie' } as Session,
      href: '/assesseur',
    },
    {
      key: 'candidate',
      eyebrow: 'Candidat · AC',
      name: jean ? fullName(jean) : 'Candidat',
      text: 'Le jour J vu de l’intérieur : un exercice après l’autre.',
      session: { role: 'participant', participantId: 'pa-jean' } as Session,
      href: '/participant',
    },
    {
      key: 'beneficiary',
      eyebrow: 'Bénéficiaire · DC',
      name: leila ? fullName(leila) : 'Bénéficiaire',
      text: 'Un Development Center en préparation, pré-DC en cours.',
      session: { role: 'participant', participantId: 'pa-leila' } as Session,
      href: '/participant',
    },
    {
      key: 'sponsor',
      eyebrow: 'Commanditaire',
      name: sanofi?.sponsorName ?? 'Commanditaire',
      text: 'L’avancement du dispositif, sans entrer dans l’évaluation.',
      session: { role: 'sponsor', projectId: 'pr-sanofi' } as Session,
      href: '/commanditaire',
    },
  ]

  const slots = sanofi ? schedule(sanofi) : []

  return (
    <div className="flex min-h-screen flex-col">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-navy-deep text-white">
        <div className="deco-pill hidden border-lime/60 md:block" style={{ width: 220, height: 64, top: 84, right: -90 }} aria-hidden />
        <div className="deco-pill hidden border-teal/55 md:block" style={{ width: 150, height: 52, bottom: 34, right: 140 }} aria-hidden />
        <div className="deco-pill hidden border-peach/55 md:block" style={{ width: 200, height: 64, bottom: 40, left: -90 }} aria-hidden />

        <div className="relative mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-atc-white.png" alt="Authentic Talent, make your talent shine" className="h-10 w-auto" />
            <span className="hidden h-6 w-px bg-white/15 sm:block" aria-hidden />
            <span className="hidden font-heading text-[15px] font-medium text-white/90 sm:block">
              ATC Journey<span className="text-lime">.</span>
            </span>
          </div>
          <a href="#demo" className="stadium bg-lime px-4 py-1.5 text-[13px] font-semibold text-navy transition-colors hover:bg-lime-light">
            Accéder à la démo
          </a>
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-24 pt-14 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:pb-28 lg:pt-20">
          <div>
            <p className="eyebrow eyebrow--on-navy rise-in">Assessment & Development Centers · Authentic Talent Consulting</p>
            <h1 className="dot dot--bright rise-in mt-5 text-[44px] font-medium leading-[1.04] tracking-tight sm:text-[60px] lg:text-[66px]" style={{ animationDelay: '0.07s' }}>
              Chaque talent mérite un parcours à sa hauteur
            </h1>
            <p className="rise-in mt-6 max-w-xl text-[17px] leading-relaxed text-white/70" style={{ animationDelay: '0.14s' }}>
              De l’invitation au feedback, ATC Journey réunit candidats, assesseurs, cheffes de projet et commanditaires
              autour d’une même expérience : exigeante, fluide, et profondément humaine.
            </p>
            <div className="rise-in mt-9 flex flex-wrap gap-3" style={{ animationDelay: '0.21s' }}>
              <a href="#demo" className="stadium inline-flex items-center gap-2 bg-lime px-6 py-3 text-[15px] font-semibold text-navy transition-colors hover:bg-lime-light">
                Choisir un profil <ArrowRight size={16} />
              </a>
              <a href="#parcours" className="stadium inline-flex items-center gap-2 border border-white/20 px-6 py-3 text-[15px] text-white/80 transition-colors hover:border-lime/60 hover:text-white">
                Découvrir le parcours
              </a>
            </div>
          </div>

          {/* Aperçu vivant : la journée Sanofi telle qu'elle se déroule aujourd'hui */}
          {sanofi && (
            <div className="rise-in relative" style={{ animationDelay: '0.28s' }}>
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] backdrop-blur sm:p-7">
                <div className="flex items-center justify-between">
                  <p className="eyebrow eyebrow--on-navy">Aujourd’hui</p>
                  <span className="stadium flex items-center gap-1.5 bg-lime/15 px-2.5 py-1 text-[11px] font-semibold text-lime">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" /> Jour J en cours
                  </span>
                </div>
                <h2 className="mt-3 text-[22px] font-medium leading-snug">
                  {sanofi.client} · {sanofi.position}
                </h2>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-white/55">
                  <span className="flex items-center gap-1.5"><Clock size={13} /> {fmtDate(sanofi.date)}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={13} /> {sanofi.location}</span>
                </div>
                <div className="tick-rule tick-rule--navy my-5" />
                <ol className="space-y-2.5">
                  {slots.map((s, i) => (
                    <li key={s.id} className={cx('flex items-center gap-4 rounded-2xl px-4 py-3', i === 1 ? 'bg-white/[0.07] ring-1 ring-lime/40' : '')}>
                      <span className="tabular w-16 shrink-0 whitespace-nowrap font-mono text-[12.5px] text-white/50">{fmtTime(s.start)}</span>
                      <span className={cx('flex-1 text-[14px]', i === 1 ? 'font-semibold text-white' : 'text-white/70')}>{s.catalog.name}</span>
                      <span className="text-[12px] text-white/40">{fmtDuration(s.duration)}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex items-center justify-between text-[12.5px] text-white/50">
                  <span>{state.participants.filter((p) => p.projectId === sanofi.id).length} candidats · lead {state.assessors.find((a) => a.id === sanofi.leadAssessorId)?.name}</span>
                  <span className="text-lime">Format {FORMATS[sanofi.format].label}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="tick-rule tick-rule--navy" />
      </section>

      {/* ============ PROFILS DE DÉMO ============ */}
      <section id="demo" className="mx-auto w-full max-w-7xl scroll-mt-6 px-4 py-20 sm:px-6 lg:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow eyebrow--lime">Démonstration</p>
          <h2 className="dot mt-2.5 text-[32px] font-medium leading-tight sm:text-[40px]">Entrez par le rôle de votre choix</h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-navy/60">
            Chaque profil voit la plateforme telle qu’elle lui est destinée. Les données sont fictives et vos actions sont conservées dans ce navigateur.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((p) => (
            <button
              key={p.key}
              onClick={() => enter(p.session, p.href)}
              className={cx(
                'card card--hover group flex flex-col p-6 text-left',
                p.featured && 'relative overflow-hidden bg-navy text-white sm:col-span-2 lg:col-span-2',
              )}
            >
              {p.featured && <div className="deco-pill border-lime/40" style={{ width: 180, height: 58, bottom: -20, right: -40 }} aria-hidden />}
              <div className="flex items-center gap-3">
                <Avatar name={p.name} size={42} tone={p.featured ? 'lime' : 'navy'} />
                <div>
                  <p className={cx('eyebrow', p.featured ? 'eyebrow--on-navy' : 'eyebrow--lime')}>{p.eyebrow}</p>
                  <p className={cx('mt-0.5 font-heading text-[18px] font-medium', p.featured ? 'text-white' : 'text-navy')}>{p.name}</p>
                </div>
              </div>
              <p className={cx('mt-5 flex-1 text-[14px] leading-relaxed', p.featured ? 'max-w-md text-white/65' : 'text-navy/60')}>{p.text}</p>
              <span className={cx('mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold', p.featured ? 'text-lime' : 'text-navy')}>
                Entrer <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ============ LE PARCOURS ============ */}
      <section id="parcours" className="mx-auto w-full max-w-7xl scroll-mt-6 px-4 pb-20 sm:px-6 lg:pb-24">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">Le parcours</p>
          <h2 className="dot mt-2.5 text-[32px] font-medium leading-tight sm:text-[40px]">De l’invitation au feedback, sans couture</h2>
        </div>
        <div className="relative">
          <div className="absolute inset-x-0 top-[6px] hidden h-px bg-navy/10 lg:block" aria-hidden />
          <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5">
            {JOURNEY.map((step, i) => (
              <li key={step.label} className="relative">
                <div className="flex items-center gap-3">
                  <span className="relative z-10 h-[13px] w-[13px] rounded-full bg-lime-dark ring-4 ring-cream" />
                  <span className="font-heading text-[15px] font-medium text-navy/35">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-4 text-[17px] font-semibold">{step.label}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-navy/60">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ FORMATS ============ */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-navy text-white">
          <div className="deco-pill hidden border-peach/40 md:block" style={{ width: 170, height: 56, bottom: -22, right: -46 }} aria-hidden />
          <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <p className="eyebrow eyebrow--on-navy">Trois formats</p>
              <h2 className="dot dot--bright mt-2 text-3xl font-medium leading-tight">Le dispositif juste, pour chaque enjeu</h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/65">
                En sélection (AC) comme en développement (DC), le format fixe la profondeur de l’évaluation et l’équipe mobilisée.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {(Object.keys(FORMATS) as Format[]).map((f) => (
                <div key={f} className="rounded-2xl border border-white/15 bg-white/[0.05] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-lime">{FORMATS[f].length}</p>
                  <h3 className="mt-2 text-xl font-medium">{FORMATS[f].label}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/60">{FORMATS[f].description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  )
}
