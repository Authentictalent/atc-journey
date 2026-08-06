'use client'

import { Card } from '@/app/components/Card'
import { Badge, Button, Progress } from '@/app/components/UI'

// Mock data for demo
const projects: Array<{
  id: string
  clientName: string
  position: string
  status: 'active' | 'pending' | 'completed' | 'error'
  date: string
  candidates: number
  preAcProgress: { done: number; total: number }
  assessorsStatus: string
  actionNeeded: string
}> = [
  {
    id: '1',
    clientName: 'Sanofi',
    position: 'Directeur Opérations',
    status: 'active',
    date: 'Mardi 15 avril, 9h-12h',
    candidates: 3,
    preAcProgress: { done: 2, total: 3 },
    assessorsStatus: 'Lead OK, Second en attente',
    actionNeeded: 'Finaliser (Second assesseur)',
  },
  {
    id: '2',
    clientName: 'LVMH',
    position: 'Manager Ventes',
    status: 'pending',
    date: '22 août (TBC)',
    candidates: 1,
    preAcProgress: { done: 0, total: 1 },
    assessorsStatus: 'À assigner',
    actionNeeded: 'Créer planning',
  },
  {
    id: '3',
    clientName: 'Carrefour',
    position: 'Chef Projet',
    status: 'completed',
    date: 'Mercredi 29 août, 14h-17h',
    candidates: 2,
    preAcProgress: { done: 2, total: 2 },
    assessorsStatus: 'Tous assignés',
    actionNeeded: 'Rien - Tout OK',
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy mb-2">ATC Journey</h1>
            <p className="text-text-secondary">Gère tes Assessment Centers en toute sérénité</p>
          </div>
          <Button variant="primary">+ Nouveau projet</Button>
        </div>

        {/* Filters & Search */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Recherche..."
            className="flex-1 px-4 py-2 rounded-lg border border-border-color bg-card-bg text-foreground placeholder-text-secondary"
          />
          <select className="px-4 py-2 rounded-lg border border-border-color bg-card-bg text-foreground">
            <option>Tous les statuts</option>
            <option>Actif</option>
            <option>En attente</option>
            <option>Terminé</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border-color">
          <button className="px-4 py-3 text-navy font-medium border-b-2 border-navy">Tous</button>
          <button className="px-4 py-3 text-text-secondary">Aujourd'hui</button>
          <button className="px-4 py-3 text-text-secondary">À finaliser</button>
        </div>

        {/* Projects Grid */}
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-navy">{project.clientName} — {project.position}</h3>
                  <p className="text-sm text-text-secondary mt-1">{project.date}</p>
                </div>
                <Badge status={project.status} />
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-text-secondary">Candidats</p>
                  <p className="font-medium text-navy">{project.candidates}</p>
                </div>
                <div>
                  <p className="text-text-secondary">Pré-AC</p>
                  <Progress items={[project.preAcProgress]} />
                </div>
                <div>
                  <p className="text-text-secondary">Assesseurs</p>
                  <p className="font-medium text-navy text-xs">{project.assessorsStatus}</p>
                </div>
              </div>

              <div className="mb-4 p-3 rounded-lg bg-lime/10 border border-lime/20">
                <p className="text-sm text-navy">⚠️ {project.actionNeeded}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="secondary">Voir détails</Button>
                <Button variant="tertiary">Créer planning</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
