'use client'

import { useState } from 'react'
import { Check, Copy, Info, Paperclip } from 'lucide-react'
import { cx } from '@/components/ui'

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          setTimeout(() => setCopied(false), 1800)
        } catch {
          // presse-papiers indisponible : le texte reste sélectionnable
        }
      }}
      className={cx(
        'stadium inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
        copied ? 'bg-lime text-navy' : 'bg-navy text-white hover:bg-navy-light',
      )}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copié' : label}
    </button>
  )
}

function Step({ n, title, action, children }: { n: number; title: string; action?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="stadium mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center bg-lime-pale font-heading text-[12.5px] font-medium text-navy">{n}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[13.5px] font-semibold">{title}</p>
          {action}
        </div>
        {children && <div className="mt-2">{children}</div>}
      </div>
    </li>
  )
}

/** Mode d'emploi pas à pas : la plateforme n'envoie pas le mail, la CDP le copie dans Outlook. */
export function EmailCopySteps({ to, subject, body, attachment }: { to: string; subject: string; body: string; attachment?: string }) {
  let n = 0
  return (
    <div>
      <p className="flex gap-2.5 rounded-2xl bg-teal-pale px-4 py-3 text-[13px] leading-relaxed text-teal-dark">
        <Info size={16} className="mt-0.5 shrink-0" />
        <span>
          <strong>ATC Journey n’envoie pas ce mail.</strong> Copiez chaque élément et envoyez-le vous-même depuis votre boîte Outlook.
        </span>
      </p>
      <ol className="mt-5 space-y-4">
        <Step n={++n} title="Ouvrez un nouveau mail dans Outlook" />
        <Step n={++n} title="Collez le destinataire" action={<CopyButton text={to} label="Copier l’adresse" />}>
          <p className="select-all truncate rounded-xl bg-cream-warm px-3 py-2 text-[13.5px]">{to}</p>
        </Step>
        <Step n={++n} title="Collez l’objet" action={<CopyButton text={subject} label="Copier l’objet" />}>
          <p className="select-all rounded-xl bg-cream-warm px-3 py-2 text-[13.5px] font-semibold">{subject}</p>
        </Step>
        <Step n={++n} title="Collez le message" action={<CopyButton text={body} label="Copier le message" />}>
          <div className="max-h-[32vh] select-all overflow-y-auto whitespace-pre-line rounded-xl bg-cream-warm px-3 py-2.5 text-[13px] leading-relaxed">{body}</div>
        </Step>
        {attachment && (
          <Step n={++n} title="Ajoutez la pièce jointe">
            <p className="flex items-center gap-2 text-[13px] text-navy/65">
              <Paperclip size={14} /> {attachment}
            </p>
          </Step>
        )}
        <Step n={++n} title="Envoyez depuis Outlook" />
      </ol>
    </div>
  )
}
