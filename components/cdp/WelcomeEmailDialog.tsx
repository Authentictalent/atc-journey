'use client'

import { Check } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtDate, todayISO } from '@/lib/dates'
import { welcomeEmail } from '@/lib/welcome-email'
import type { Participant, Project } from '@/lib/types'
import { Button, Dialog, Pill } from '@/components/ui'
import { EmailCopySteps } from './EmailCopy'

export function WelcomeEmailDialog({ project, participant, onClose }: { project: Project; participant: Participant | null; onClose: () => void }) {
  const { state, dispatch } = useStore()
  if (!participant) return null

  const cdp = state.users.find((u) => u.id === project.cdpId)
  const { subject, body } = welcomeEmail(project, participant, cdp, typeof window === 'undefined' ? '' : window.location.origin)

  return (
    <Dialog open onClose={onClose} eyebrow={`${participant.firstName} ${participant.lastName}`} title="Mail de bienvenue à envoyer">
      {participant.slot.status === 'todo' && (
        <p className="mb-4 rounded-2xl bg-peach-pale px-4 py-3 text-[13px] leading-relaxed text-peach-dark">
          Conseil : proposez d’abord des créneaux à {participant.firstName}, pour qu’il ou elle puisse choisir sa date dès sa première connexion.
        </p>
      )}
      <EmailCopySteps to={participant.email} subject={subject} body={body} attachment={`L’invitation Hogan de ${participant.firstName}`} />
      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-navy/[0.07] pt-5">
        {participant.welcomeSentAt ? (
          <Pill tone="lime" dot>
            Envoyé le {fmtDate(participant.welcomeSentAt, false)}
          </Pill>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose}>
              Plus tard
            </Button>
            <Button
              variant="lime"
              onClick={() => {
                dispatch({ type: 'updateParticipant', id: participant.id, patch: { welcomeSentAt: todayISO() } })
                onClose()
              }}
            >
              <Check size={14} /> C’est envoyé depuis Outlook
            </Button>
          </>
        )}
      </div>
    </Dialog>
  )
}
