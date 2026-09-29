'use client'

import Link from 'next/link'

export default function HomePage() {
  const demoAccounts = [
    { role: 'cdp', name: 'Cheffe de Projet', email: 'cdp@authentictalent.fr', link: '/dashboard', icon: '👨‍💼' },
    { role: 'candidate', name: 'Candidat', email: 'candidate@demo.fr', link: '/candidate/pre-ac', icon: '🎯' },
    { role: 'assessor', name: 'Lead Assesseur', email: 'assessor@demo.fr', link: '/assessor/dashboard', icon: '📊' },
  ]

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col">
      {/* Header */}
      <header className="bg-[#0d1520] text-white px-6 md:px-8 py-3 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
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

          {/* Nav */}
          <nav className="hidden md:flex gap-6 text-sm">
            <button className="text-white/70 hover:text-white transition">Pré-AC</button>
            <button className="text-white/70 hover:text-white transition">Jour J</button>
            <button className="text-white/70 hover:text-white transition">Assesseurs</button>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button className="text-white/70 hover:text-white transition">
              <span className="text-lg">🔍</span>
            </button>
            <button className="text-white/70 hover:text-white transition text-sm">
              EN
            </button>
            <Link href="/dashboard">
              <button className="bg-[#d1da8f] text-[#0d1520] px-5 py-2 rounded-full font-semibold text-sm hover:bg-[#c5cc7a] transition">
                Se connecter
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 relative flex items-center justify-center px-4 py-12 md:py-20">
        {/* Decorative circles */}
        <div className="absolute top-16 right-12 w-24 h-24 border-2 border-[#d1da8f]/20 rounded-full pointer-events-none hidden md:block" />
        <div className="absolute bottom-20 left-12 w-20 h-20 border-2 border-[#d1da8f]/15 rounded-full pointer-events-none hidden md:block" />

        {/* Content */}
        <div className="w-full max-w-2xl relative z-10">
          {/* Logo */}
          <div className="mb-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-[#d1da8f] rounded-lg" />
              <span className="text-xs font-semibold text-[#0d1520]" style={{ fontFamily: 'Jost' }}>
                AUTHENTIC TALENT CONSULTING
              </span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#0d1520] mb-4 leading-tight text-center md:text-left" style={{ fontFamily: 'Jost' }}>
            La plateforme<br />des Assessment Centers
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-[#666] mb-10 leading-relaxed text-center md:text-left max-w-xl">
            Gérez vos évaluations de bout en bout : de la pré-AC au feedback, tout en un seul endroit.
          </p>

          {/* Demo Section */}
          <div className="mb-8">
            <div className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-4 text-center md:text-left">
              Accès démo
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {demoAccounts.map((account) => (
                <Link key={account.role} href={account.link}>
                  <div className="group p-5 bg-white border border-[#ddd] rounded-xl hover:border-[#d1da8f] hover:shadow-md transition cursor-pointer h-full">
                    <div className="text-2xl mb-3">{account.icon}</div>
                    <p className="font-semibold text-[#0d1520] text-sm mb-1">
                      {account.name}
                    </p>
                    <p className="text-xs text-[#999]">
                      {account.email}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer text */}
          <p className="text-xs text-[#999] text-center md:text-left">
            Mode démo · Les données sont fictives · Accès via liste des certifiés
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#ddd] bg-white px-6 md:px-8 py-8 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#d1da8f] rounded-lg" />
                <span className="text-sm font-semibold text-[#0d1520]">ATC Journey</span>
              </div>
              <p className="text-xs text-[#999]">
                La plateforme de gestion des Assessment Centers par Authentic Talent Consulting.
              </p>
            </div>

            {/* Support */}
            <div>
              <p className="text-xs font-semibold text-[#0d1520] mb-3 uppercase">Support</p>
              <ul className="space-y-2 text-xs text-[#666]">
                <li><Link href="#" className="hover:text-[#0d1520]">Support</Link></li>
                <li><Link href="#" className="hover:text-[#0d1520]">FAQ</Link></li>
                <li><Link href="#" className="hover:text-[#0d1520]">Documentation</Link></li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-semibold text-[#0d1520] mb-3 uppercase">Produit</p>
              <ul className="space-y-2 text-xs text-[#666]">
                <li><Link href="#" className="hover:text-[#0d1520]">Fonctionnalités</Link></li>
                <li><Link href="#" className="hover:text-[#0d1520]">Tarification</Link></li>
                <li><Link href="#" className="hover:text-[#0d1520]">Roadmap</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-semibold text-[#0d1520] mb-3 uppercase">Entreprise</p>
              <ul className="space-y-2 text-xs text-[#666]">
                <li><Link href="https://www.authentictalent.fr" target="_blank" className="hover:text-[#0d1520]">authentictalent.fr</Link></li>
                <li><Link href="#" className="hover:text-[#0d1520]">À propos</Link></li>
                <li><Link href="#" className="hover:text-[#0d1520]">Mentions légales</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#ddd] pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-[#999]">
            <p>© Authentic Talent Consulting · ATC Journey</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-[#0d1520]">Confidentialité</Link>
              <Link href="#" className="hover:text-[#0d1520]">Conditions</Link>
              <Link href="#" className="hover:text-[#0d1520]">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
