'use client'

import Link from 'next/link'

export default function LoginPage() {
  const demoAccounts = [
    { role: 'cdp', name: 'Gestionnaire de projets', email: 'cdp@authentictalent.fr', link: '/dashboard', desc: 'Pilote tes Assessment Centers' },
    { role: 'candidate', name: 'Candidat', email: 'candidate@demo.fr', link: '/candidate/pre-ac', desc: 'Accède à ton parcours' },
    { role: 'assessor', name: 'Assesseur', email: 'assessor@demo.fr', link: '/assessor/dashboard', desc: 'Manage tes sessions' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200/50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy" style={{ fontFamily: 'Jost' }}>
              ATC Journey
            </h1>
            <p className="text-xs text-slate-500 mt-1">Make your talent shine</p>
          </div>
          <a href="https://www.authentictalent.fr" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-navy transition-colors">
            Découvrir ATC →
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-navy mb-4" style={{ fontFamily: 'Jost' }}>
              Bienvenue sur<br />ATC Journey
            </h2>
            <p className="text-xl text-slate-600 max-w-lg mx-auto leading-relaxed">
              La plateforme dédiée aux Assessment Centers. Pilote tes projets de talent management en toute sérénité, du début à la fin.
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {demoAccounts.map((account) => (
              <Link key={account.role} href={account.link}>
                <div className="group relative h-full bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg hover:border-navy/30 transition-all cursor-pointer overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy via-teal to-lime transform -translate-y-1 group-hover:translate-y-0 transition-transform" />

                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <span className="text-4xl">
                        {account.role === 'cdp' && '📊'}
                        {account.role === 'candidate' && '🎯'}
                        {account.role === 'assessor' && '👥'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-navy mb-2" style={{ fontFamily: 'Jost' }}>
                      {account.name}
                    </h3>
                    <p className="text-sm text-slate-600 mb-4 flex-1">
                      {account.desc}
                    </p>

                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500">{account.email}</p>
                      <p className="text-xs text-navy font-medium mt-2 group-hover:translate-x-1 transition-transform inline-block">
                        Accéder →
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Features Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 mb-12">
            <h3 className="text-lg font-bold text-navy mb-6" style={{ fontFamily: 'Jost' }}>
              Tout ce dont tu as besoin
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex gap-3">
                <span className="text-lime text-lg">✓</span>
                <div>
                  <p className="font-medium text-navy">Pré-AC digitalisée</p>
                  <p className="text-slate-600 text-xs mt-1">Hogan, questionnaires</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lime text-lg">✓</span>
                <div>
                  <p className="font-medium text-navy">Jour J simplifié</p>
                  <p className="text-slate-600 text-xs mt-1">Exercices, timers</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lime text-lg">✓</span>
                <div>
                  <p className="font-medium text-navy">Assesseurs guidés</p>
                  <p className="text-slate-600 text-xs mt-1">Prep, observation</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-lime text-lg">✓</span>
                <div>
                  <p className="font-medium text-navy">Débrief transparent</p>
                  <p className="text-slate-600 text-xs mt-1">Retours candidat</p>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="text-center text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p>Mode démo • Aucune authentification requise • Les données sont de démonstration</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-xs text-slate-500">
          <p className="mb-2">© Authentic Talent Consulting · Plateforme ATC Journey</p>
          <a href="mailto:contact@authentictalent.fr" className="text-navy hover:underline">
            contact@authentictalent.fr
          </a>
        </div>
      </footer>
    </div>
  )
}
