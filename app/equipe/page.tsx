'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { uid, useStore } from '@/lib/store'
import type { StaffRole } from '@/lib/types'
import { Avatar, Button, Dialog, Field, PageHeader, Pill, Stat, cx } from '@/components/ui'

type AccountRole = StaffRole | 'assessor'

const ROLE_LABEL: Record<AccountRole, string> = { admin: 'Admin', cdp: 'Cheffe de projet', assessor: 'Assesseur' }

interface Row {
  id: string
  kind: 'user' | 'assessor'
  name: string
  email: string
  title: string
  role: AccountRole
  active: boolean
  projects: number
}

export default function TeamPage() {
  const { state, dispatch } = useStore()
  const [creating, setCreating] = useState(false)
  const myId = state.session?.userId

  const rows: Row[] = [
    ...state.users.map((u) => ({
      id: u.id,
      kind: 'user' as const,
      name: u.name,
      email: u.email,
      title: u.title,
      role: u.role,
      active: u.active,
      projects: state.projects.filter((p) => p.cdpId === u.id).length,
    })),
    ...state.assessors.map((a) => ({
      id: a.id,
      kind: 'assessor' as const,
      name: a.name,
      email: a.email,
      title: a.title,
      role: 'assessor' as const,
      active: a.active,
      projects: state.projects.filter((p) => p.leadAssessorId === a.id || p.secondAssessorIds.includes(a.id)).length,
    })),
  ]

  const toggle = (r: Row) =>
    r.kind === 'user'
      ? dispatch({ type: 'updateUser', id: r.id, patch: { active: !r.active } })
      : dispatch({ type: 'updateAssessor', id: r.id, patch: { active: !r.active } })

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        tone="peach"
        title="Équipe & accès"
        description="Les comptes de l’équipe ATC. Les candidats et commanditaires reçoivent leur accès depuis chaque projet."
        actions={
          <Button variant="lime" onClick={() => setCreating(true)}>
            <UserPlus size={16} /> Créer un compte
          </Button>
        }
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Stat label="Admins" value={rows.filter((r) => r.role === 'admin' && r.active).length} />
          <Stat label="Cheffes de projet" value={rows.filter((r) => r.role === 'cdp' && r.active).length} />
          <Stat label="Assesseurs" value={rows.filter((r) => r.role === 'assessor' && r.active).length} />
          <Stat label="Accès désactivés" value={rows.filter((r) => !r.active).length} tone={rows.some((r) => !r.active) ? 'peach' : undefined} />
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead>
              <tr className="border-b border-navy/[0.07] text-[11px] font-semibold uppercase tracking-wider text-navy/45">
                <th className="px-6 py-4 font-semibold">Personne</th>
                <th className="px-3 py-4 font-semibold">Rôle</th>
                <th className="px-3 py-4 font-semibold">Projets</th>
                <th className="px-3 py-4 font-semibold">Accès</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/[0.06]">
              {rows.map((r) => (
                <tr key={r.id} className={cx(!r.active && 'opacity-55')}>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-3">
                      <Avatar name={r.name} size={36} tone={r.role === 'admin' ? 'navy' : r.role === 'cdp' ? 'lime' : 'teal'} />
                      <span className="min-w-0">
                        <span className="block text-[14.5px] font-semibold">
                          {r.name} {r.id === myId && <span className="text-[12px] font-normal text-navy/45">(vous)</span>}
                        </span>
                        <span className="block truncate text-[12.5px] text-navy/50">
                          {r.title} · {r.email}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    {r.kind === 'user' ? (
                      <select
                        aria-label={`Rôle de ${r.name}`}
                        value={r.role}
                        disabled={r.id === myId}
                        onChange={(e) => dispatch({ type: 'updateUser', id: r.id, patch: { role: e.target.value as StaffRole } })}
                        className="field !w-auto !rounded-full !py-1.5 !text-[13px] disabled:opacity-60"
                      >
                        <option value="admin">Admin</option>
                        <option value="cdp">Cheffe de projet</option>
                      </select>
                    ) : (
                      <Pill tone="teal">Assesseur</Pill>
                    )}
                  </td>
                  <td className="tabular px-3 py-4 text-[14px]">{r.projects}</td>
                  <td className="px-3 py-4">
                    {r.id === myId ? (
                      <Pill tone="lime" dot>
                        Actif
                      </Pill>
                    ) : (
                      <button
                        onClick={() => toggle(r)}
                        aria-pressed={r.active}
                        className={cx(
                          'stadium inline-flex items-center gap-2 px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
                          r.active ? 'bg-lime-pale text-navy hover:bg-peach-pale hover:text-peach-dark' : 'bg-navy/[0.06] text-navy/60 hover:bg-lime-pale hover:text-navy',
                        )}
                        title={r.active ? 'Désactiver l’accès' : 'Réactiver l’accès'}
                      >
                        <span className={cx('h-1.5 w-1.5 rounded-full', r.active ? 'bg-lime-dark' : 'bg-navy/30')} />
                        {r.active ? 'Actif' : 'Désactivé'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[13px] text-navy/50">Un accès désactivé ne peut plus se connecter. Ses projets et ses notes restent intacts.</p>
      </div>

      {creating && <CreateAccountDialog onClose={() => setCreating(false)} />}
    </>
  )
}

function CreateAccountDialog({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useStore()
  const [form, setForm] = useState({ name: '', email: '', title: '', role: 'cdp' as AccountRole })
  const email = form.email.trim().toLowerCase()
  const taken = [...state.users, ...state.assessors].some((a) => a.email.toLowerCase() === email)
  const valid = form.name.trim() && /\S+@\S+\.\S+/.test(email) && !taken

  const submit = () => {
    if (!valid) return
    const base = { name: form.name.trim(), email, title: form.title.trim() || ROLE_LABEL[form.role], active: true }
    if (form.role === 'assessor') dispatch({ type: 'addAssessor', assessor: { id: uid('a'), ...base } })
    else dispatch({ type: 'addUser', user: { id: uid('u'), ...base, role: form.role } })
    onClose()
  }

  return (
    <Dialog open onClose={onClose} eyebrow="Administration" title="Créer un compte">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Prénom et nom" className="sm:col-span-2">
          <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
        </Field>
        <Field label="Email professionnel" className="sm:col-span-2" hint={taken ? 'Un compte existe déjà avec cet email.' : undefined}>
          <input type="email" className={cx('field', taken && '!border-peach')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="prenom.nom@authentictalent.fr" />
        </Field>
        <Field label="Rôle">
          <select className="field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AccountRole })}>
            <option value="cdp">Cheffe de projet</option>
            <option value="assessor">Assesseur</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        <Field label="Fonction">
          <input className="field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder={ROLE_LABEL[form.role]} />
        </Field>
      </div>
      <p className="mt-4 text-[12.5px] leading-relaxed text-navy/50">
        {form.role === 'admin'
          ? 'Un admin voit et modifie tous les projets, et gère les comptes.'
          : form.role === 'cdp'
            ? 'Une cheffe de projet crée et pilote ses projets, et peut consulter ceux de ses collègues.'
            : 'Un assesseur voit les sessions des projets auxquels il est affecté.'}
      </p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Annuler
        </Button>
        <Button onClick={submit} disabled={!valid}>
          Créer le compte
        </Button>
      </div>
    </Dialog>
  )
}
