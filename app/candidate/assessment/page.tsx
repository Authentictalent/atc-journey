'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/app/components/Card'
import { Button } from '@/app/components/UI'

const exercises = [
  { id: 1, type: 'CBI', name: 'Entretien Structuré', duration: 45, startTime: '09:00', teamsLink: true },
  { id: 2, type: 'CASE_STUDY', name: 'Étude de Cas', duration: 90, startTime: '09:50', teamsLink: false },
  { id: 3, type: 'PRESENTATION', name: 'Présentation Stratégique', duration: 25, startTime: '11:20', teamsLink: true },
  { id: 4, type: 'BREAK', name: '☕ Pause Déjeuner', duration: 60, startTime: '11:50', teamsLink: false },
]

export default function AssessmentPage() {
  const [currentTime, setCurrentTime] = useState<string>('09:00')
  const [activeExerciseId, setActiveExerciseId] = useState<number | null>(1)
  const [countdown, setCountdown] = useState<number>(45 * 60) // 45 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const currentExercise = exercises.find(e => e.id === activeExerciseId)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Ton Assessment Center</h1>
          <p className="text-text-secondary">Mercredi 15 avril, 9h00-12h00</p>
        </div>

        {/* Active Exercise */}
        {currentExercise && (
          <Card className="mb-8 bg-gradient-to-r from-navy/5 to-teal/5 border-navy/20">
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <p className="text-sm text-text-secondary mb-2">Exercice actuel</p>
                <h2 className="text-2xl font-bold text-navy">{currentExercise.name}</h2>
                <p className="text-sm text-text-secondary mt-2">{currentExercise.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-secondary mb-2">Temps restant</p>
                <div className="text-5xl font-bold text-teal font-mono">{formatTime(countdown)}</div>
              </div>
            </div>

            {currentExercise.teamsLink && (
              <Button variant="primary" className="w-full mb-4">
                🎥 Accéder à Teams
              </Button>
            )}

            <p className="text-sm text-text-secondary">
              ✓ Tu peux revenir à tout moment
              <br />
              ✓ Reste concentré et sois toi-même
              <br />
              ✓ L'équipe t'observe pour mieux te connaître
            </p>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mb-8 bg-lime/5 border-lime/20">
          <h3 className="font-bold text-navy mb-4">📋 Consignes</h3>
          <p className="text-sm text-text-secondary">
            L'objectif principal est de mieux te connaître. Il n'y a pas de bonne ou mauvaise réponse.
            Reste toi-même, sois concentré, et profite de cette opportunité pour montrer qui tu es.
          </p>
        </Card>

        {/* Timeline */}
        <Card>
          <h3 className="font-bold text-navy mb-6">⏱️ Planning du jour</h3>
          <div className="space-y-4">
            {exercises.map((exercise, idx) => (
              <div
                key={exercise.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  activeExerciseId === exercise.id
                    ? 'bg-teal/10 border-teal/50 shadow-md'
                    : 'bg-card-bg border-border-color hover:border-teal/30'
                }`}
                onClick={() => setActiveExerciseId(exercise.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-navy">{exercise.name}</p>
                    <p className="text-sm text-text-secondary mt-1">
                      {exercise.startTime} • {exercise.duration} min
                    </p>
                  </div>
                  <span className="text-2xl">
                    {exercise.type === 'CBI' && '🎤'}
                    {exercise.type === 'CASE_STUDY' && '📊'}
                    {exercise.type === 'PRESENTATION' && '📈'}
                    {exercise.type === 'BREAK' && '☕'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Help */}
        <div className="mt-8 p-4 rounded-lg bg-salmon/5 border border-salmon/20 text-center">
          <p className="text-sm text-text-secondary">
            ❓ Besoin d'aide technique ? contact@authentictalent.fr
          </p>
        </div>
      </div>
    </div>
  )
}
