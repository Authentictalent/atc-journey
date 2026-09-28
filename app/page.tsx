'use client'

import Link from 'next/link'

export default function LoginPage() {
  const demoAccounts = [
    { role: 'cdp', name: 'Gestionnaire de projets', email: 'cdp@authentictalent.fr', link: '/dashboard' },
    { role: 'candidate', name: 'Candidat', email: 'candidate@demo.fr', link: '/candidate/pre-ac' },
    { role: 'assessor', name: 'Assesseur', email: 'assessor@demo.fr', link: '/assessor/dashboard' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1a1a1a] text-white px-8 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-lg font-bold" style={{ fontFamily: 'Jost' }}>
              ATC Journey
            </h1>
            <nav className="hidden md:flex gap-8 text-sm">
              <button className="hover:text-lime transition">Pré-AC</button>
              <button className="hover:text-lime transition">Jour J</button>
              <button className="hover:text-lime transition">Assesseurs</button>
              <button className="hover:text-lime transition">Débrief</button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <input type="text" placeholder="Chercher..." className="bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm placeholder-white/50 text-white w-40" />
            <Link href="#login">
              <button className="bg-[#D1DA8F] text-black px-6 py-2 rounded-full font-medium text-sm hover:bg-[#c5cc7a] transition">
                Se connecter
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex items-center justify-center min-h-[calc(100vh-80px)] px-8 py-16">
        {/* Decorative shapes */}
        <div className="absolute top-20 right-20 w-32 h-16 border-2 border-black/10 rounded-full pointer-events-none" />
        <div className="absolute bottom-20 left-20 w-32 h-16 border-2 border-black/10 rounded-full pointer-events-none" />

        {/* Content */}
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="mb-8">
            <div className="text-sm font-medium text-black mb-1" style={{ fontFamily: 'Jost' }}>
              ATC Journey
            </div>
            <p className="text-xs text-gray-500">Make your talent shine</p>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-bold text-black mb-3" style={{ fontFamily: 'Jost' }}>
            La plateforme<br />des Assessment Centers.
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-gray-600 mb-8" style={{ fontFamily: 'Nunito Sans' }}>
            Réservé à tous les acteurs de l'Assessment Center par Authentic Talent Consulting.
          </p>

          {/* Demo Accounts */}
          <div className="space-y-4 mb-8">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">ACCÈS DÉMO</div>
            {demoAccounts.map((account) => (
              <Link key={account.role} href={account.link}>
                <div className="p-4 border border-gray-200 rounded-lg hover:border-[#D1DA8F] hover:bg-yellow-50/50 transition cursor-pointer">
                  <p className="font-medium text-black text-sm">{account.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{account.email}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer text */}
          <p className="text-xs text-gray-500 text-center">
            Mode démo · Les données sont fictives
          </p>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-gray-200 px-8 py-6 text-center text-xs text-gray-500">
        © Authentic Talent Consulting · ATC Journey
      </footer>
    </div>
  )
}
