'use client'

import Link from 'next/link'
import { useState } from 'react'

type SessionStatus = 'upcoming' | 'in-progress' | 'completed'

interface Session {
  id: string
  projectName: string
  position: string
  candidateName: string
  startTime: string
  status: SessionStatus
  exerciseCount: number
  notesProgress: number
}

export default function AssessorDashboard() {
  const [filter, setFilter] = useState<SessionStatus | 'all'>('all')

  const sessions: Session[] = [
    {
      id: '1',
      projectName: 'Sanofi',
      position: 'Directeur Opérations',
      candidateName: 'Jean Dupont',
      startTime: '15 avril, 9h00',
      status: 'upcoming',
      exerciseCount: 3,
      notesProgress: 0,
    },
    {
      id: '2',
      projectName: 'Sanofi',
      position: 'Directeur Opérations',
      candidateName: 'Marie Martin',
      startTime: '15 avril, 10h00',
      status: 'upcoming',
      exerciseCount: 3,
      notesProgress: 0,
    },
    {
      id: '3',
      projectName: 'LVMH',
      position: 'Manager Ventes',
      candidateName: 'Pierre Bernard',
      startTime: '22 août, 14h00',
      status: 'upcoming',
      exerciseCount: 2,
      notesProgress: 0,
    },
  ]

  const filteredSessions = sessions.filter((s) => filter === 'all' || s.status === filter)

  const statusConfig = {
    upcoming: { label: 'À venir', color: 'bg-[#eba687]/10 text-[#eba687] border-[#eba687]/20' },
    'in-progress': { label: 'En cours', color: 'bg-[#61a4b0]/10 text-[#61a4b0] border-[#61a4b0]/20' },
    completed: { label: 'Terminé', color: 'bg-[#d1da8f]/10 text-[#d1da8f] border-[#d1da8f]/20' },
  }

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
              <div className="text-xs text-white/50">Lead Assesseur</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button className="text-white/70 hover:text-white transition">👤 Sophie Durand</button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0d1520] mb-2" style={{ fontFamily: 'Jost' }}>
              Mes évaluations
            </h1>
            <p className="text-[#666]">Gérez vos sessions du jour J en temps réel</p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex gap-3">
            {(['all', 'upcoming', 'in-progress', 'completed'] as const).map((status) => {
              const labels = {
                all: 'Tous',
                upcoming: 'À venir',
                'in-progress': 'En cours',
                completed: 'Terminés',
              }
              return (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    filter === status
                      ? 'bg-[#0d1520] text-white'
                      : 'bg-white border border-[#ddd] text-[#0d1520] hover:border-[#d1da8f]'
                  }`}
                >
                  {labels[status]}
                </button>
              )
            })}
          </div>

          {/* Sessions Grid */}
          <div className="space-y-4">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-12 text-[#999]">
                <p className="text-sm">Aucune session dans cette catégorie</p>
              </div>
            ) : (
              filteredSessions.map((session) => {
                const status = statusConfig[session.status]
                return (
                  <Link key={session.id} href={`/assessor/session/${session.id}`}>
                    <div className="group bg-white border border-[#ddd] rounded-lg p-6 hover:border-[#d1da8f] hover:shadow-md transition cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-[#0d1520]">
                            {session.projectName} — {session.position}
                          </h3>
                          <p className="text-sm text-[#666] mt-1">
                            Candidat: <span className="font-semibold">{session.candidateName}</span>
                          </p>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-[#999] mb-1">Date & heure</p>
                          <p className="text-sm font-semibold text-[#0d1520]">{session.startTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#999] mb-1">Exercices</p>
                          <p className="text-sm font-semibold text-[#0d1520]">{session.exerciseCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#999] mb-1">Notes</p>
                          <div className="w-full h-2 bg-[#ddd] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#d1da8f] transition-all"
                              style={{ width: `${session.notesProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <p className="text-xs text-[#0d1520] font-semibold hover:text-[#d1da8f] transition">
                        Accéder à la session →
                      </p>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
