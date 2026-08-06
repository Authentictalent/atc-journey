'use client'

import { useState } from 'react'
import { Card } from '@/app/components/Card'
import { Button } from '@/app/components/UI'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'cdp' | 'candidate' | 'assessor' | null>(null)

  const demoAccounts = [
    { role: 'cdp', name: 'CDP', email: 'cdp@authentictalent.fr', link: '/dashboard' },
    { role: 'candidate', name: 'Candidat', email: 'candidate@demo.fr', link: '/candidate/pre-ac' },
    { role: 'assessor', name: 'Assesseur', email: 'assessor@demo.fr', link: '/assessor/dashboard' },
  ]

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-navy mb-2">ATC Journey</h1>
          <p className="text-text-secondary">Plateforme d'Assessment Center</p>
        </div>

        {!role ? (
          // Role selection
          <div className="space-y-4">
            <p className="text-center text-text-secondary mb-6">Je suis...</p>
            {demoAccounts.map((account) => (
              <Link key={account.role} href={account.link}>
                <Card className="p-4 cursor-pointer hover:shadow-lg transition-all hover:border-teal/50">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-navy">{account.name}</p>
                      <p className="text-xs text-text-secondary">{account.email}</p>
                    </div>
                    <span className="text-2xl">
                      {account.role === 'cdp' && '👨‍💼'}
                      {account.role === 'candidate' && '👤'}
                      {account.role === 'assessor' && '📋'}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          // Login form
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-navy">Connexion</h2>
              <button
                onClick={() => setRole(null)}
                className="text-sm text-teal hover:underline mt-2"
              >
                ← Retour
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="toi@example.com"
                  className="w-full px-4 py-2 rounded-lg border border-border-color bg-card-bg text-foreground placeholder-text-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-border-color bg-card-bg text-foreground placeholder-text-secondary"
                />
              </div>

              <Button variant="primary" className="w-full">
                Se connecter
              </Button>
            </form>

            <p className="text-xs text-text-secondary text-center mt-6">
              Demo mode — pas d'authentification réelle
            </p>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-text-secondary">
          <p>ATC Journey — Plateforme de Talent Management</p>
          <p className="mt-2">
            <a href="mailto:contact@authentictalent.fr" className="text-teal hover:underline">
              contact@authentictalent.fr
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
