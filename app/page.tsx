'use client'

import Link from 'next/link'

export default function LoginPage() {
  const demoAccounts = [
    { role: 'cdp', name: 'Gestionnaire', email: 'cdp@authentictalent.fr', link: '/dashboard' },
    { role: 'candidate', name: 'Candidat', email: 'candidate@demo.fr', link: '/candidate/pre-ac' },
    { role: 'assessor', name: 'Assesseur', email: 'assessor@demo.fr', link: '/assessor/dashboard' },
  ]

  return (
    <div className="min-h-screen bg-[#0A1628] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Jost' }}>
              ATC Journey
            </h1>
            <p className="text-[#D1DA8F] text-xs mt-1" style={{ fontFamily: 'Nunito Sans' }}>
              Make your talent shine
            </p>
          </div>
          <nav className="hidden md:flex gap-12 text-sm">
            <button className="text-white/60 hover:text-white transition">Pré-AC</button>
            <button className="text-white/60 hover:text-white transition">Jour J</button>
            <button className="text-white/60 hover:text-white transition">Assesseurs</button>
            <button className="text-white/60 hover:text-white transition">Débrief</button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-8 py-24">
        <div className="w-full max-w-3xl">
          {/* Tagline */}
          <p className="text-center text-[#D1DA8F] text-sm tracking-widest font-medium mb-8" style={{ fontFamily: 'Nunito Sans' }}>
            PLATEFORME ASSESSMENT CENTER · PAR AUTHENTIC TALENT CONSULTING
          </p>

          {/* Heading */}
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-8 leading-tight" style={{ fontFamily: 'Jost' }}>
            Tout ce qu'un Assessment Center mérite.
          </h2>

          {/* Subtitle */}
          <p className="text-center text-white/60 mb-12 text-lg max-w-2xl mx-auto" style={{ fontFamily: 'Nunito Sans' }}>
            La plateforme dédiée aux Assessment Centers. Pilote tes projets de talent management en toute sérénité, du début à la fin.
          </p>

          {/* Search Bar */}
          <div className="bg-white/10 border border-white/20 rounded-full px-6 py-4 mb-12 flex items-center gap-3">
            <span className="text-white/40">🔍</span>
            <input
              type="text"
              placeholder="Cherche un projet, ta pré-AC, ton planning..."
              className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-center"
              style={{ fontFamily: 'Nunito Sans' }}
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {demoAccounts.map((account) => (
              <Link key={account.role} href={account.link}>
                <button className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-full text-sm transition" style={{ fontFamily: 'Nunito Sans' }}>
                  {account.name}
                </button>
              </Link>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl mb-2">📋</p>
              <h3 className="text-sm font-medium text-white mb-1">Pré-AC</h3>
              <p className="text-xs text-white/50">Hogan, questionnaires</p>
            </div>
            <div>
              <p className="text-2xl mb-2">⏱️</p>
              <h3 className="text-sm font-medium text-white mb-1">Jour J</h3>
              <p className="text-xs text-white/50">Exercices, timers</p>
            </div>
            <div>
              <p className="text-2xl mb-2">👁️</p>
              <h3 className="text-sm font-medium text-white mb-1">Assesseurs</h3>
              <p className="text-xs text-white/50">Préparation, observation</p>
            </div>
            <div>
              <p className="text-2xl mb-2">💬</p>
              <h3 className="text-sm font-medium text-white mb-1">Débrief</h3>
              <p className="text-xs text-white/50">Retours candidat</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-8 py-8 text-center text-xs text-white/50">
        <p className="mb-2">© Authentic Talent Consulting · ATC Journey</p>
        <a href="mailto:contact@authentictalent.fr" className="text-[#D1DA8F] hover:text-white transition">
          contact@authentictalent.fr
        </a>
      </footer>
    </div>
  )
}
