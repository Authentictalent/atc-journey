'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Check, Lock, Mail, MapPin, SkipForward, Video } from 'lucide-react'
import { useMe } from '@/lib/useMe'
import { daysBetween, fmtDate, fmtDuration, fmtTime, todayISO } from '@/lib/dates'
import { endTime, isDayDone, participantDate, participantStart, scheduleFor, venueLabel } from '@/lib/project'
import { ButtonLink, Button, ExerciseIcon, PageHeader, cx } from '@/components/ui'

function useRemaining(startedAt: string | undefined, minutes: number) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const total = minutes * 60
  const elapsed = startedAt ? Math.floor((now - new Date(startedAt).getTime()) / 1000) : 0
  return { total, remaining: Math.max(0, total - elapsed) }
}

function TimerRing({ startedAt, minutes }: { startedAt?: string; minutes: number }) {
  const { total, remaining } = useRemaining(startedAt, minutes)
  const r = 92
  const c = 2 * Math.PI * r
  const ratio = total ? remaining / total : 0
  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  return (
    <div className="relative mx-auto h-[220px] w-[220px]" role="timer" aria-label={`Temps restant ${mm} minutes ${ss} secondes`}>
      <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
        <circle cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle cx="110" cy="110" r={r} fill="none" stroke="var(--lime)" strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - ratio)} style={{ transition: 'stroke-dashoffset 1s linear' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tabular font-mono text-[46px] font-medium leading-none tracking-tight text-white">
          {mm}:{ss}
        </span>
        <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-white/45">{remaining ? 'restantes' : 'temps écoulé'}</span>
      </div>
    </div>
  )
}

export default function JourJPage() {
  const me = useMe()
  if (!me) return null
  const { participant: p, project, w, f, dispatch } = me

  const slots = scheduleFor(project, p)
  const date = participantDate(p)
  const start = participantStart(project, p)
  const isTeams = project.venue.mode === 'teams'
  const finished = isDayDone(project, p)
  const step = p.dayProgress

  const goTo = (index: number) =>
    dispatch({ type: 'updateParticipant', id: p.id, patch: { dayProgress: index, exerciseStartedAt: new Date().toISOString() } })

  /* ---------- Date pas encore fixée ---------- */
  if (!date)
    return (
      <>
        <PageHeader back={{ href: '/participant', label: 'Mon parcours' }} eyebrow="Votre journée" tone="lime" title="Votre date n’est pas encore fixée" description="Dès qu’elle sera confirmée, vous retrouverez ici toutes les informations pratiques, puis votre programme le jour J." />
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ButtonLink href="/participant/date" variant="primary">
            {p.slot.status === 'proposed' ? 'Choisir ma date' : 'Voir où en est ma date'} <ArrowRight size={15} />
          </ButtonLink>
        </div>
      </>
    )

  const daysToGo = daysBetween(todayISO(), date)

  /* ---------- Avant le jour J : programme caché ---------- */
  if (daysToGo > 0)
    return (
      <>
        <PageHeader back={{ href: '/participant', label: 'Mon parcours' }} eyebrow={`Dans ${daysToGo} jour${daysToGo > 1 ? 's' : ''}`} tone="lime" title="Votre journée" description={`${w.assessment} · ${project.client}`} />
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white sm:p-10">
            <div className="deco-pill border-lime/40" style={{ width: 170, height: 56, bottom: -20, right: -40 }} aria-hidden />
            <span className="stadium flex h-12 w-12 items-center justify-center bg-white/10 text-lime">
              <Lock size={20} />
            </span>
            <h2 className="dot dot--bright mt-6 text-[30px] font-medium leading-tight">Votre programme sera révélé le matin même</h2>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/65">
              Les mises en situation sont pensées pour être découvertes sur le moment. Inutile de vous préparer sur un contenu précis : venez comme vous êtes, reposé·e et disponible.
            </p>
            <div className="tick-rule tick-rule--navy my-7" />
            <p className="tabular font-mono text-[14px] text-white/70">
              {fmtTime(start)} → {fmtTime(endTime(project, start))} · {slots.filter((s) => s.catalog.kind !== 'break').length} séquences
            </p>
          </div>
          <div className="card p-7">
            <p className="eyebrow eyebrow--peach">Pour bien vous préparer</p>
            <ul className="mt-5 space-y-4 text-[14.5px] leading-relaxed">
              {[
                f.preQuestionnaire ? `Terminez votre ${w.pre} si ce n’est pas déjà fait.` : 'Complétez vos inventaires Hogan si ce n’est pas déjà fait.',
                isTeams ? 'Testez votre caméra et votre micro la veille, dans un lieu calme.' : `Prévoyez d’arriver 15 minutes en avance. ${venueLabel(project)}.`,
                'Gardez de quoi écrire : certaines séquences incluent un temps de préparation.',
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-dark" /> {t}
                </li>
              ))}
            </ul>
            <div className="tick-rule my-6" />
            <p className="font-heading text-[19px] font-medium first-letter:uppercase">{fmtDate(date)}</p>
            <p className="mt-1 flex items-center gap-2 text-[13.5px] text-navy/55">
              <MapPin size={14} /> {venueLabel(project)}
            </p>
            {p.teamsUrl && (
              <a href={p.teamsUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-teal-dark hover:underline">
                <Video size={14} /> Lien Teams de votre journée
              </a>
            )}
          </div>
        </div>
      </>
    )

  /* ---------- Journée terminée ---------- */
  if (finished)
    return (
      <>
        <PageHeader back={{ href: '/participant', label: 'Mon parcours' }} eyebrow={fmtDate(date)} tone="lime" title="Votre journée est terminée" description="Merci pour votre engagement tout au long de ces mises en situation." />
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
          <ol className="card divide-y divide-navy/[0.07]">
            {slots.map((s) => (
              <li key={s.id} className="flex items-center gap-4 px-6 py-4">
                <span className="tabular w-14 font-mono text-[12.5px] text-navy/50">{fmtTime(s.start)}</span>
                <ExerciseIcon kind={s.catalog.kind} size={34} />
                <span className="flex-1 text-[14.5px] font-medium">{s.catalog.name}</span>
                <Check size={16} className="text-lime-dark" />
              </li>
            ))}
          </ol>
          {f.postQuestionnaire && (
            <div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white">
              <div className="deco-pill border-peach/45" style={{ width: 150, height: 50, top: -16, right: -30 }} aria-hidden />
              <p className="eyebrow eyebrow--on-navy">À chaud</p>
              <h2 className="dot dot--bright mt-2 text-[26px] font-medium leading-tight">Comment l’avez-vous vécue ?</h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/65">Deux minutes pour nous dire ce que vous avez ressenti.</p>
              {p.postQuestionnaire === 'done' ? (
                <p className="mt-6 flex items-center gap-2 text-[14px] font-semibold text-lime">
                  <Check size={16} /> Merci, votre retour est envoyé
                </p>
              ) : (
                <ButtonLink href="/participant/questionnaire/post" variant="lime" className="mt-6">
                  Donner mon avis <ArrowRight size={15} />
                </ButtonLink>
              )}
            </div>
          )}
        </div>
      </>
    )

  /* ---------- Jour J, pas encore commencé ---------- */
  if (step < 0)
    return (
      <section className="relative overflow-hidden bg-navy-deep text-white">
        <div className="deco-pill hidden border-lime/55 md:block" style={{ width: 220, height: 70, top: 60, right: -70 }} aria-hidden />
        <div className="deco-pill hidden border-peach/50 md:block" style={{ width: 170, height: 56, bottom: 50, left: -60 }} aria-hidden />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
          <span className="stadium inline-flex items-center gap-1.5 bg-lime/15 px-3 py-1 text-[12px] font-semibold text-lime">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-lime" /> Aujourd’hui
          </span>
          <h1 className="dot dot--bright rise-in mt-6 text-[40px] font-medium leading-[1.06] sm:text-[56px]">Bienvenue dans votre journée, {p.firstName}</h1>
          <p className="rise-in mt-5 max-w-xl text-[16.5px] leading-relaxed text-white/65" style={{ animationDelay: '0.1s' }}>
            {slots.filter((s) => s.catalog.kind !== 'break').length} mises en situation vous attendent, de {fmtTime(start)} à {fmtTime(endTime(project, start))}. Chacune se dévoile au moment où elle commence, avec ses consignes.
          </p>
          <div className="rise-in mt-10 flex flex-wrap justify-center gap-3" style={{ animationDelay: '0.2s' }}>
            <Button variant="lime" size="lg" onClick={() => goTo(0)}>
              Commencer <ArrowRight size={16} />
            </Button>
            {p.teamsUrl && (
              <a href={p.teamsUrl} target="_blank" rel="noreferrer" className="stadium inline-flex items-center gap-2 border border-white/20 px-7 py-3.5 text-[15px] text-white/80 transition-colors hover:border-lime/60 hover:text-white">
                <Video size={16} /> Rejoindre Teams
              </a>
            )}
          </div>
        </div>
        <div className="tick-rule tick-rule--navy" />
      </section>
    )

  /* ---------- Jour J, exercice en cours ---------- */
  const current = slots[step]
  const isLast = step === slots.length - 1
  const isBreak = current.catalog.kind === 'break'

  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep text-white">
        <div className="deco-pill hidden border-lime/45 lg:block" style={{ width: 200, height: 64, top: 30, right: -80 }} aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:py-16">
          <div key={current.id} className="rise-in">
            <p className="eyebrow eyebrow--on-navy">
              {isBreak ? 'Pause' : `Séquence ${slots.slice(0, step + 1).filter((s) => s.catalog.kind !== 'break').length} sur ${slots.filter((s) => s.catalog.kind !== 'break').length}`} · {fmtTime(current.start)} à {fmtTime(current.end)}
            </p>
            <h1 className="dot dot--bright mt-3 text-[36px] font-medium leading-[1.06] sm:text-[48px]">{current.catalog.name}</h1>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-white/65">{current.catalog.pitch}</p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="eyebrow eyebrow--on-navy">Consignes</p>
              <ul className="mt-4 space-y-3">
                {current.catalog.instructions.map((t) => (
                  <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-white/85">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            {!isBreak && p.teamsUrl && (
              <a href={p.teamsUrl} target="_blank" rel="noreferrer" className="stadium mt-7 inline-flex items-center gap-2 bg-lime px-6 py-3 text-[15px] font-semibold text-navy transition-colors hover:bg-lime-light">
                <Video size={16} /> Rejoindre la séance sur Teams
              </a>
            )}
          </div>

          <div className="flex flex-col items-center">
            <TimerRing startedAt={p.exerciseStartedAt} minutes={current.duration} />
            <p className="mt-4 text-[13px] text-white/50">Durée prévue : {fmtDuration(current.duration)}</p>
          </div>
        </div>
        <div className="tick-rule tick-rule--navy" />
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-[1fr_340px]">
        <section>
          <p className="eyebrow">Votre journée</p>
          <ol className="mt-5 space-y-2.5">
            {slots.map((s, i) => {
              const done = i < step
              const now = i === step
              const hidden = i > step
              return (
                <li
                  key={s.id}
                  className={cx(
                    'flex items-center gap-4 rounded-2xl px-5 py-4',
                    now ? 'bg-white shadow-[0_2px_8px_rgba(0,36,70,0.07)] ring-1 ring-lime-dark' : done ? 'bg-white/60' : 'border border-dashed border-navy/15',
                  )}
                >
                  <span className="tabular w-14 shrink-0 font-mono text-[12.5px] text-navy/50">{fmtTime(s.start)}</span>
                  {hidden ? (
                    <span className="stadium flex h-[34px] w-[34px] items-center justify-center bg-navy/[0.05] text-navy/30">
                      <Lock size={14} />
                    </span>
                  ) : (
                    <ExerciseIcon kind={s.catalog.kind} size={34} />
                  )}
                  <span className={cx('flex-1 text-[14.5px]', now ? 'font-semibold' : done ? 'text-navy/60' : 'text-navy/40')}>
                    {hidden ? (s.catalog.kind === 'break' ? 'Pause' : 'Séquence à découvrir') : s.catalog.name}
                  </span>
                  {done && <Check size={16} className="text-lime-dark" />}
                  {now && <span className="stadium bg-lime px-2.5 py-0.5 text-[11px] font-semibold text-navy">En cours</span>}
                  {hidden && <span className="text-[12px] text-navy/35">{fmtDuration(s.duration)}</span>}
                </li>
              )
            })}
          </ol>
        </section>

        <aside className="space-y-4">
          <div className="card p-6">
            <p className="eyebrow eyebrow--peach">Besoin d’aide ?</p>
            <p className="mt-3 text-[14px] leading-relaxed text-navy/65">Un souci de connexion ou un imprévu : votre cheffe de projet est joignable toute la journée.</p>
            <a href="mailto:contact@authentictalent.fr" className="mt-3 flex items-center gap-2 text-[14px] font-semibold text-teal-dark hover:underline">
              <Mail size={14} /> contact@authentictalent.fr
            </a>
          </div>
          <div className="rounded-2xl border border-dashed border-navy/20 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-navy/45">Mode démonstration</p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-navy/55">En situation réelle, la séquence suivante s’ouvre à l’heure prévue.</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => goTo(isLast ? slots.length : step + 1)}>
              <SkipForward size={14} /> {isLast ? 'Terminer la journée' : 'Passer à la suite'}
            </Button>
          </div>
        </aside>
      </div>
    </>
  )
}
