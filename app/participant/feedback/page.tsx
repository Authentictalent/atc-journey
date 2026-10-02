'use client'

import { CalendarDays, Check, Lock, Quote, Video } from 'lucide-react'
import { useMe } from '@/lib/useMe'
import { DEMO_CDP } from '@/lib/seed'
import { fmtDate, fmtTime } from '@/lib/dates'
import { EmptyState, PageHeader } from '@/components/ui'

export default function FeedbackPage() {
  const me = useMe()
  if (!me) return null
  const { participant: p, project, w, f } = me
  const fb = p.feedback

  if (!f.feedback)
    return (
      <div className="mx-auto max-w-3xl px-4 pt-16">
        <EmptyState icon={<Check size={20} />} title="Pas de feedback sur la plateforme">
          Pour ce format, votre consultant vous recontacte directement.
        </EmptyState>
      </div>
    )

  if (fb.status === 'locked')
    return (
      <>
        <PageHeader back={{ href: '/participant', label: 'Mon parcours' }} eyebrow={`Feedback · ${w.post}`} tone="peach" title="Votre feedback se prépare" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white sm:p-12">
            <div className="deco-pill border-peach/45" style={{ width: 180, height: 58, bottom: -22, right: -40 }} aria-hidden />
            <span className="stadium flex h-12 w-12 items-center justify-center bg-white/10 text-lime">
              <Lock size={20} />
            </span>
            <h2 className="dot dot--bright mt-6 max-w-2xl text-[30px] font-medium leading-tight">Il s’ouvrira après l’échange entre Authentic Talent et {project.client}</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/65">
              Vos assesseurs consolident leurs observations. Dès que votre session de feedback est fixée, vous la retrouverez ici avec la synthèse de votre parcours.
            </p>
            <ol className="mt-9 grid gap-4 sm:grid-cols-3">
              {['Consolidation par vos assesseurs', `Debrief avec ${project.client}`, 'Votre session de feedback'].map((t, i) => (
                <li key={t} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <span className="font-heading text-[15px] text-lime">{String(i + 1).padStart(2, '0')}</span>
                  <p className="mt-2 text-[14.5px] text-white/80">{t}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </>
    )

  return (
    <>
      <PageHeader back={{ href: '/participant', label: 'Mon parcours' }} eyebrow={`Feedback · ${project.client}`} tone="peach" title="Votre restitution" description="Un regard extérieur sur vos forces et vos leviers de progression, à approfondir ensemble lors de votre session." />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {fb.summary ? (
            <figure className="card relative p-8 sm:p-10">
              <Quote size={28} className="text-lime-dark" />
              <blockquote className="mt-4 font-heading text-[21px] font-normal leading-[1.5] text-navy sm:text-[23px]">{fb.summary}</blockquote>
              <figcaption className="mt-6 text-[13px] text-navy/50">Synthèse de vos assesseurs · Authentic Talent</figcaption>
            </figure>
          ) : (
            <div className="card p-8 text-[15px] leading-relaxed text-navy/65">Votre synthèse vous sera présentée de vive voix lors de votre session de feedback.</div>
          )}

          {!!(fb.strengths?.length || fb.development?.length) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {fb.strengths?.length ? (
                <div className="card p-6">
                  <p className="eyebrow eyebrow--lime">Vos appuis</p>
                  <ul className="mt-4 space-y-3">
                    {fb.strengths.map((s) => (
                      <li key={s} className="flex gap-3 text-[14.5px] leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime-dark" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {fb.development?.length ? (
                <div className="card p-6">
                  <p className="eyebrow">Vos leviers de progression</p>
                  <ul className="mt-4 space-y-3">
                    {fb.development.map((s) => (
                      <li key={s} className="flex gap-3 text-[14.5px] leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </div>

        <aside>
          <div className="relative overflow-hidden rounded-3xl bg-navy p-7 text-white">
            <div className="deco-pill border-lime/40" style={{ width: 140, height: 46, top: -14, right: -26 }} aria-hidden />
            <p className="eyebrow eyebrow--on-navy">Votre session</p>
            {fb.sessionDate ? (
              <>
                <p className="mt-4 flex items-center gap-2.5 font-heading text-[22px] font-medium leading-snug">
                  <CalendarDays size={20} className="text-lime" /> {fmtDate(fb.sessionDate)}
                </p>
                {fb.sessionTime && <p className="tabular mt-1 pl-[30px] font-mono text-[15px] text-white/70">{fmtTime(fb.sessionTime)} · 1 h 30</p>}
              </>
            ) : (
              <p className="mt-4 text-[15px] text-white/70">Date en cours de planification.</p>
            )}
            <div className="tick-rule tick-rule--navy my-6" />
            <p className="text-[13.5px] leading-relaxed text-white/60">
              Avec votre lead assesseur, en visio. C’est aussi le moment de découvrir vos résultats Hogan, commentés.
            </p>
            <a href={project.teamsUrl} target="_blank" rel="noreferrer" className="stadium mt-6 inline-flex items-center gap-2 bg-lime px-5 py-2.5 text-[14px] font-semibold text-navy hover:bg-lime-light">
              <Video size={15} /> Lien de la session
            </a>
            <p className="mt-5 text-[12.5px] text-white/45">Un empêchement ? Écrivez à {DEMO_CDP.name}, votre cheffe de projet.</p>
          </div>
        </aside>
      </div>
    </>
  )
}
