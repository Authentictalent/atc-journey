'use client'

import { useState } from 'react'
import { ArrowRight, CalendarDays, Check, Clock, MapPin, Plus, Send, Trash, Video } from 'lucide-react'
import { useMe } from '@/lib/useMe'
import { fmtDate, fmtDuration, fmtTime } from '@/lib/dates'
import { confirmSlotPatch, endTime, venueLabel } from '@/lib/project'
import type { Participant, SlotOption } from '@/lib/types'
import { Button, ButtonLink, PageHeader, cx } from '@/components/ui'

export default function DatePage() {
  const me = useMe()
  const [picked, setPicked] = useState<number | null>(null)
  const [proposing, setProposing] = useState(false)
  const [own, setOwn] = useState<SlotOption[]>([{ date: '', time: '' }])
  if (!me) return null
  const { participant: p, project, w, cdp, dispatch } = me

  const cdpName = cdp?.name ?? 'votre cheffe de projet'
  const total = project.exercises.reduce((s, e) => s + e.duration, 0)
  const update = (patch: Partial<Participant>) => dispatch({ type: 'updateParticipant', id: p.id, patch })

  /* ---------- Date confirmée ---------- */
  if (p.slot.status === 'confirmed' && p.slot.confirmed) {
    const c = p.slot.confirmed
    return (
      <>
        <PageHeader back={{ href: '/participant', label: 'Mon parcours' }} eyebrow="Votre date" tone="lime" title="C’est noté" description={`Votre ${w.assessment.toLowerCase()} est confirmé.`} />
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-navy p-8 text-white sm:p-10">
            <div className="deco-pill border-lime/45" style={{ width: 170, height: 56, top: -18, right: -40 }} aria-hidden />
            <p className="eyebrow eyebrow--on-navy">Votre journée</p>
            <p className="dot dot--bright mt-3 font-heading text-[30px] font-medium leading-tight first-letter:uppercase sm:text-[36px]">{fmtDate(c.date)}</p>
            <ul className="mt-6 space-y-3 text-[15px] text-white/80">
              <li className="flex items-center gap-3">
                <Clock size={17} className="text-lime" /> De {fmtTime(c.time)} à {fmtTime(endTime(project, c.time))} environ
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={17} className="text-lime" /> {venueLabel(project)}
              </li>
            </ul>
            {p.teamsUrl && (
              <a href={p.teamsUrl} target="_blank" rel="noreferrer" className="stadium mt-8 inline-flex items-center gap-2 bg-lime px-6 py-3 text-[15px] font-semibold text-navy hover:bg-lime-light">
                <Video size={16} /> Lien Teams de votre journée
              </a>
            )}
          </div>
          <p className="mt-6 text-center text-[14px] text-navy/55">
            Un empêchement ? Écrivez à {cdpName}{cdp ? ` (${cdp.email})` : ''}, qui pourra déplacer votre date.
          </p>
        </div>
      </>
    )
  }

  /* ---------- Contre-proposition envoyée ---------- */
  if (p.slot.status === 'counter')
    return (
      <>
        <PageHeader back={{ href: '/participant', label: 'Mon parcours' }} eyebrow="Votre date" tone="lime" title="Vos disponibilités sont transmises" description={`${cdpName} va confirmer l’une de vos dates très vite. Vous serez prévenu·e dans votre espace.`} />
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <ul className="card divide-y divide-navy/[0.07]">
            {p.slot.counter.map((o, i) => (
              <li key={i} className="flex items-center justify-between px-6 py-4">
                <span className="text-[15px] font-semibold first-letter:uppercase">{fmtDate(o.date)}</span>
                <span className="tabular font-mono text-[13.5px] text-navy/55">{fmtTime(o.time)}</span>
              </li>
            ))}
          </ul>
          <ButtonLink href="/participant" variant="ghost" className="mt-6">
            Revenir à mon parcours
          </ButtonLink>
        </div>
      </>
    )

  /* ---------- Pas encore de créneaux ---------- */
  if (p.slot.status === 'todo')
    return (
      <>
        <PageHeader back={{ href: '/participant', label: 'Mon parcours' }} eyebrow="Votre date" tone="lime" title="Des créneaux arrivent" description={`${cdpName} vous proposera très prochainement plusieurs dates pour votre journée. Vous pourrez choisir ici celle qui vous convient.`} />
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="card p-6 text-[14.5px] leading-relaxed text-navy/65">
            Pour vous organiser : comptez environ {fmtDuration(total)} d’exercices, à partir de {fmtTime(project.startTime)}. {venueLabel(project)}.
          </div>
        </div>
      </>
    )

  /* ---------- Choix parmi les créneaux proposés ---------- */
  const validOwn = own.some((o) => o.date && o.time) && own.every((o) => (!o.date && !o.time) || (o.date && o.time))

  return (
    <>
      <PageHeader
        back={{ href: '/participant', label: 'Mon parcours' }}
        eyebrow="Votre date"
        tone="lime"
        title="Choisissez la date de votre journée"
        description={`Comptez environ ${fmtDuration(total)} d’exercices, plus les transitions. ${venueLabel(project)}.`}
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {!proposing ? (
          <>
            <ul className="space-y-3" role="radiogroup" aria-label="Créneaux proposés">
              {p.slot.proposals.map((o, i) => (
                <li key={i}>
                  <button
                    role="radio"
                    aria-checked={picked === i}
                    onClick={() => setPicked(i)}
                    className={cx(
                      'flex w-full items-center gap-5 rounded-3xl border p-5 text-left transition-colors sm:p-6',
                      picked === i ? 'border-navy bg-navy text-white' : 'border-navy/10 bg-white hover:border-lime-dark',
                    )}
                  >
                    <span className={cx('stadium flex h-12 w-12 shrink-0 items-center justify-center', picked === i ? 'bg-lime text-navy' : 'bg-lime-pale text-lime-dark')}>
                      {picked === i ? <Check size={20} strokeWidth={2.5} /> : <CalendarDays size={20} />}
                    </span>
                    <span className="flex-1">
                      <span className="block font-heading text-[19px] font-medium first-letter:uppercase">{fmtDate(o.date)}</span>
                      <span className={cx('tabular block font-mono text-[13.5px]', picked === i ? 'text-white/65' : 'text-navy/55')}>
                        {fmtTime(o.time)} à {fmtTime(endTime(project, o.time))}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button onClick={() => setProposing(true)} className="text-[14px] text-navy/60 hover:text-navy hover:underline">
                Aucun créneau ne me convient
              </button>
              <Button
                variant="lime"
                size="lg"
                disabled={picked === null}
                onClick={() => picked !== null && update(confirmSlotPatch(project, p, p.slot.proposals[picked]))}
              >
                Confirmer cette date <ArrowRight size={16} />
              </Button>
            </div>
          </>
        ) : (
          <div className="card p-6 sm:p-8">
            <p className="eyebrow eyebrow--peach">Vos disponibilités</p>
            <h2 className="dot mt-2 text-[24px] font-medium leading-tight">Proposez jusqu’à trois options</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-navy/60">{cdpName} confirmera celle qui fonctionne pour l’équipe d’assesseurs.</p>
            <ul className="mt-6 space-y-2.5">
              {own.map((o, i) => (
                <li key={i} className="flex items-center gap-2">
                  <input type="date" aria-label={`Date ${i + 1}`} className="field" value={o.date} onChange={(e) => setOwn(own.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))} />
                  <input type="time" aria-label={`Heure ${i + 1}`} className="field !w-32" value={o.time} onChange={(e) => setOwn(own.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)))} />
                  <button onClick={() => setOwn(own.filter((_, j) => j !== i))} disabled={own.length === 1} aria-label="Retirer" className="stadium p-2 text-navy/40 hover:bg-peach-pale hover:text-peach-dark disabled:opacity-25">
                    <Trash size={14} />
                  </button>
                </li>
              ))}
            </ul>
            {own.length < 3 && (
              <button onClick={() => setOwn([...own, { date: '', time: '' }])} className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-teal-dark hover:underline">
                <Plus size={14} /> Ajouter une option
              </button>
            )}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <button onClick={() => setProposing(false)} className="text-[14px] text-navy/60 hover:text-navy hover:underline">
                Revoir les créneaux proposés
              </button>
              <Button
                disabled={!validOwn}
                onClick={() =>
                  update({ slot: { ...p.slot, status: 'counter', counter: own.filter((o) => o.date && o.time).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)) } })
                }
              >
                <Send size={14} /> Envoyer mes disponibilités
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
