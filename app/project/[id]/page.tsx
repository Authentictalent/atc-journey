'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/app/components/Card'
import { Badge, Button, Progress } from '@/app/components/UI'

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<'overview' | 'candidates' | 'schedule'>('overview')

  const project = {
    id: params.id,
    clientName: 'Sanofi',
    position: 'Directeur Opérations',
    status: 'active' as const,
    startDate: '2026-04-08',
    assessmentDate: '2026-04-15',
    location: 'Zoom + MS Teams',
    candidates: 3,
    preAcProgress: { done: 2, total: 3 },
    assessorsStatus: 'Lead OK, Second en attente',
  }

  const candidates = [
    { id: 1, name: 'Jean Dupont', status: 'in-progress', preAcDone: true },
    { id: 2, name: 'Marie Martin', status: 'in-progress', preAcDone: true },
    { id: 3, name: 'Pierre Bernard', status: 'in-progress', preAcDone: false },
  ]

  const exercises = [
    { id: 1, name: 'Entretien Structuré (CBI)', duration: 45, startTime: '09:00' },
    { id: 2, name: 'Étude de Cas', duration: 90, startTime: '09:50' },
    { id: 3, name: 'Présentation Stratégique', duration: 25, startTime: '11:20' },
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-2">
              {project.clientName} — {project.position}
            </h1>
            <p className="text-text-secondary">
              {project.assessmentDate} à {project.location}
            </p>
          </div>
          <Badge status={project.status} />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <p className="text-sm text-text-secondary">Candidats</p>
            <p className="text-3xl font-bold text-navy mt-2">{project.candidates}</p>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary">Pré-AC</p>
            <div className="mt-3">
              <Progress items={[project.preAcProgress]} />
              <p className="text-xs text-text-secondary mt-2">
                {project.preAcProgress.done}/{project.preAcProgress.total} terminés
              </p>
            </div>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary">Assesseurs</p>
            <p className="text-xs text-navy font-medium mt-2">
              {project.assessorsStatus}
            </p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border-color">
          <button
            onClick={() => setTab('overview')}
            className={`px-4 py-3 font-medium transition-all ${
              tab === 'overview'
                ? 'text-navy border-b-2 border-navy'
                : 'text-text-secondary hover:text-navy'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setTab('candidates')}
            className={`px-4 py-3 font-medium transition-all ${
              tab === 'candidates'
                ? 'text-navy border-b-2 border-navy'
                : 'text-text-secondary hover:text-navy'
            }`}
          >
            Candidats ({project.candidates})
          </button>
          <button
            onClick={() => setTab('schedule')}
            className={`px-4 py-3 font-medium transition-all ${
              tab === 'schedule'
                ? 'text-navy border-b-2 border-navy'
                : 'text-text-secondary hover:text-navy'
            }`}
          >
            Planning
          </button>
        </div>

        {/* Tab: Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <h2 className="font-bold text-navy mb-4">🎯 Actions requises</h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-salmon/10 border border-salmon/20">
                  <p className="font-medium text-navy">⚠️ Second assesseur absent</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Assigner un second assesseur pour le 12 avril
                  </p>
                  <Button variant="secondary" className="mt-3 text-xs">
                    Assigner maintenant
                  </Button>
                </div>
                <div className="p-3 rounded-lg bg-lime/10 border border-lime/20">
                  <p className="font-medium text-navy">📋 1 pré-AC en attente</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Pierre Bernard doit compléter son questionnaire
                  </p>
                  <Button variant="secondary" className="mt-3 text-xs">
                    Rappeler le candidat
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="font-bold text-navy mb-4">📝 Notes du projet</h2>
              <textarea
                placeholder="Ajoute des notes sur ce projet..."
                className="w-full px-4 py-3 rounded-lg border border-border-color bg-card-bg text-foreground placeholder-text-secondary"
                rows={4}
              />
              <Button variant="secondary" className="mt-4">
                Sauvegarder
              </Button>
            </Card>
          </div>
        )}

        {/* Tab: Candidates */}
        {tab === 'candidates' && (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <Link key={candidate.id} href={`/candidate/${candidate.id}`}>
                <Card className="hover:shadow-lg transition-all hover:border-teal/50 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-navy text-lg">{candidate.name}</h3>
                      <div className="mt-3 flex gap-4 text-sm">
                        <div>
                          <p className="text-text-secondary">Statut</p>
                          <p className="font-medium text-teal">En cours</p>
                        </div>
                        <div>
                          <p className="text-text-secondary">Pré-AC</p>
                          {candidate.preAcDone ? (
                            <p className="font-medium text-teal">✅ Complété</p>
                          ) : (
                            <p className="font-medium text-salmon">⏳ En attente</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="tertiary" className="text-sm">
                      Voir profil →
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Tab: Schedule */}
        {tab === 'schedule' && (
          <div className="space-y-4">
            <Card>
              <h2 className="font-bold text-navy mb-4">⏱️ Planning du jour</h2>
              <div className="space-y-3">
                {exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="p-4 rounded-lg bg-card-bg border border-border-color hover:border-teal/30"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-navy">{exercise.name}</p>
                        <p className="text-sm text-text-secondary">
                          {exercise.startTime} • {exercise.duration} min
                        </p>
                      </div>
                      <Button variant="tertiary" className="text-xs">
                        Éditer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 className="font-bold text-navy mb-4">👥 Équipe d'assesseurs</h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-teal/10 border border-teal/20">
                  <p className="font-medium text-navy">Sophie Durand</p>
                  <p className="text-sm text-text-secondary">Lead Assessor • Confirmée</p>
                </div>
                <div className="p-3 rounded-lg bg-salmon/10 border border-salmon/20">
                  <p className="font-medium text-navy">À assigner</p>
                  <p className="text-sm text-text-secondary">Second Assessor • En attente</p>
                  <Button variant="secondary" className="mt-2 text-xs">
                    Assigner
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
