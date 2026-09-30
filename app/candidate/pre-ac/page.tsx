'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PreACPage() {
  const [hoganDone, setHoganDone] = useState(false)
  const [questionnaireDone, setQuestionnaireDone] = useState(false)

  const candidateName = 'Jean Dupont'
  const projectName = 'Sanofi - Directeur Opérations'
  const acDate = '15 avril, 9h-12h'

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
              <div className="text-xs text-white/50">Pré-Assessment</div>
            </div>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 md:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0d1520] mb-2" style={{ fontFamily: 'Jost' }}>
              Bienvenue, {candidateName} 👋
            </h1>
            <p className="text-[#666]">
              {projectName} • Jour J: {acDate}
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-white border border-[#ddd] rounded-lg p-6 mb-8">
            <h2 className="font-bold text-[#0d1520] mb-4">📋 Votre parcours pré-AC</h2>
            <div className="space-y-4">
              {/* Hogan */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#f5f5f0] border border-[#ddd]">
                <div>
                  <p className="font-semibold text-[#0d1520]">1. Questionnaire Hogan</p>
                  <p className="text-sm text-[#666] mt-1">15 min • Test de personnalité</p>
                </div>
                {hoganDone ? (
                  <span className="text-2xl">✅</span>
                ) : (
                  <button
                    onClick={() => setHoganDone(true)}
                    className="bg-[#d1da8f] text-[#0d1520] px-4 py-2 rounded-full font-semibold text-sm hover:bg-[#c5cc7a] transition"
                  >
                    Accéder
                  </button>
                )}
              </div>

              {/* Questionnaire Pré-AC */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#f5f5f0] border border-[#ddd]">
                <div>
                  <p className="font-semibold text-[#0d1520]">2. Questionnaire Pré-AC</p>
                  <p className="text-sm text-[#666] mt-1">5 min • Questions contexte</p>
                </div>
                {questionnaireDone ? (
                  <span className="text-2xl">✅</span>
                ) : (
                  <button
                    onClick={() => setQuestionnaireDone(true)}
                    disabled={!hoganDone}
                    className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                      hoganDone
                        ? 'bg-[#d1da8f] text-[#0d1520] hover:bg-[#c5cc7a]'
                        : 'bg-[#ddd] text-[#999] cursor-not-allowed'
                    }`}
                  >
                    Accéder
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Readiness */}
          <div className="bg-white border border-[#ddd] rounded-lg p-6 mb-8">
            <h2 className="font-bold text-[#0d1520] mb-4">✨ Êtes-vous prêt(e) ?</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className={hoganDone ? '✅' : '⏳'}>  </span>
                <span className="text-[#666]">Questionnaire Hogan complété</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={questionnaireDone ? '✅' : '⏳'}>  </span>
                <span className="text-[#666]">Questionnaire Pré-AC complété</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          {hoganDone && questionnaireDone && (
            <Link href="/candidate/ac-day">
              <button className="w-full bg-[#0d1520] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#1a2538] transition">
                Accéder au Jour J →
              </button>
            </Link>
          )}

          {/* Info */}
          <div className="mt-8 p-4 rounded-lg bg-[#61a4b0]/10 border border-[#61a4b0]/20">
            <p className="text-xs text-[#666]">
              💡 Les résultats du test Hogan vous seront restitués après l'assessment. Vos réponses au questionnaire Pré-AC nous aideront à adapter votre parcours du jour.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
