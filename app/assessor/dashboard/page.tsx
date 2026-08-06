'use client'

import { Card } from '@/app/components/Card'
import { Badge, Button, Progress } from '@/app/components/UI'

const assessmentSessions = [
  {
    id: '1',
    clientName: 'Sanofi',
    position: 'Directeur Opérations',
    date: 'Mardi 15 avril, 9h-12h',
    location: 'Zoom + MS Teams',
    role: 'Lead Assessor',
    candidates: 3,
    preparedCount: 2,
    status: 'ready',
    actionNeeded: 'Vérifier notes du 2ème candidat',
  },
  {
    id: '2',
    clientName: 'LVMH',
    position: 'Manager Ventes',
    date: 'Jeudi 17 avril, 14h-16h30',
    location: 'Paris (42 rue des Invalides)',
    role: 'Assessor',
    candidates: 1,
    preparedCount: 0,
    status: 'preparing',
    actionNeeded: 'Lire profil candidat et briefing exercices',
  },
  {
    id: '3',
    clientName: 'Carrefour',
    position: 'Chef Projet',
    date: 'Mercredi 29 août, 14h-17h',
    location: 'Bordeaux (HQ)',
    role: 'Assessor',
    candidates: 2,
    preparedCount: 2,
    status: 'completed',
    actionNeeded: 'Rien',
  },
]

const getStatusColor = (status: string) => {
  if (status === 'ready') return 'bg-teal/10 border-teal/30'
  if (status === 'preparing') return 'bg-lime/10 border-lime/30'
  return 'bg-gray-100 border-gray-300'
}

export default function AssessorDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-2">Assesseur</h1>
            <p className="text-text-secondary">Tes sessions d'Assessment Center</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">Sophie Durand</p>
            <p className="text-xs text-text-secondary">Assessor Sénior</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <p className="text-3xl font-bold text-navy">3</p>
            <p className="text-sm text-text-secondary mt-2">Sessions prévues</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-teal">2</p>
            <p className="text-sm text-text-secondary mt-2">Sessions prêtes</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-lime">6</p>
            <p className="text-sm text-text-secondary mt-2">Candidats totaux</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border-color">
          <button className="px-4 py-3 text-navy font-medium border-b-2 border-navy">À venir</button>
          <button className="px-4 py-3 text-text-secondary">Complétées</button>
        </div>

        {/* Sessions */}
        <div className="space-y-4">
          {assessmentSessions.map((session) => (
            <Card
              key={session.id}
              className={`hover:shadow-lg transition-shadow ${getStatusColor(session.status)}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-navy">
                    {session.clientName} — {session.position}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">{session.date}</p>
                  <p className="text-sm text-text-secondary">📍 {session.location}</p>
                </div>
                <div className="text-right">
                  <Badge status={session.status === 'completed' ? 'completed' : session.status === 'ready' ? 'active' : 'pending'} />
                  <p className="text-xs text-text-secondary mt-2">{session.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm border-t border-border-color pt-4">
                <div>
                  <p className="text-text-secondary">Candidats</p>
                  <p className="font-medium text-navy">{session.candidates}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Préparés</p>
                  <Progress items={[{ done: session.preparedCount, total: session.candidates }]} />
                </div>
                <div>
                  <p className="text-text-secondary">Action</p>
                  <p className="font-medium text-navy text-xs">{session.actionNeeded}</p>
                </div>
              </div>

              <div className="flex gap-2">
                {session.status === 'ready' && (
                  <Button variant="primary">Débuter la session</Button>
                )}
                {session.status === 'preparing' && (
                  <Button variant="secondary">Se préparer</Button>
                )}
                {session.status === 'completed' && (
                  <Button variant="tertiary">Voir rapport</Button>
                )}
                <Button variant="tertiary">Détails</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
