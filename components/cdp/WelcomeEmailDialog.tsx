'use client'

import { useState } from 'react'
import { Check, Copy, Send } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtDate, todayISO } from '@/lib/dates'
import { welcomeEmail } from '@/lib/welcome-email'
import type { Participant, Project } from '@/lib/types'
import { Button, Dialog, Pill } from '@/components/ui'

export function WelcomeEmailDialog({ project, participant, onClose }: { project: Project; participant: Participant | null; onClose: () => void }) {
  const { state, dispatch } = useStore()
  const [copied, setCopied] = useState<'subject' | 'body' | null>(null)
  if (!participant) return null

  const cdp = state.users.find((u) => u.id === project.cdpId)
  const { subject, body } = welcomeEmail(project, participant, cdp, typeof window === 'undefined' ? '' : window.location.origin)

  const copy = async (what: 'subject' | 'body') => {
    try {
      await navigator.clipboard.writeText(what === 'subject' ? subject : body)
      setCopied(what)
      setTimeout(() => setCopied(null), 1800)
    } catch {
      // presse-papiers indisponible : le texte reste sélectionnable
    }
  }

  return (
    <Dialog open onClose={onClose} eyebrow={`À ${participant.email}`} title="Mail de bienvenue">
      <div className="space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-navy/45">Objet</span>
            <button onClick={() => copy('subject')} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-dark hover:underline">
              {copied === 'subject' ? <Check size={13} /> : <Copy size={13} />} {copied === 'subject' ? 'Copié' : 'Copier l’objet'}
            </button>
          </div>
          <p className="select-all rounded-2xl bg-cream-warm px-4 py-3 text-[14px] font-semibold">{subject}</p>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-navy/45">Message</span>
            <button onClick={() => copy('body')} className="flex items-center gap-1.5 text-[12.5px] font-semibold text-teal-dark hover:underline">
              {copied === 'body' ? <Check size={13} /> : <Copy size={13} />} {copied === 'body' ? 'Copié' : 'Copier le message'}
            </button>
          </div>
          <div className="max-h-[42vh] select-all overflow-y-auto whitespace-pre-line rounded-2xl bg-cream-warm px-4 py-3 text-[13.5px] leading-relaxed">{body}</div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12.5px] text-navy/50">Collez l’objet et le message dans Outlook, puis envoyez.</p>
        {participant.welcomeSentAt ? (
          <Pill tone="lime" dot>
            Envoyé le {fmtDate(participant.welcomeSentAt, false)}
          </Pill>
        ) : (
          <Button
            variant="lime"
            onClick={() => {
              dispatch({ type: 'updateParticipant', id: participant.id, patch: { welcomeSentAt: todayISO() } })
              onClose()
            }}
          >
            <Send size={14} /> Marquer comme envoyé
          </Button>
        )}
      </div>
    </Dialog>
  )
}
