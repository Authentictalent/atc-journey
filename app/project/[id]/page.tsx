'use client'

import { useState } from 'react'
import Link from 'next/link'

type ProjectType = 'light' | 'robuste' | 'premium'

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<'overview' | 'candidates' | 'planning'>('overview')

  const project = {
    id: params.id,
    type: 'robuste' as ProjectType,
    clientName: 'Sanofi',
    position: 'Directeur Opérations',
    status: 'active' as const,
    briefDate: '12 avril, 14h',
    acDate: '15 avril, 9h-12h',
    debriefsDate: '15 avril, 15h-16h30',
    location: 'Visio + Teams',
    candidates: 3,
    preAcDone: 2,
    preAcTotal: 3,
    leadAssessor: 'Sophie Durand',
    secondAssessors: ['Jean Martin', 'À assigner'],
  }

  const candidates = [
    { id: 1, name: 'Jean Dupont', status: 'completed', hoganDone: true, questionnaireDone: true },
    { id: 2, name: 'Marie Martin', status: 'completed', hoganDone: true, questionnaireDone: true },
    { id: 3, name: 'Pierre Bernard', status: 'in-progress', hoganDone: false, questionnaireDone: false },
  ]

  const exercises = [
    { id: 1, name: 'Entretien Structuré (CBI)', duration: 45, startTime: '09:00', assignedTo: 'Sophie Durand' },
    { id: 2, name: 'Étude de Cas', duration: 60, startTime: '09:50', assignedTo: 'Jean Martin' },
    { id: 3, name: 'Présentation Stratégique', duration: 25, startTime: '11:00', assignedTo: 'Sophie Durand' },
  ]

  const typeConfig = {
    light: { label: 'AC Light', color: 'bg-blue-100 text-blue-700' },
    robuste: { label: 'AC Robuste', color: 'bg-purple-100 text-purple-700' },
    premium: { label: 'AC Premium', color: 'bg-amber-100 text-amber-700' },
  }

  const statusConfig = {
    active: { label: 'Actif', color: 'bg-teal/10 text-teal border-teal/20' },
    pending: { label: 'En attente', color: 'bg-salmon/10 text-salmon border-salmon/20' },
    completed: { label: 'Complété', color: 'bg-lime/10 text-lime border-lime/20' },
  }

  const type = typeConfig[project.type]
  const status = statusConfig[project.status]

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Header */}
      <header className="bg-[#0d1520] text-white px-6 md:px-8 py-3 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80">
            <div className="w-10 h-10 bg-[#d1da8f] rounded-lg flex items-center justify-center font-bold text-[#0d1520] text-sm">
              ATC
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ fontFamily: 'Jost' }}>
                ATC Journey
              </div>
              <div className="text-xs text-white/50">Make your talent shine</div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <button className="text-white/70 hover:text-white transition text-sm">← Retour</button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Project Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${type.color}`}>
                {type.label}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                {status.label}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0d1520] mb-2" style={{ fontFamily: 'Jost' }}>
              {project.clientName} — {project.position}
            </h1>
            <p className="text-[#666]">📅 {project.acDate} • 📍 {project.location}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-[#ddd] rounded-lg p-4">
              <p className="text-xs text-[#999] mb-1">Candidats</p>
              <p className="text-2xl font-bold text-[#0d1520]">{project.candidates}</p>
            </div>
            <div className="bg-white border border-[#ddd] rounded-lg p-4">
              <p className="text-xs text-[#999] mb-1">Pré-AC</p>
              <p className="text-lg font-bold text-[#0d1520]">{project.preAcDone}/{project.preAcTotal}</p>
            </div>
            <div className="bg-white border border-[#ddd] rounded-lg p-4">
              <p className="text-xs text-[#999] mb-1">Lead</p>
              <p className="text-sm font-semibold text-[#0d1520]">{project.leadAssessor}</p>
            </div>
            <div className="bg-white border border-[#ddd] rounded-lg p-4">
              <p className="text-xs text-[#999] mb-1">Brief</p>
              <p className="text-sm font-semibold text-[#0d1520]">{project.briefDate}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-[#ddd]">
            <div className="flex gap-8">
              <button
                onClick={() => setTab('overview')}
                className={`pb-4 font-semibold text-sm border-b-2 transition ${
                  tab === 'overview'
                    ? 'text-[#0d1520] border-[#0d1520]'
                    : 'text-[#999] border-transparent hover:text-[#0d1520]'
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setTab('candidates')}
                className={`pb-4 font-semibold text-sm border-b-2 transition ${
                  tab === 'candidates'
                    ? 'text-[#0d1520] border-[#0d1520]'
                    : 'text-[#999] border-transparent hover:text-[#0d1520]'
                }`}
              >
                Candidats ({project.candidates})
              </button>
              <button
                onClick={() => setTab('planning')}
                className={`pb-4 font-semibold text-sm border-b-2 transition ${
                  tab === 'planning'
                    ? 'text-[#0d1520] border-[#0d1520]'
                    : 'text-[#999] border-transparent hover:text-[#0d1520]'
                }`}
              >
                Planning
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {/* Overview Tab */}
            {tab === 'overview' && (
              <div className="space-y-6">
                {/* Assessors */}
                <div className="bg-white border border-[#ddd] rounded-lg p-6">
                  <h3 className="font-bold text-[#0d1520] mb-4">👥 Équipe d'évaluation</h3>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-[#61a4b0]/10 border border-[#61a4b0]/20">
                      <p className="font-semibold text-[#0d1520] text-sm">{project.leadAssessor}</p>
                      <p className="text-xs text-[#666]">Lead Assesseur • Confirmé</p>
                    </div>
                    {project.secondAssessors.map((assessor, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg ${
                          assessor === 'À assigner'
                            ? 'bg-[#eba687]/10 border border-[#eba687]/20'
                            : 'bg-[#61a4b0]/10 border border-[#61a4b0]/20'
                        }`}
                      >
                        <p className="font-semibold text-[#0d1520] text-sm">{assessor}</p>
                        <p className="text-xs text-[#666]">Second Assesseur</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Dates */}
                <div className="bg-white border border-[#ddd] rounded-lg p-6">
                  <h3 className="font-bold text-[#0d1520] mb-4">📅 Agenda</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#666]">Brief (Coach + Manager + RH)</span>
                      <span className="font-semibold text-[#0d1520]">{project.briefDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666]">Assessment</span>
                      <span className="font-semibold text-[#0d1520]">{project.acDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#666]">Debriefs Client</span>
                      <span className="font-semibold text-[#0d1520]">{project.debriefsDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Candidates Tab */}
            {tab === 'candidates' && (
              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <Link key={candidate.id} href={`/candidate/${candidate.id}`}>
                    <div className="bg-white border border-[#ddd] rounded-lg p-5 hover:border-[#d1da8f] hover:shadow-md transition cursor-pointer">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-[#0d1520]">{candidate.name}</h4>
                          <p className="text-xs text-[#999] mt-1">
                            Hogan: {candidate.hoganDone ? '✅' : '⏳'} • Questionnaire: {candidate.questionnaireDone ? '✅' : '⏳'}
                          </p>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#61a4b0]/10 text-[#61a4b0]">
                          {candidate.status === 'completed' ? 'Complété' : 'En cours'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Planning Tab */}
            {tab === 'planning' && (
              <div className="space-y-3">
                {exercises.map((exercise) => (
                  <div key={exercise.id} className="bg-white border border-[#ddd] rounded-lg p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-[#0d1520]">{exercise.name}</h4>
                        <p className="text-sm text-[#666] mt-1">
                          {exercise.startTime} • {exercise.duration} min
                        </p>
                        <p className="text-xs text-[#999] mt-2">Assigné à: {exercise.assignedTo}</p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#d1da8f]/20 text-[#999]">
                        Éditer
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
