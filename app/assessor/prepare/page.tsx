'use client'

import { useState } from 'react'
import { Card } from '@/app/components/Card'
import { Badge, Button } from '@/app/components/UI'

const candidates = [
  {
    id: 1,
    name: 'Jean Dupont',
    position: 'Directeur Opérations',
    hoganDone: true,
    questionnaireDone: true,
    notesWritten: true,
    readyRating: 85,
  },
  {
    id: 2,
    name: 'Marie Martin',
    position: 'Directeur Opérations',
    hoganDone: true,
    questionnaireDone: true,
    notesWritten: false,
    readyRating: 60,
  },
  {
    id: 3,
    name: 'Pierre Bernard',
    position: 'Directeur Opérations',
    hoganDone: false,
    questionnaireDone: false,
    notesWritten: false,
    readyRating: 30,
  },
]

const materials = [
  { id: 1, name: 'Guide d\'évaluation CBI', type: 'PDF', pages: 12 },
  { id: 2, name: 'Étude de cas — Scénario', type: 'PDF', pages: 8 },
  { id: 3, name: 'Grille d\'observation', type: 'PDF', pages: 4 },
  { id: 4, name: 'Consignes présentation', type: 'PDF', pages: 3 },
]

export default function AssessorPreparePage() {
  const [expandedCandidate, setExpandedCandidate] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Préparation — Sanofi</h1>
          <p className="text-text-secondary">Directeur Opérations • Mardi 15 avril, 9h-12h</p>
        </div>

        {/* Overall Ready Score */}
        <Card className="mb-8 bg-gradient-to-r from-lime/10 to-teal/10 border-lime/20">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-bold text-navy mb-2">Niveau de préparation global</h2>
              <p className="text-sm text-text-secondary">Tous les candidats et matériaux sont-ils prêts ?</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-lime">62%</p>
              <p className="text-sm text-text-secondary">Prêt à 100% en 2 actions</p>
            </div>
          </div>
        </Card>

        {/* Candidates */}
        <Card className="mb-8">
          <h2 className="font-bold text-navy mb-4">👤 Candidats ({candidates.length})</h2>
          <div className="space-y-2">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  expandedCandidate === candidate.id
                    ? 'bg-teal/10 border-teal/50'
                    : 'bg-card-bg border-border-color hover:border-teal/30'
                }`}
                onClick={() =>
                  setExpandedCandidate(expandedCandidate === candidate.id ? null : candidate.id)
                }
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-navy">{candidate.name}</p>
                    <p className="text-xs text-text-secondary">{candidate.position}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-teal">{candidate.readyRating}%</p>
                    <p className="text-xs text-text-secondary">Prêt</p>
                  </div>
                </div>

                {expandedCandidate === candidate.id && (
                  <div className="mt-4 pt-4 border-t border-border-color space-y-3">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        {candidate.hoganDone ? (
                          <span className="text-teal">✅ Hogan</span>
                        ) : (
                          <span className="text-text-secondary">⏳ Hogan</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {candidate.questionnaireDone ? (
                          <span className="text-teal">✅ Questionnaire</span>
                        ) : (
                          <span className="text-text-secondary">⏳ Questionnaire</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {candidate.notesWritten ? (
                          <span className="text-teal">✅ Notes</span>
                        ) : (
                          <span className="text-salmon">❌ À écrire</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="text-xs">
                        Lire dossier
                      </Button>
                      <Button variant="tertiary" className="text-xs">
                        Écrire notes
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Materials */}
        <Card>
          <h2 className="font-bold text-navy mb-4">📚 Matériaux & Ressources</h2>
          <div className="space-y-2">
            {materials.map((material) => (
              <div
                key={material.id}
                className="p-3 rounded-lg bg-card-bg border border-border-color hover:border-teal/30 transition-all flex justify-between items-center group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="font-medium text-navy">{material.name}</p>
                    <p className="text-xs text-text-secondary">{material.pages} pages</p>
                  </div>
                </div>
                <Button variant="tertiary" className="text-xs">
                  Télécharger
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* Checklist */}
        <div className="mt-8 p-4 rounded-lg bg-navy/5 border border-navy/20">
          <h3 className="font-bold text-navy mb-3">✅ Checklist avant demain</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span>Lire tous les profils candidats</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Revoir les grilles d'évaluation</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Écrire observations pré-AC pour chaque candidat</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Tester accès Teams</span>
            </li>
            <li className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Revoir instructions et timing</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
