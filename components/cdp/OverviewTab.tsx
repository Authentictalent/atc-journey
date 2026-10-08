'use client'

import { useState } from 'react'
import { CalendarDays, Check, Clock, MapPin, Pencil, UserRound } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtDuration, fmtTime } from '@/lib/dates'
import { endTime, requiredActions, venueLabel } from '@/lib/project'
import type { Participant, Project } from '@/lib/types'
import { Button, Dialog, Field, SectionTitle, cx } from '@/components/ui'

export function OverviewTab({
  project,
  participants,
  onTab,
}: {
  project: Project
  participants: Participant[]
  onTab: (t: 'participants' | 'planning' | 'team') => void
}) {
  const { dispatch } = useStore()
  const [editing, setEditing] = useState(false)
  const actions = requiredActions(project, participants)

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-8">
        <div>
          <SectionTitle eyebrow="À faire" tone="peach" title={actions.length ? `${actions.length} action${actions.length > 1 ? 's' : ''}` : 'Rien à faire'} />
          {actions.length === 0 ? (
            <div className="card flex items-center gap-4 p-5">
              <span className="stadium flex h-10 w-10 items-center justify-center bg-lime-pale text-lime-dark">
                <Check size={18} />
              </span>
              <p className="text-[14px] text-navy/65">Tout est en ordre. Les prochaines étapes apparaîtront ici.</p>
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
            <li className="flex items-start gap-3">
              <UserRound size={16} className="mt-0.5 shrink-0 text-navy/40" />
              <span>
                {project.sponsorName || 'Commanditaire à renseigner'}
                {project.sponsorTitle && <span className="block text-[12.5px] text-navy/50">{project.sponsorTitle}</span>}
              </span>
            </li>
          </ul>
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
