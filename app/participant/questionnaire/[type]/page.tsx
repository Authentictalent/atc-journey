'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Check, Send } from 'lucide-react'
import { useMe } from '@/lib/useMe'
import { POST_QUESTIONS, PRE_QUESTIONS } from '@/lib/catalog'
import { Button, EmptyState, PageHeader, cx } from '@/components/ui'

const RATING_LABELS = ['Décevant', 'Moyen', 'Bien', 'Très bien', 'Excellent']

export default function QuestionnairePage() {
  const { type } = useParams<{ type: string }>()
  const router = useRouter()
  const me = useMe()
  const isPre = type === 'pre'
  const [answers, setAnswers] = useState<Record<string, string>>(() => (me ? (isPre ? me.participant.preAnswers : me.participant.postAnswers) : {}))
  if (!me) return null
  const { participant: p, project, w, f, dispatch } = me

  const enabled = isPre ? f.preQuestionnaire : f.postQuestionnaire
  if (!enabled || (type !== 'pre' && type !== 'post'))
    return (
      <div className="mx-auto max-w-3xl px-4 pt-16">
        <EmptyState icon={<Check size={20} />} title="Pas de questionnaire pour ce format">
          Votre parcours ne comprend pas cette étape.
        </EmptyState>
      </div>
    )

  const questions = isPre ? PRE_QUESTIONS : POST_QUESTIONS
  const submitted = isPre ? p.preQuestionnaire === 'done' : p.postQuestionnaire === 'done'
  const complete = questions.every((q) => ('optional' in q && q.optional) || (answers[q.id] ?? '').trim())
  const answered = questions.filter((q) => (answers[q.id] ?? '').trim()).length

  const submit = () => {
    dispatch({
      type: 'updateParticipant',
      id: p.id,
      patch: isPre ? { preQuestionnaire: 'done', preAnswers: answers } : { postQuestionnaire: 'done', postAnswers: answers },
    })
    router.push('/participant')
  }

  return (
    <>
      <PageHeader
        back={{ href: '/participant', label: 'Mon parcours' }}
        eyebrow={`${project.client} · Questionnaire ${isPre ? w.pre : w.post}`}
        tone={isPre ? 'teal' : 'peach'}
        title={isPre ? 'Faisons connaissance' : 'Comment s’est passée votre journée ?'}
        description={
          isPre
            ? 'Vos réponses sont lues par vos assesseurs avant la journée. Écrivez comme vous parleriez : quelques phrases suffisent.'
            : 'Votre retour nous aide à faire de chaque journée une expérience juste et respectueuse. Il reste confidentiel.'
        }
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {submitted && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-lime-pale px-5 py-4 text-[14px]">
            <Check size={16} className="text-lime-dark" /> Questionnaire envoyé. Vous pouvez relire vos réponses.
          </div>
        )}

        <ol className="space-y-5">
          {questions.map((q, i) => (
            <li key={q.id} className="card p-6 sm:p-7">
              <div className="flex gap-4">
                <span className="tabular font-heading text-[15px] font-medium text-navy/30">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex-1">
                  <p className="text-[16px] font-semibold leading-snug">{q.label}</p>
                  {'kind' in q && q.kind === 'rating' ? (
                    <div className="mt-4 flex flex-wrap gap-2" role="radiogroup" aria-label={q.label}>
                      {RATING_LABELS.map((label, idx) => {
                        const value = String(idx + 1)
                        const on = answers[q.id] === value
                        return (
                          <button
                            key={value}
                            role="radio"
                            aria-checked={on}
                            disabled={submitted}
                            onClick={() => setAnswers({ ...answers, [q.id]: value })}
                            className={cx(
                              'stadium px-4 py-2 text-[13.5px] transition-colors disabled:cursor-default',
                              on ? 'bg-navy font-semibold text-lime' : 'bg-white text-navy/65 ring-1 ring-inset ring-navy/12 hover:ring-lime-dark',
                            )}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <textarea
                      className="field mt-4 min-h-28 resize-y leading-relaxed"
                      value={answers[q.id] ?? ''}
                      readOnly={submitted}
                      onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                      placeholder={'optional' in q && q.optional ? 'Facultatif' : 'Votre réponse…'}
                    />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {!submitted && (
          <div className="sticky bottom-4 mt-8 flex items-center justify-between gap-4 rounded-full bg-navy-deep/95 py-2.5 pl-6 pr-2.5 text-white shadow-[0_20px_50px_-20px_rgba(0,26,51,0.6)] backdrop-blur">
            <span className="tabular text-[13.5px] text-white/70">
              {answered} / {questions.length} réponses
            </span>
            <Button variant="lime" onClick={submit} disabled={!complete}>
              <Send size={14} /> Envoyer
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
