'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const exercises = [
  { id: 1, type: 'CBI', name: 'Entretien Structuré', duration: 45, startTime: '09:00', teamsLink: true },
  { id: 2, type: 'CASE_STUDY', name: 'Étude de Cas', duration: 60, startTime: '09:50', teamsLink: false },
  { id: 3, type: 'PRESENTATION', name: 'Présentation Stratégique', duration: 25, startTime: '11:00', teamsLink: true },
]

export default function AssessmentPage() {
  const [activeExerciseId, setActiveExerciseId] = useState<number | null>(1)
  const [countdown, setCountdown] = useState<number>(45 * 60)

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
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Header */}
      <header className="bg-[#0d1520] text-white px-6 md:px-8 py-3 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80">
            <div className="w-10 h-10 bg-[#d1da8f] rounded-lg flex items-center justify-center font-bold text-[#0d1520] text-sm">
              ATC
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ fontFamily: 'Jost' }}>
                ATC Journey
              </div>
              <div className="text-xs text-white/50">Jour J</div>
            </div>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0d1520] mb-2" style={{ fontFamily: 'Jost' }}>
              Votre Assessment Center
            </h1>
            <p className="text-[#666]">Mercredi 15 avril, 9h00-12h00</p>
          </div>

          {/* Active Exercise Card */}
          {currentExercise && (
            <div className="bg-white border border-[#ddd] rounded-lg p-8 mb-8">
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-sm text-[#999] mb-2">Exercice actuel</p>
                  <h2 className="text-3xl font-bold text-[#0d1520]">{currentExercise.name}</h2>
                  <p className="text-sm text-[#666] mt-2">{currentExercise.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#999] mb-2">Temps restant</p>
                  <div className="text-5xl font-bold text-[#61a4b0] font-mono">{formatTime(countdown)}</div>
                </div>
              </div>

              {currentExercise.teamsLink && (
                <button className="w-full bg-[#0d1520] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#1a2538] transition mb-4">
                  🎥 Accéder à Teams
                </button>
              )}

              <p className="text-sm text-[#666]">
                ✓ Vous pouvez revenir à tout moment
                <br />
                ✓ Restez concentré et soyez vous-même
                <br />
                ✓ L'équipe vous observe pour mieux vous connaître
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-white border border-[#ddd] rounded-lg p-6 mb-8">
            <h3 className="font-bold text-[#0d1520] mb-4">📋 Consignes</h3>
            <p className="text-sm text-[#666]">
              L'objectif principal est de mieux vous connaître. Il n'y a pas de bonne ou mauvaise réponse. Restez vous-même, soyez concentré, et profitez de cette opportunité pour montrer qui vous êtes.
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-[#ddd] rounded-lg p-6 mb-8">
            <h3 className="font-bold text-[#0d1520] mb-6">⏱️ Planning du jour</h3>
            <div className="space-y-3">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    activeExerciseId === exercise.id
                      ? 'bg-[#61a4b0]/10 border-[#61a4b0]/30 shadow-md'
                      : 'bg-[#f5f5f0] border-[#ddd] hover:border-[#d1da8f]'
                  }`}
                  onClick={() => setActiveExerciseId(exercise.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-[#0d1520]">{exercise.name}</p>
                      <p className="text-sm text-[#666] mt-1">
                        {exercise.startTime} • {exercise.duration} min
                      </p>
                    </div>
                    <span className="text-2xl">
                      {exercise.type === 'CBI' && '🎤'}
                      {exercise.type === 'CASE_STUDY' && '📊'}
                      {exercise.type === 'PRESENTATION' && '📈'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Help */}
          <div className="p-4 rounded-lg bg-[#eba687]/10 border border-[#eba687]/20 text-center">
            <p className="text-sm text-[#666]">
              ❓ Besoin d'aide technique ? contact@authentictalent.fr
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
