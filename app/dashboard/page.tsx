'use client'

import Link from 'next/link'
import { useState } from 'react'

type ProjectType = 'light' | 'robuste' | 'premium'
type ProjectStatus = 'active' | 'pending' | 'completed'

interface Project {
  id: string
  type: ProjectType
  clientName: string
  position: string
  status: ProjectStatus
  acDate: string
  candidates: number
  preAcDone: number
  preAcTotal: number
  assessorsReady: boolean
  actionNeeded?: string
}

const projects: Project[] = [
  {
    id: '1',
    type: 'light',
    clientName: 'Sanofi',
    position: 'Directeur Opérations',
    status: 'active',
    acDate: 'Mardi 15 avril, 10h30',
    candidates: 3,
    preAcDone: 2,
    preAcTotal: 3,
    assessorsReady: true,
    actionNeeded: 'Assignation second assesseur',
  },
  {
    id: '2',
    type: 'robuste',
    clientName: 'LVMH',
    position: 'Manager Ventes',
    status: 'pending',
    acDate: '22 août (TBC)',
    candidates: 1,
    preAcDone: 0,
    preAcTotal: 1,
    assessorsReady: false,
    actionNeeded: 'Créer planning',
  },
  {
    id: '3',
    type: 'premium',
    clientName: 'Carrefour',
    position: 'Chef Projet',
    status: 'completed',
    acDate: 'Mercredi 29 août, 14h-17h',
    candidates: 2,
    preAcDone: 2,
    preAcTotal: 2,
    assessorsReady: true,
  },
]

const statusConfig = {
  active: { label: 'Actif', bg: 'bg-teal/10', border: 'border-teal/20', text: 'text-teal' },
  pending: { label: 'En attente', bg: 'bg-salmon/10', border: 'border-salmon/20', text: 'text-salmon' },
  completed: { label: 'Complété', bg: 'bg-lime/10', border: 'border-lime/20', text: 'text-lime' },
}

const typeConfig = {
  light: { label: 'AC Light', color: 'bg-blue-100 text-blue-700' },
  robuste: { label: 'AC Robuste', color: 'bg-purple-100 text-purple-700' },
  premium: { label: 'AC Premium', color: 'bg-amber-100 text-amber-700' },
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<'all' | 'light' | 'robuste' | 'premium'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all')

  const filteredProjects = projects.filter((p) => {
    if (filter !== 'all' && p.type !== filter) return false
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Header */}
      <header className="bg-[#0d1520] text-white px-6 md:px-8 py-3 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#d1da8f] rounded-lg flex items-center justify-center font-bold text-[#0d1520] text-sm">
              ATC
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ fontFamily: 'Jost' }}>
                ATC Journey
              </div>
              <div className="text-xs text-white/50">Make your talent shine</div>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 text-sm flex-1 justify-center">
            <button className="text-white/70 hover:text-white transition">Mes projets</button>
            <button className="text-white/70 hover:text-white transition">Calendrier</button>
            <button className="text-white/70 hover:text-white transition">Ressources</button>
          </nav>

          <div className="flex items-center gap-3">
            <button className="text-white/70 hover:text-white transition">👤</button>
            <Link href="/">
              <button className="bg-[#d1da8f] text-[#0d1520] px-4 py-1.5 rounded-full font-semibold text-xs hover:bg-[#c5cc7a] transition">
                Accueil
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-4 md:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#0d1520] mb-2" style={{ fontFamily: 'Jost' }}>
              Mes projets
            </h1>
            <p className="text-[#666]">Gérez vos Assessment Centers en toute sérénité</p>
          </div>

          {/* Controls */}
          <div className="mb-8 space-y-4">
            {/* Search & Type Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="🔍 Rechercher un projet..."
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#ddd] bg-white text-[#0d1520] placeholder-[#999] text-sm"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as typeof filter)}
                className="px-4 py-2.5 rounded-lg border border-[#ddd] bg-white text-[#0d1520] text-sm"
              >
                <option value="all">Tous les types</option>
                <option value="light">AC Light</option>
                <option value="robuste">AC Robuste</option>
                <option value="premium">AC Premium</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-4 py-2.5 rounded-lg border border-[#ddd] bg-white text-[#0d1520] text-sm"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="pending">En attente</option>
                <option value="completed">Complété</option>
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="space-y-4">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12 text-[#999]">
                <p className="text-sm">Aucun projet ne correspond à vos filtres</p>
              </div>
            ) : (
              filteredProjects.map((project) => {
                const status = statusConfig[project.status]
                const type = typeConfig[project.type]
                const preAcPercent = Math.round((project.preAcDone / project.preAcTotal) * 100)

                return (
                  <Link key={project.id} href={`/project/${project.id}`}>
                    <div className="group bg-white border border-[#ddd] rounded-xl p-6 hover:border-[#d1da8f] hover:shadow-md transition-all cursor-pointer">
                      {/* Header row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${type.color}`}>
                              {type.label}
                            </span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.bg} ${status.text}`}>
                              {status.label}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-[#0d1520]">
                            {project.clientName} — {project.position}
                          </h3>
                          <p className="text-sm text-[#666] mt-1">📅 {project.acDate}</p>
                        </div>
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-[#999] mb-1">Candidats</p>
                          <p className="text-xl font-bold text-[#0d1520]">{project.candidates}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#999] mb-1">Pré-AC</p>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-[#ddd] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#d1da8f] rounded-full transition-all"
                                style={{ width: `${preAcPercent}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-[#0d1520]">{preAcPercent}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-[#999] mb-1">Assesseurs</p>
                          <p className="text-sm font-semibold" style={{ color: project.assessorsReady ? '#61a4b0' : '#eba687' }}>
                            {project.assessorsReady ? '✅ Prêt' : '⏳ À assigner'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#999] mb-1">Status</p>
                          <p className="text-sm font-semibold text-[#0d1520]">Voir plus →</p>
                        </div>
                      </div>

                      {/* Action alert */}
                      {project.actionNeeded && (
                        <div className="p-3 rounded-lg bg-[#eba687]/10 border border-[#eba687]/20">
                          <p className="text-sm text-[#0d1520]">
                            <span className="font-semibold">⚠️ Action requise:</span> {project.actionNeeded}
                          </p>
                        </div>
                      )}
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
