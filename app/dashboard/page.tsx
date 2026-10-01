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
}

const projects: Project[] = [
  {
    id: '1',
    type: 'robuste',
    clientName: 'Sanofi',
    position: 'Director of Operations',
    status: 'active',
    acDate: 'Tue, April 15',
    candidates: 3,
    preAcDone: 2,
    preAcTotal: 3,
  },
  {
    id: '2',
    type: 'premium',
    clientName: 'LVMH',
    position: 'VP Marketing',
    status: 'active',
    acDate: 'April 22',
    candidates: 2,
    preAcDone: 1,
    preAcTotal: 2,
  },
  {
    id: '3',
    type: 'light',
    clientName: 'Carrefour',
    position: 'Project Manager',
    status: 'pending',
    acDate: 'May 2026',
    candidates: 1,
    preAcDone: 0,
    preAcTotal: 1,
  },
]

const typeColors = {
  light: 'bg-blue-50 text-blue-700 border-blue-200',
  robuste: 'bg-purple-50 text-purple-700 border-purple-200',
  premium: 'bg-amber-50 text-amber-700 border-amber-200',
}

const statusColors = {
  active: 'text-green-700',
  pending: 'text-amber-700',
  completed: 'text-gray-700',
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<'all' | ProjectType>('all')

  const filtered = projects.filter(p => filter === 'all' || p.type === filter)

  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center">
              <span className="text-lime font-bold text-sm" style={{ fontFamily: 'Jost' }}>ATC</span>
            </div>
            <div>
              <div className="text-sm font-bold text-navy" style={{ fontFamily: 'Jost' }}>ATC Journey</div>
              <div className="text-xs text-gray-500">Projects</div>
            </div>
          </Link>

          <div className="flex gap-3">
            <button className="text-sm text-gray-600 hover:text-navy transition">Settings</button>
            <Link href="/">
              <button className="text-sm text-gray-600 hover:text-navy transition">Home</button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-navy mb-2" style={{ fontFamily: 'Jost' }}>Your Projects</h1>
          <p className="text-gray-600">Manage and track all assessment centers</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-3">
          {(['all', 'light', 'robuste', 'premium'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition ${
                filter === type
                  ? 'bg-navy text-lime'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-lime'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects */}
        <div className="space-y-4">
          {filtered.map(project => {
            const preAcPercent = Math.round((project.preAcDone / project.preAcTotal) * 100)
            return (
              <Link key={project.id} href={`/project/${project.id}`}>
                <div className="p-6 bg-white border border-gray-200 rounded-2xl hover:border-lime hover:shadow-lg transition cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-lg border ${typeColors[project.type]}`}>
                          {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                        </span>
                        <span className={`text-xs font-semibold ${statusColors[project.status]}`}>
                          {project.status === 'active' ? '● Active' : project.status === 'pending' ? '● Pending' : '✓ Completed'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-navy">
                        {project.clientName} · {project.position}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">📅 {project.acDate}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Candidates</p>
                      <p className="text-lg font-bold text-navy">{project.candidates}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Pre-AC Progress</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-lime" style={{ width: `${preAcPercent}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-navy">{preAcPercent}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Details</p>
                      <p className="text-sm font-semibold text-navy hover:text-lime transition">View →</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Team</p>
                      <p className="text-sm font-semibold text-navy">{project.candidates} people</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
