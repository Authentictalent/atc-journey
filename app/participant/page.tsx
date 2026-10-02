'use client'

import { useState } from 'react'
import { ArrowRight, Check, Clock, ExternalLink, FileText, Mail, MapPin, Sparkles, Video } from 'lucide-react'
import { useMe } from '@/lib/useMe'
import { DEMO_CDP } from '@/lib/seed'
import { daysBetween, fmtDate, fmtTime, todayISO } from '@/lib/dates'
import { journey } from '@/lib/project'
import { JourneyTrack } from '@/components/JourneyTrack'
import { Button, ButtonLink, Dialog, SectionTitle, cx } from '@/components/ui'

export default function ParticipantHome() {
  const me = useMe()
  const [hoganOpen, setHoganOpen] = useState(false)
  if (!me) return null
  const { participant: p, project, w, f, dispatch } = me

  const steps = journey(project, p)
  const current = steps.find((s) => s.state === 'current')
  const daysToGo = daysBetween(todayISO(), project.date)

  const next = (() => {
    switch (current?.key) {
      case 'hogan':
        return { eyebrow: 'Votre prochaine étape', title: 'Compléter vos inventaires Hogan', text: 'Trois questionnaires de personnalité, à faire en une ou plusieurs fois. Comptez 45 à 60 minutes.', cta: { label: 'Accéder à Hogan', onClick: () => setHoganOpen(true) } }
      case 'pre':
        return { eyebrow: 'Votre prochaine étape', title: `Répondre au questionnaire ${w.pre}`, text: 'Quelques questions sur votre parcours et vos attentes, pour préparer au mieux votre journée. Environ 20 minutes.', cta: { label: 'Commencer', href: '/participant/questionnaire/pre' } }
      case 'day':
        return daysToGo > 0
          ? { eyebrow: `Dans ${daysToGo} jour${daysToGo > 1 ? 's' : ''}`, title: 'Votre journée se prépare', text: `Votre ${w.pre} est complète, merci. Le programme de la journée vous sera révélé le matin même.`, cta: { label: 'Voir les infos pratiques', href: '/participant/jour-j' } }
          : { eyebrow: "C'est aujourd'hui", title: `Votre ${w.assessment.toLowerCase()} commence`, text: 'Votre programme est disponible. Chaque mise en situation se dévoile au moment où elle commence.', cta: { label: 'Ouvrir ma journée', href: '/participant/jour-j' } }
      case 'post':
        return { eyebrow: 'Votre retour compte', title: `Partager votre ressenti`, text: 'Cinq questions sur la journée que vous venez de vivre. Deux minutes, à chaud.', cta: { label: 'Donner mon avis', href: '/participant/questionnaire/post' } }
      case 'feedback':
        return { eyebrow: 'Prochaine étape', title: 'Votre feedback se prépare', text: 'Il sera organisé après l’échange entre Authentic Talent et votre entreprise. Vous serez prévenu·e dès que la date est fixée.', cta: null }
      default:
        return f.feedback
          ? { eyebrow: 'Votre feedback est disponible', title: 'Découvrir votre restitution', text: 'La date de votre session et la synthèse de votre parcours sont prêtes.', cta: { label: 'Voir mon feedback', href: '/participant/feedback' } }
          : { eyebrow: 'Parcours terminé', title: 'Merci pour votre engagement', text: 'Votre consultant vous recontactera pour la suite.', cta: null }
    }
  })()

  return (
    <>
      {/* Bandeau d'accueil */}
      <section className="relative overflow-hidden bg-navy-deep text-white">
        <div className="deco-pill hidden border-lime/50 md:block" style={{ width: 210, height: 66, top: 40, right: -70 }} aria-hidden />
        <div className="deco-pill hidden border-teal/45 md:block" style={{ width: 130, height: 44, top: 92, right: 150 }} aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pt-16">
          <p className="eyebrow eyebrow--on-navy rise-in">
            {w.center} · {project.client}
          </p>
          <h1 className="dot dot--bright rise-in mt-3 text-[38px] font-medium leading-[1.06] sm:text-[52px]" style={{ animationDelay: '0.06s' }}>
            Bonjour {p.firstName}
          </h1>
          <p className="rise-in mt-3 max-w-2xl text-[16px] leading-relaxed text-white/65" style={{ animationDelay: '0.12s' }}>
            Voici votre parcours pour l’{w.assessment.toLowerCase()} {project.purpose === 'AC' ? `au poste de ${project.position}` : `« ${project.position} »`}. Vous retrouvez ici chaque étape, à votre rythme.
          </p>
          <div className="rise-in mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8" style={{ animationDelay: '0.18s' }}>
            <JourneyTrack steps={steps} onNavy />
          </div>
        </div>
        <div className="tick-rule tick-rule--navy" />
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 pt-12 sm:px-6">
        {/* Prochaine étape */}
        <div className="card relative overflow-hidden p-7 sm:p-9">
          <div className="deco-pill hidden border-lime/50 sm:block" style={{ width: 150, height: 50, bottom: -18, right: -30 }} aria-hidden />
          <p className="eyebrow eyebrow--lime">{next.eyebrow}</p>
          <h2 className="dot mt-2 text-[28px] font-medium leading-tight sm:text-[32px]">{next.title}</h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-navy/65">{next.text}</p>
          {next.cta &&
            ('href' in next.cta && next.cta.href ? (
              <ButtonLink href={next.cta.href} variant="primary" className="mt-6">
                {next.cta.label} <ArrowRight size={15} />
              </ButtonLink>
            ) : (
              <Button variant="primary" className="mt-6" onClick={'onClick' in next.cta ? next.cta.onClick : undefined}>
                {next.cta.label} <ArrowRight size={15} />
              </Button>
            ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          {/* Pré-assessment */}
          <section>
            <SectionTitle eyebrow={`Votre ${w.pre}`} title="À faire avant la journée" />
            <p className="-mt-2 mb-5 text-[14px] text-navy/55">Dans l’ordre que vous souhaitez. Vos résultats Hogan ne sont pas affichés ici : ils seront partagés lors de votre feedback.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <TaskCard
                done={p.hogan === 'done'}
                icon={<Sparkles size={18} />}
                title="Inventaires Hogan"
                meta="45 à 60 min"
                text="Personnalité, motivations et points de vigilance, en ligne sur la plateforme Hogan."
                action={<Button size="sm" variant={p.hogan === 'done' ? 'ghost' : 'outline'} onClick={() => setHoganOpen(true)}>{p.hogan === 'done' ? 'Revoir l’accès' : 'Accéder à Hogan'}</Button>}
              />
              {f.preQuestionnaire && (
                <TaskCard
                  done={p.preQuestionnaire === 'done'}
                  icon={<FileText size={18} />}
                  title={`Questionnaire ${w.pre}`}
                  meta="20 min"
                  text="Votre parcours, une réussite marquante, vos motivations et vos attentes."
                  action={
                    p.preQuestionnaire === 'done' ? (
                      <ButtonLink href="/participant/questionnaire/pre" size="sm" variant="ghost">
                        Relire mes réponses
                      </ButtonLink>
                    ) : (
                      <ButtonLink href="/participant/questionnaire/pre" size="sm" variant="outline">
                        Répondre
                      </ButtonLink>
                    )
                  }
                />
              )}
            </div>
          </section>

          {/* Infos pratiques */}
          <aside>
            <SectionTitle eyebrow="Infos pratiques" tone="peach" title="Votre journée" />
            <div className="card p-6">
              <p className="font-heading text-[21px] font-medium leading-snug">{fmtDate(project.date)}</p>
              <ul className="mt-4 space-y-3 text-[14px]">
                <li className="flex items-start gap-3">
                  <Clock size={16} className="mt-0.5 text-navy/40" /> Accueil à {fmtTime(project.startTime)}
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 text-navy/40" /> {project.location}
                </li>
                <li className="flex items-start gap-3">
                  <Video size={16} className="mt-0.5 text-navy/40" /> Lien Teams disponible le jour J
                </li>
              </ul>
              <div className="tick-rule my-5" />
              <p className="text-[12.5px] font-semibold uppercase tracking-wider text-navy/45">Votre contact</p>
              <p className="mt-2 text-[14.5px] font-semibold">{DEMO_CDP.name}</p>
              <p className="text-[13px] text-navy/55">{DEMO_CDP.title} · Authentic Talent</p>
              <a href="mailto:contact@authentictalent.fr" className="mt-2 inline-flex items-center gap-1.5 text-[13.5px] text-teal-dark hover:underline">
                <Mail size={14} /> contact@authentictalent.fr
              </a>
            </div>
          </aside>
        </div>
      </div>

      <Dialog open={hoganOpen} onClose={() => setHoganOpen(false)} eyebrow="Inventaires Hogan" title="Votre accès Hogan">
        <p className="text-[14.5px] leading-relaxed text-navy/70">
          Vos inventaires se complètent sur la plateforme sécurisée de Hogan, avec l’identifiant reçu par email. Il n’y a pas de bonne ou de mauvaise réponse : répondez spontanément.
        </p>
        <ul className="mt-5 space-y-2.5 text-[14px]">
          {['HPI · votre personnalité au quotidien', 'HDS · vos réactions sous pression', 'MVPI · vos valeurs et motivations'].map((t) => (
            <li key={t} className="flex items-center gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-lime-dark" /> {t}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap justify-end gap-2">
          <a href="https://www.hoganassessments.com" target="_blank" rel="noreferrer" className="stadium inline-flex items-center gap-2 border border-navy/15 px-5 py-2.5 text-[14px] font-semibold hover:border-lime-dark">
            Ouvrir Hogan <ExternalLink size={14} />
          </a>
          {p.hogan !== 'done' && (
            <Button
              variant="lime"
              onClick={() => {
                dispatch({ type: 'updateParticipant', id: p.id, patch: { hogan: 'done' } })
                setHoganOpen(false)
              }}
            >
              <Check size={15} /> J’ai terminé mes inventaires
            </Button>
          )}
        </div>
      </Dialog>
    </>
  )
}

function TaskCard({ done, icon, title, meta, text, action }: { done: boolean; icon: React.ReactNode; title: string; meta: string; text: string; action: React.ReactNode }) {
  return (
    <div className={cx('card flex flex-col p-6', done && '!bg-cream-warm')}>
      <div className="flex items-center justify-between">
        <span className={cx('stadium flex h-10 w-10 items-center justify-center', done ? 'bg-lime-dark text-white' : 'bg-teal-pale text-teal-dark')}>
          {done ? <Check size={18} strokeWidth={2.5} /> : icon}
        </span>
        <span className={cx('text-[11px] font-semibold uppercase tracking-wider', done ? 'text-lime-dark' : 'text-navy/40')}>{done ? 'Complété' : meta}</span>
      </div>
      <h3 className="mt-4 text-[17px] font-semibold">{title}</h3>
      <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-navy/60">{text}</p>
      <div className="mt-5">{action}</div>
    </div>
  )
}
