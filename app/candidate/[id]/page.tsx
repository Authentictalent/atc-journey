'use client'

import { Card } from '@/app/components/Card'
import { Badge, Button, Progress } from '@/app/components/UI'

export default function CandidateProfilePage({ params }: { params: { id: string } }) {
  const candidate = {
    id: params.id,
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 6 12 34 56 78',
    position: 'Directeur Opérations',
    client: 'Sanofi',
    status: 'in-progress' as const,
    startDate: '2026-04-08',
    assessmentDate: '2026-04-15',
    assessmentTime: '09:00-12:00',
    photo: null,
  }

  const timeline = [
    { step: 'Candidature', date: '2026-04-08', completed: true, note: '✅ Dossier reçu' },
    { step: 'Questionnaire Hogan', date: '2026-04-08', completed: true, note: '✅ Complété le 10/04' },
    { step: 'Questionnaire pré-AC', date: '2026-04-10', completed: true, note: '✅ Complété' },
    { step: 'Assessment Center', date: '2026-04-15', completed: false, note: '⏳ En attente' },
    { step: 'Débrief', date: '2026-04-17', completed: false, note: '⏳ À planifier' },
  ]

  const hoganScores = [
    { scale: 'Ambition', score: 72, category: 'Modéré' },
    { scale: 'Souci de dominer', score: 58, category: 'Modéré' },
    { scale: 'Sociabilité', score: 81, category: 'Élevé' },
    { scale: 'Prudence', score: 45, category: 'Faible' },
    { scale: 'Conscience', score: 88, category: 'Très élevé' },
    { scale: 'Flexibilité', score: 62, category: 'Modéré' },
  ]

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-2">{candidate.name}</h1>
            <p className="text-text-secondary">
              {candidate.position} • {candidate.client}
            </p>
          </div>
          <Badge status={candidate.status === 'in-progress' ? 'active' : 'pending'} />
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left: Info & Timeline */}
          <div className="col-span-2 space-y-6">
            {/* Contact Info */}
            <Card>
              <h2 className="font-bold text-navy mb-4">Coordonnées</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Email</span>
                  <span className="font-medium text-navy">{candidate.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Téléphone</span>
                  <span className="font-medium text-navy">{candidate.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Inscription</span>
                  <span className="font-medium text-navy">{candidate.startDate}</span>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card>
              <h2 className="font-bold text-navy mb-6">Parcours</h2>
              <div className="space-y-4">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          item.completed ? 'bg-teal' : 'bg-border-color'
                        }`}
                      />
                      {idx < timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-border-color mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-navy">{item.step}</p>
                      <p className="text-xs text-text-secondary">{item.date}</p>
                      <p className="text-sm text-teal mt-1">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Hogan & Actions */}
          <div className="space-y-6">
            {/* Assessment Info */}
            <Card className="bg-teal/5 border-teal/20">
              <h3 className="font-bold text-navy mb-4">📅 Assessment Center</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-text-secondary">Date</p>
                  <p className="font-medium text-navy">{candidate.assessmentDate}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Heure</p>
                  <p className="font-medium text-navy">{candidate.assessmentTime}</p>
                </div>
              </div>
            </Card>

            {/* Hogan Scores */}
            <Card>
              <h3 className="font-bold text-navy mb-4">📊 Hogan HPI</h3>
              <div className="space-y-3 text-sm">
                {hoganScores.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-navy font-medium">{item.scale}</span>
                      <span className="text-text-secondary">{item.score}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-border-color overflow-hidden">
                      <div
                        className="h-full bg-teal"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{item.category}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <Card>
              <h3 className="font-bold text-navy mb-4">Actions</h3>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full text-sm">
                  📄 Voir dossier
                </Button>
                <Button variant="secondary" className="w-full text-sm">
                  ✉️ Contacter
                </Button>
                <Button variant="tertiary" className="w-full text-sm">
                  🔗 Copier lien
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
