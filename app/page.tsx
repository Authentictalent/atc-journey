'use client'

import Link from 'next/link'

export default function LoginPage() {
  const demoAccounts = [
    { role: 'cdp', name: 'Gestionnaire de projets', email: 'cdp@authentictalent.fr', link: '/dashboard', desc: 'Pilote tes Assessment Centers' },
    { role: 'candidate', name: 'Candidat', email: 'candidate@demo.fr', link: '/candidate/pre-ac', desc: 'Accède à ton parcours' },
    { role: 'assessor', name: 'Assesseur', email: 'assessor@demo.fr', link: '/assessor/dashboard', desc: 'Manage tes sessions' },
  ]

  return (
    <div className="min-h-screen bg-navy text-white flex flex-col relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 w-80 h-80 border-2 border-lime/30 rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 border border-teal/20 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-40 h-40 border border-lime/10 rounded-lg pointer-events-none transform rotate-45" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Jost' }}>
              ATC Journey
            </h1>
            <p className="text-xs text-lime mt-1" style={{ fontFamily: 'Nunito Sans' }}>
              Make your talent shine
            </p>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <button className="text-white/70 hover:text-white transition-colors">Pré-AC</button>
            <button className="text-white/70 hover:text-white transition-colors">Jour J</button>
            <button className="text-white/70 hover:text-white transition-colors">Assesseurs</button>
            <button className="text-white/70 hover:text-white transition-colors">Débrief</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <p className="text-sm text-lime mb-6 tracking-widest font-medium" style={{ fontFamily: 'Nunito Sans' }}>
              PLATEFORME ASSESSMENT CENTER · BY AUTHENTIC TALENT CONSULTING
            </p>

            <h2 className="text-6xl md:text-7xl font-bold mb-8 leading-tight" style={{ fontFamily: 'Jost' }}>
              Tout ce qu'un Assessment Center mérite.
            </h2>

            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Nunito Sans' }}>
              La même qualité que tu apportes à tes projets, appliquée à ton Assessment Center. Guides précis, outils modernes, expertise à portée de main.
            </p>
          </div>

          {/* Search/CTA Section */}
          <div className="max-w-2xl mx-auto mb-20">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1 mb-8">
              <input
                type="text"
                placeholder="Accéder à un projet, voir ma pré-AC, vérifier mon planning..."
                className="w-full px-6 py-4 bg-transparent text-white placeholder-white/50 outline-none text-center"
                style={{ fontFamily: 'Nunito Sans' }}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {demoAccounts.map((account) => (
                <Link key={account.role} href={account.link}>
                  <button className="w-full px-4 py-3 text-sm bg-white/10 hover:bg-white/20 border border-white/20 hover:border-lime/50 text-white rounded-lg transition-all" style={{ fontFamily: 'Nunito Sans' }}>
                    {account.role === 'cdp' && '📊 '}
                    {account.role === 'candidate' && '🎯 '}
                    {account.role === 'assessor' && '👥 '}
                    {account.name === 'Gestionnaire de projets' ? 'Gérer mes projets' : account.name === 'Candidat' ? 'Ma pré-AC' : 'Mes sessions'}
                  </button>
                </Link>
              ))}
              <Link href="#scroll">
                <button className="col-span-2 md:col-span-1 px-4 py-3 text-sm bg-lime text-navy hover:bg-lime/90 font-medium rounded-lg transition-all" style={{ fontFamily: 'Nunito Sans' }}>
                  ↓ En savoir plus
                </button>
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div id="scroll" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
              <span className="text-2xl mb-3 block">📋</span>
              <h3 className="font-bold mb-2" style={{ fontFamily: 'Jost' }}>Pré-AC</h3>
              <p className="text-xs text-white/60" style={{ fontFamily: 'Nunito Sans' }}>Hogan, questionnaires</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
              <span className="text-2xl mb-3 block">⏱️</span>
              <h3 className="font-bold mb-2" style={{ fontFamily: 'Jost' }}>Jour J</h3>
              <p className="text-xs text-white/60" style={{ fontFamily: 'Nunito Sans' }}>Exercices, timers</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
              <span className="text-2xl mb-3 block">👁️</span>
              <h3 className="font-bold mb-2" style={{ fontFamily: 'Jost' }}>Assesseurs</h3>
              <p className="text-xs text-white/60" style={{ fontFamily: 'Nunito Sans' }}>Grilles, observation</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur">
              <span className="text-2xl mb-3 block">💬</span>
              <h3 className="font-bold mb-2" style={{ fontFamily: 'Jost' }}>Débrief</h3>
              <p className="text-xs text-white/60" style={{ fontFamily: 'Nunito Sans' }}>Retours candidat</p>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="text-center text-xs text-white/50">
            <p>Mode démo • Toutes les données sont fictives • Cliquez sur un bouton ci-dessus pour explorer</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-8 text-center text-xs text-white/50">
          <p className="mb-2">© Authentic Talent Consulting · Plateforme ATC Journey</p>
          <a href="mailto:contact@authentictalent.fr" className="text-lime hover:text-lime/80 transition-colors">
            contact@authentictalent.fr
          </a>
        </div>
      </footer>
    </div>
  )
}
