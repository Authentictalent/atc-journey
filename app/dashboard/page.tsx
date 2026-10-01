'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Project {
  id: string
  name: string
  position: string
  date: string
  status: 'active' | 'pending' | 'completed'
  candidates: number
}

const projects: Project[] = [
  {
    id: '1',
    name: 'Sanofi',
    position: 'Director of Operations',
    date: 'April 15, 2026',
    status: 'active',
    candidates: 3,
  },
  {
    id: '2',
    name: 'LVMH',
    position: 'VP Marketing',
    date: 'April 22, 2026',
    status: 'active',
    candidates: 2,
  },
  {
    id: '3',
    name: 'Carrefour',
    position: 'Project Manager',
    date: 'May 15, 2026',
    status: 'pending',
    candidates: 1,
  },
]

const statusLabels = {
  active: { label: 'Active', color: '#10b981' },
  pending: { label: 'Pending', color: '#f59e0b' },
  completed: { label: 'Completed', color: '#6b7280' },
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all')

  const filtered = projects.filter(p => filter === 'all' || p.status === filter)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f0', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#002446', color: 'white', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'white', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#002446', fontSize: '0.85rem' }}>
              ATC
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', fontFamily: 'Jost, sans-serif' }}>ATC Journey</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Projects</div>
            </div>
          </Link>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button style={{ backgroundColor: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '0.9rem' }}>
              Settings
            </button>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
              }}>
                Home
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '80rem', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#002446', marginBottom: '0.5rem', fontFamily: 'Jost, sans-serif' }}>
            Projects
          </h1>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>Manage your assessment centers</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {(['all', 'active', 'pending', 'completed'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: filter === status ? '#002446' : 'white',
                color: filter === status ? 'white' : '#002446',
                borderBottom: filter === status ? '2px solid #d1da8f' : '1px solid #ddd',
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filtered.map(project => {
            const status = statusLabels[project.status]
            return (
              <Link key={project.id} href={`/project/${project.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'start',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d1da8f'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ddd'
                  e.currentTarget.style.boxShadow = 'none'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#002446', margin: 0 }}>
                        {project.name}
                      </h3>
                      <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        backgroundColor: status.color,
                        color: 'white',
                        fontWeight: '500',
                      }}>
                        {status.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.25rem 0' }}>
                      {project.position}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#999', margin: '0.25rem 0' }}>
                      📅 {project.date}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#002446', margin: 0 }}>
                      {project.candidates}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#999', margin: '0.25rem 0' }}>
                      candidates
                    </p>
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
