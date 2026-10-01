'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f0', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative circles - subtle background */}
      <div style={{
        position: 'absolute',
        top: '50px',
        right: '100px',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        border: '2px solid rgba(209, 218, 143, 0.15)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '100px',
        left: '50px',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        border: '2px solid rgba(97, 164, 176, 0.1)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <header style={{ backgroundColor: '#002446', color: 'white', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: '#d1da8f',
              borderRadius: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#002446',
              fontSize: '0.75rem',
              boxShadow: '0 4px 12px rgba(209, 218, 143, 0.3)'
            }}>
              ATC
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', fontFamily: 'Jost, sans-serif' }}>ATC Journey</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Assessment Centers</div>
            </div>
          </div>

          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{
              backgroundColor: '#d1da8f',
              color: '#002446',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '100px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(209, 218, 143, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(209, 218, 143, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(209, 218, 143, 0.3)'
            }}>
              Dashboard
            </button>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main style={{ flex: 1, padding: '3rem 1.5rem', maxWidth: '80rem', margin: '0 auto', width: '100%', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: '48rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#002446', marginBottom: '1rem', fontFamily: 'Jost, sans-serif' }}>
            Assessment Centers Platform
          </h1>

          <p style={{ fontSize: '1rem', color: '#666', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Manage your talent evaluations from pre-assessment to feedback. Streamlined platform for project managers, candidates, and assessors.
          </p>

          {/* Demo Roles */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              borderRadius: '100px',
              backgroundColor: 'rgba(209, 218, 143, 0.15)',
              marginBottom: '1rem',
              border: '1px solid rgba(209, 218, 143, 0.3)'
            }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#002446', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Demo Access
              </p>
            </div>
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
                    transition: 'all 0.3s',
                    textAlign: 'center',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#d1da8f'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(209, 218, 143, 0.2)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#ddd'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}>
                    {/* Small decorative pill */}
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '10px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '100px',
                      backgroundColor: '#d1da8f',
                      opacity: 0.3,
                    }} />

                    <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{role.icon}</div>
                    <p style={{ fontWeight: '600', color: '#002446', fontSize: '0.95rem', margin: 0, fontFamily: 'Jost, sans-serif' }}>
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
      <footer style={{ borderTop: '1px solid #ddd', backgroundColor: 'white', padding: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#999', position: 'relative', zIndex: 10 }}>
        <p style={{ margin: 0 }}>© 2026 Authentic Talent Consulting · ATC Journey</p>
      </footer>
    </div>
  )
}
