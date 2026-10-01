'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f0', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#002446', color: 'white', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', backgroundColor: 'white', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#002446', fontSize: '0.85rem' }}>
              ATC
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', fontFamily: 'Jost, sans-serif' }}>ATC Journey</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Assessment Centers</div>
            </div>
          </div>

          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{
              backgroundColor: 'white',
              color: '#002446',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
              Dashboard
            </button>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: '3rem 1.5rem', maxWidth: '80rem', margin: '0 auto', width: '100%' }}>
        <div style={{ maxWidth: '48rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#002446', marginBottom: '1rem', fontFamily: 'Jost, sans-serif' }}>
            Assessment Centers Platform
          </h1>

          <p style={{ fontSize: '1rem', color: '#666', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Manage your talent evaluations from pre-assessment to feedback. Streamlined platform for project managers, candidates, and assessors.
          </p>

          {/* Demo Roles */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Demo Access
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))', gap: '1rem' }}>
              {[
                { icon: '📊', name: 'Project Lead', href: '/dashboard' },
                { icon: '🎯', name: 'Candidate', href: '/candidate/pre-ac' },
                { icon: '✍️', name: 'Assessor', href: '/assessor/dashboard' },
              ].map((role) => (
                <Link key={role.name} href={role.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#d1da8f'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd'
                    e.currentTarget.style.boxShadow = 'none'
                  }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{role.icon}</div>
                    <p style={{ fontWeight: '600', color: '#002446', fontSize: '0.95rem', margin: 0 }}>
                      {role.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #ddd', backgroundColor: 'white', padding: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#999' }}>
        <p style={{ margin: 0 }}>© 2026 Authentic Talent Consulting · ATC Journey</p>
      </footer>
    </div>
  )
}
