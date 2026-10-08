'use client'

import { useState } from 'react'
import { CalendarDays, Check, Clock, MapPin, Pencil, UserRound } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtDuration, fmtTime } from '@/lib/dates'
import { endTime, features, fmtSlot, fullName, isDayDone, isPreDone, PHASE_LABEL, phaseOf, requiredActions, venueLabel } from '@/lib/project'
import { wording } from '@/lib/wording'
import type { Participant, Phase, Project } from '@/lib/types'
import { Button, Dialog, Field, ProgressBar, SectionTitle, cx } from '@/components/ui'

const PHASES: Phase[] = ['pre', 'jour-j', 'restitution', 'clos']

export function OverviewTab({
  project,
  participants,
  onTab,
}: {
  project: Project
  participants: Participant[]
  onTab: (t: 'participants' | 'planning' | 'team') => void
}) {
  const { state, dispatch } = useStore()
  const [editing, setEditing] = useState(false)
  const w = wording(project.purpose)
  const f = features(project)
  const phase = phaseOf(project, participants)
  const actions = requiredActions(project, participants)
  const phaseIndex = PHASES.indexOf(phase)
  const cdp = state.users.find((u) => u.id === project.cdpId)

  const n = participants.length || 1
  const metrics = [
    { label: 'Mails de bienvenue', value: participants.filter((p) => p.welcomeSentAt).length },
    { label: 'Dates confirmées', value: participants.filter((p) => p.slot.status === 'confirmed').length },
    { label: 'Inventaires Hogan', value: participants.filter((p) => p.hogan === 'done').length },
    ...(f.preQuestionnaire ? [{ label: `Questionnaire ${w.pre}`, value: participants.filter((p) => p.preQuestionnaire === 'done').length }] : []),
    { label: w.assessment, value: participants.filter((p) => isDayDone(project, p)).length },
    ...(f.postQuestionnaire ? [{ label: `Questionnaire ${w.post}`, value: participants.filter((p) => p.postQuestionnaire === 'done').length }] : []),
    ...(f.feedback ? [{ label: 'Feedbacks débloqués', value: participants.filter((p) => p.feedback.status === 'unlocked').length }] : []),
  ]
  const dated = [...participants].sort((a, b) => (a.slot.confirmed ? a.slot.confirmed.date + a.slot.confirmed.time : '9999').localeCompare(b.slot.confirmed ? b.slot.confirmed.date + b.slot.confirmed.time : '9999'))

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-8">
        <div className="card p-6 sm:p-7">
          <p className="eyebrow">Phase du dispositif</p>
          <ol className="mt-5 grid grid-cols-4 gap-2">
            {PHASES.map((ph, i) => (
              <li key={ph}>
                <div className={cx('h-1.5 rounded-full', i < phaseIndex ? 'bg-lime-dark' : i === phaseIndex ? 'bg-lime' : 'bg-navy/[0.07]')} />
                <p className={cx('mt-2.5 text-[13px]', i === phaseIndex ? 'font-semibold text-navy' : i < phaseIndex ? 'text-navy/60' : 'text-navy/35')}>{PHASE_LABEL[ph]}</p>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <SectionTitle eyebrow="À traiter" tone="peach" title={actions.length ? `${actions.length} action${actions.length > 1 ? 's' : ''} requise${actions.length > 1 ? 's' : ''}` : 'Rien à signaler'} />
          {actions.length === 0 ? (
            <div className="card flex items-center gap-4 p-5">
              <span className="stadium flex h-10 w-10 items-center justify-center bg-lime-pale text-lime-dark">
                <Check size={18} />
              </span>
              <p className="text-[14px] text-navy/65">Le projet est complet. Les prochaines étapes apparaîtront ici.</p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {actions.map((a) => (
                <li key={a.label} className="card flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <span className="flex items-center gap-3 text-[14.5px] font-medium">
                    <span className={cx('h-2 w-2 rounded-full', a.tone === 'peach' ? 'bg-peach' : 'bg-lime-dark')} />
                    {a.label}
                  </span>
                  {a.target === 'debrief' ? (
                    <Button size="sm" variant="lime" onClick={() => dispatch({ type: 'updateProject', id: project.id, patch: { debriefClientDone: true } })}>
                      Marquer comme réalisé
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => onTab(a.target as 'participants' | 'planning' | 'team')}>
                      Traiter
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <SectionTitle eyebrow="Avancement" title={`Parcours des ${w.participants.toLowerCase()}`} />
          <div className="card divide-y divide-navy/[0.07]">
            {metrics.map((m) => (
              <div key={m.label} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 px-6 py-4 sm:grid-cols-[220px_1fr_auto]">
                <span className="text-[14px] font-medium">{m.label}</span>
                <ProgressBar
                  value={(m.value / n) * 100}
                  tone={m.value === participants.length && participants.length ? 'lime' : 'teal'}
                  className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto"
                />
                <span className="tabular col-start-2 row-start-1 text-[13px] text-navy/55 sm:col-start-auto sm:row-start-auto">
                  {m.value} / {participants.length}
                </span>
              </div>
            ))}
          </div>
          {phase === 'pre' && participants.some((p) => !isPreDone(project, p)) && (
            <p className="mt-3 text-[13px] text-navy/55">
              {participants.filter((p) => !isPreDone(project, p)).length} {w.participant.toLowerCase()}(s) n’ont pas terminé leur {w.pre}.
            </p>
          )}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <p className="eyebrow eyebrow--lime">Organisation</p>
            <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-dark hover:underline">
              <Pencil size={12} /> Modifier
            </button>
          </div>
          <ul className="mt-4 space-y-3.5 text-[14px]">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-navy/40" /> {venueLabel(project)}
            </li>
            <li className="flex items-start gap-3">
              <Clock size={16} className="mt-0.5 shrink-0 text-navy/40" />
              <span>
                Début habituel {fmtTime(project.startTime)}, fin vers {fmtTime(endTime(project))}
                <span className="block text-[12.5px] text-navy/50">{fmtDuration(project.exercises.reduce((s, e) => s + e.duration, 0))} d’exercices</span>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CalendarDays size={16} className="mt-0.5 shrink-0 text-navy/40" /> {project.period || 'Période à préciser'}
            </li>
          </ul>
          <div className="tick-rule my-5" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-navy/45">Dates des {w.participants.toLowerCase()}</p>
          <ul className="mt-3 space-y-2">
            {dated.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 text-[13.5px]">
                <span className="truncate">{fullName(p)}</span>
                <span className={cx('shrink-0 text-[12.5px]', p.slot.status === 'confirmed' ? 'tabular font-semibold' : p.slot.status === 'counter' ? 'font-semibold text-peach-dark' : 'text-navy/45')}>
                  {p.slot.status === 'confirmed' && p.slot.confirmed
                    ? fmtSlot(p.slot.confirmed)
                    : p.slot.status === 'proposed'
                      ? 'Créneaux envoyés'
                      : p.slot.status === 'counter'
                        ? 'Contre-proposition'
                        : 'À proposer'}
                </span>
              </li>
            ))}
            {!participants.length && <li className="text-[13px] text-navy/50">Aucun {w.participant.toLowerCase()} pour l’instant.</li>}
          </ul>
        </div>

        <div className="card p-6">
          <p className="eyebrow eyebrow--peach">Commanditaire</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="stadium flex h-10 w-10 items-center justify-center bg-peach-pale text-peach-dark">
              <UserRound size={18} />
            </span>
            <div className="min-w-0">
              <p className="font-semibold">{project.sponsorName || 'Non renseigné'}</p>
              {project.sponsorTitle && <p className="text-[13px] text-navy/55">{project.sponsorTitle}</p>}
              {project.sponsorEmail && <p className="truncate text-[12.5px] text-navy/45">{project.sponsorEmail}</p>}
            </div>
          </div>
          <div className="tick-rule my-5" />
          <div className="flex items-center justify-between text-[13.5px]">
            <span className="text-navy/60">Debrief client</span>
            {project.debriefClientDone ? (
              <span className="flex items-center gap-1.5 font-semibold text-lime-dark">
                <Check size={14} /> Réalisé
              </span>
            ) : (
              <span className="text-navy/45">Après les journées</span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between text-[13.5px]">
            <span className="text-navy/60">Cheffe de projet</span>
            <span className="font-semibold">{cdp?.name ?? 'À définir'}</span>
          </div>
        </div>
      </aside>

      {editing && <SettingsDialog project={project} onClose={() => setEditing(false)} />}
    </div>
  )
}

function SettingsDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const { state, dispatch } = useStore()
  const isAdmin = state.session?.role === 'admin'
  const [form, setForm] = useState({
    venue: project.venue,
    startTime: project.startTime,
    period: project.period,
    sponsorName: project.sponsorName,
    sponsorTitle: project.sponsorTitle,
    sponsorEmail: project.sponsorEmail,
    cdpId: project.cdpId,
  })

  return (
    <Dialog open onClose={onClose} eyebrow={project.client} title="Organisation du projet">
      <div className="grid gap-4 sm:grid-cols-2">
        <VenueFields value={form.venue} onChange={(venue) => setForm({ ...form, venue })} />
        <Field label="Heure de début habituelle" hint="Chaque candidat peut avoir sa propre heure.">
          <input type="time" className="field" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
        </Field>
        <Field label="Période envisagée">
          <input className="field" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} placeholder="Ex. novembre 2026" />
        </Field>
        <Field label="Commanditaire">
          <input className="field" value={form.sponsorName} onChange={(e) => setForm({ ...form, sponsorName: e.target.value })} />
        </Field>
        <Field label="Fonction">
          <input className="field" value={form.sponsorTitle} onChange={(e) => setForm({ ...form, sponsorTitle: e.target.value })} />
        </Field>
        <Field label="Email du commanditaire" className="sm:col-span-2" hint="Lui ouvre l’accès à la vue de suivi.">
          <input type="email" className="field" value={form.sponsorEmail} onChange={(e) => setForm({ ...form, sponsorEmail: e.target.value })} />
        </Field>
        {isAdmin && (
          <Field label="Cheffe de projet" className="sm:col-span-2">
            <select className="field" value={form.cdpId} onChange={(e) => setForm({ ...form, cdpId: e.target.value })}>
              {state.users
                .filter((u) => u.role === 'cdp' && u.active)
                .map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
            </select>
          </Field>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Annuler
        </Button>
        <Button
          onClick={() => {
            dispatch({ type: 'updateProject', id: project.id, patch: { ...form, startTime: form.startTime || project.startTime } })
            onClose()
          }}
        >
          Enregistrer
        </Button>
      </div>
    </Dialog>
  )
}

export function VenueFields({ value, onChange }: { value: Project['venue']; onChange: (v: Project['venue']) => void }) {
  return (
    <>
      <Field
        label="Lieu"
        className={value.mode === 'teams' ? 'sm:col-span-2' : ''}
        hint={value.mode === 'teams' ? 'Un lien Teams est créé automatiquement pour chaque candidat, dès que sa date est confirmée.' : undefined}
      >
        <select className="field" value={value.mode} onChange={(e) => onChange({ ...value, mode: e.target.value as Project['venue']['mode'] })}>
          <option value="teams">Distanciel · Microsoft Teams</option>
          <option value="site">Présentiel</option>
        </select>
      </Field>
      {value.mode === 'site' ? (
        <Field label="Adresse" hint="Facultatif : laissez vide si elle est encore à définir.">
          <input className="field" value={value.address} onChange={(e) => onChange({ ...value, address: e.target.value })} placeholder="À définir" />
        </Field>
      ) : null}
    </>
  )
}
