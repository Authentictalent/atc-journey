'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-off-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center">
              <span className="text-lime font-bold text-sm" style={{ fontFamily: 'Jost' }}>ATC</span>
            </div>
            <div>
              <div className="text-sm font-bold text-navy" style={{ fontFamily: 'Jost' }}>ATC Journey</div>
              <div className="text-xs text-gray-500">Assessment Platform</div>
            </div>
          </div>

          <Link href="/dashboard">
            <button className="px-6 py-2 bg-navy text-lime rounded-lg font-semibold text-sm hover:bg-opacity-90 transition">
              Start Demo
            </button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-6xl font-bold text-navy mb-6 leading-tight" style={{ fontFamily: 'Jost' }}>
          Assessment Centers Reimagined
        </h1>

        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Modern platform for managing talent evaluations. From pre-assessment to feedback, everything in one place.
        </p>

        {/* Demo Accounts */}
        <div className="mb-16">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-8">Try these roles</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📊', name: 'Project Lead', email: 'cdp@demo.fr', link: '/dashboard' },
              { icon: '🎯', name: 'Candidate', email: 'candidate@demo.fr', link: '/candidate/pre-ac' },
              { icon: '✍️', name: 'Assessor', email: 'assessor@demo.fr', link: '/assessor/dashboard' },
            ].map((role) => (
              <Link key={role.name} href={role.link}>
                <div style={{
                  padding: '2rem',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d1da8f'
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(209, 218, 143, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.boxShadow = 'none'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{role.icon}</div>
                  <h3 style={{ fontWeight: 'bold', color: '#002446', marginBottom: '0.25rem' }}>{role.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{role.email}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="pt-20 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-12">What's inside</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: '📋', title: 'Progressive Planning', desc: 'Candidates discover exercises day-by-day' },
              { icon: '⏱️', title: 'Live Assessments', desc: 'Real-time tracking and assessor notes' },
              { icon: '📊', title: 'Smart Reports', desc: 'Comprehensive feedback & insights' },
            ].map((f) => (
              <div key={f.title} className="text-left">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-navy mb-2" style={{ fontFamily: 'Jost' }}>{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-24 py-8 text-center text-xs text-gray-500">
        <p>© 2026 Authentic Talent Consulting · ATC Journey</p>
      </footer>
    </div>
  )
}
