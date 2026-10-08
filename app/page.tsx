'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, ChevronDown, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fullName } from '@/lib/project'
import { wording } from '@/lib/wording'
import type { AppState, Session } from '@/lib/types'
import { HOME_BY_ROLE } from '@/components/AppShell'
import { Avatar, Button, cx } from '@/components/ui'

type Account = { email: string; name: string; label: string; session: Session; active: boolean }

function accounts(state: AppState): Account[] {
  return [
    ...state.users.map((u) => ({ email: u.email, name: u.name, label: u.role === 'admin' ? 'Admin' : 'Cheffe de projet', session: { role: u.role, userId: u.id } as Session, active: u.active })),
    ...state.assessors.map((a) => ({ email: a.email, name: a.name, label: 'Assesseur', session: { role: 'assessor', assessorId: a.id } as Session, active: a.active })),
    ...state.participants.map((p) => {
      const project = state.projects.find((x) => x.id === p.projectId)
      return {
        email: p.email,
        name: fullName(p),
        label: project ? `${wording(project.purpose).participant} · ${project.client}` : 'Participant',
        session: { role: 'participant', participantId: p.id } as Session,
        active: true,
      }
    }),
    ...state.projects
      .filter((p) => p.sponsorEmail)
      .map((p) => ({ email: p.sponsorEmail, name: p.sponsorName, label: `Commanditaire · ${p.client}`, session: { role: 'sponsor', projectId: p.id } as Session, active: true })),
  ]
}

const DEMO_GROUPS: { title: string; emails: string[] }[] = [
  { title: 'Équipe ATC', emails: ['margaux.lefort@authentictalent.fr', 'camille.laurent@authentictalent.fr', 'sophie.durand@authentictalent.fr'] },
  { title: 'Candidats et bénéficiaires', emails: ['jean.dupont@exemple.fr', 'leila.mansouri@exemple.fr', 'karim.haddad@exemple.fr'] },
  { title: 'Client', emails: ['marc.lefevre@exemple.fr'] },
]

export default function LoginPage() {
  const { state, dispatch } = useStore()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [forgot, setForgot] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)

  const session = state.session
  useEffect(() => {
    if (session) router.replace(HOME_BY_ROLE[session.role])
  }, [session, router])

  const all = accounts(state)

  const enter = (account: Account) => {
    if (!account.active) {
      setError('Cet accès a été désactivé. Contactez Authentic Talent pour le réactiver.')
      return
    }
    dispatch({ type: 'signIn', session: account.session })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const account = all.find((a) => a.email.toLowerCase() === email.trim().toLowerCase())
    if (!account) return setError('Aucun compte ne correspond à cet email. Vérifiez l’adresse reçue dans votre invitation.')
    if (!password) return setError('Saisissez votre mot de passe.')
    enter(account)
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ============ Panneau de marque ============ */}
      <section className="relative flex flex-col overflow-hidden bg-navy-deep px-6 py-8 text-white sm:px-10 lg:px-14 lg:py-12">
        <div className="deco-pill hidden border-lime/60 lg:block" style={{ width: 240, height: 76, top: 150, right: -90 }} aria-hidden />
        <div className="deco-pill hidden border-teal/50 lg:block" style={{ width: 150, height: 52, top: 204, right: 120 }} aria-hidden />
        <div className="deco-pill hidden border-peach/55 lg:block" style={{ width: 210, height: 66, bottom: 70, left: -90 }} aria-hidden />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-atc-white.png" alt="Authentic Talent, make your talent shine" className="relative h-11 w-auto self-start" />

        <div className="relative my-10 max-w-lg lg:my-auto">
          <p className="eyebrow eyebrow--on-navy rise-in">ATC Journey</p>
          <h1 className="dot dot--bright rise-in mt-4 text-[38px] font-medium leading-[1.06] tracking-tight sm:text-[52px]" style={{ animationDelay: '0.07s' }}>
            Votre parcours, au même endroit
          </h1>
          <p className="rise-in mt-5 hidden text-[16.5px] leading-relaxed text-white/65 sm:block" style={{ animationDelay: '0.14s' }}>
            Assessment & Development Centers : la date de votre journée, vos questionnaires, votre programme et votre feedback, réunis dans un espace sécurisé.
          </p>
        </div>

        <p className="relative hidden text-[12.5px] text-white/40 lg:block">© Authentic Talent Consulting</p>
      </section>

      {/* ============ Formulaire ============ */}
      <section className="flex items-center justify-center bg-cream px-6 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          <p className="eyebrow eyebrow--lime">Connexion</p>
          <h2 className="dot mt-2 text-[32px] font-medium leading-tight">Bienvenue</h2>
          <p className="mt-2 text-[15px] text-navy/60">Connectez-vous avec l’email de votre invitation.</p>

          <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
            <label className="block">
              <span className="mb-1.5 block text-[13px] font-semibold">Email</span>
              <span className="relative block">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/35" />
                <input
                  type="email"
                  autoComplete="email"
                  className="field !pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prenom.nom@entreprise.fr"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 flex items-baseline justify-between text-[13px] font-semibold">
                Mot de passe
                <button type="button" onClick={() => setForgot((f) => !f)} className="text-[12.5px] font-normal text-teal-dark hover:underline">
                  Mot de passe oublié ?
                </button>
              </span>
              <span className="relative block">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/35" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="field !pl-10 !pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-navy/40 hover:text-navy"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>

            {forgot && (
              <p className="rounded-2xl bg-teal-pale px-4 py-3 text-[13px] leading-relaxed text-teal-dark">
                Écrivez à contact@authentictalent.fr : votre cheffe de projet vous renverra un lien de connexion.
              </p>
            )}
            {error && (
              <p role="alert" className="rounded-2xl bg-peach-pale px-4 py-3 text-[13px] leading-relaxed text-peach-dark">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full">
              Se connecter <ArrowRight size={16} />
            </Button>
          </form>

          {/* Accès démo : discret, pour les tests internes */}
          <div className="mt-10 border-t border-navy/10 pt-5">
            <button onClick={() => setDemoOpen((o) => !o)} aria-expanded={demoOpen} className="flex items-center gap-1.5 text-[12.5px] text-navy/45 hover:text-navy">
              Accès démo <ChevronDown size={13} className={cx('transition-transform', demoOpen && 'rotate-180')} />
            </button>
            {demoOpen && (
              <div className="mt-4 space-y-5">
                <p className="text-[12.5px] text-navy/50">Environnement de démonstration : tout mot de passe est accepté.</p>
                {DEMO_GROUPS.map((g) => (
                  <div key={g.title}>
                    <p className="eyebrow eyebrow--muted !text-[10px]">{g.title}</p>
                    <ul className="mt-2 space-y-1.5">
                      {g.emails
                        .map((e) => all.find((a) => a.email === e))
                        .filter((a): a is Account => !!a)
                        .map((a) => (
                          <li key={a.email}>
                            <button onClick={() => enter(a)} className="flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-2.5 text-left ring-1 ring-navy/[0.07] transition-colors hover:ring-lime-dark">
                              <Avatar name={a.name} size={30} tone="navy" />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[13.5px] font-semibold">{a.name}</span>
                                <span className="block truncate text-[12px] text-navy/50">{a.label}</span>
                              </span>
                              <ArrowRight size={14} className="text-navy/30" />
                            </button>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
