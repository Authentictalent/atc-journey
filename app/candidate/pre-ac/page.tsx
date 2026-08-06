'use client'

import { Card } from '@/app/components/Card'
import { Button, Progress } from '@/app/components/UI'

export default function PreACPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Bienvenue ! 👋</h1>
          <p className="text-text-secondary">Nous sommes ravis de t'accueillir pour ton Assessment Center avec Authentic Talent.</p>
        </div>

        {/* Progress */}
        <Card className="mb-8 bg-lime/5 border-lime/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-navy">Ta pré-AC</h2>
            <span className="text-sm text-text-secondary">À compléter avant le 10 avril</span>
          </div>
          <Progress items={[{ done: 0, total: 2 }]} />
        </Card>

        {/* Tasks */}
        <div className="space-y-4">
          {/* Hogan */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-navy">📋 Inventaires Hogan</h3>
                <p className="text-sm text-text-secondary mt-1">45-60 minutes</p>
              </div>
              <span className="text-2xl">0%</span>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Comprendre ta personnalité et tes motivations. Il n'y a pas de bonne ou mauvaise réponse.
            </p>
            <Button variant="secondary">Commencer →</Button>
          </Card>

          {/* Questionnaire Pré-AC */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-navy">📝 Questionnaire pré-AC</h3>
                <p className="text-sm text-text-secondary mt-1">30 minutes</p>
              </div>
              <span className="text-2xl">0%</span>
            </div>
            <p className="text-sm text-text-secondary mb-4">
              Tes expériences, tes réalisations et ta motivation pour ce poste.
            </p>
            <Button variant="secondary">Commencer →</Button>
          </Card>
        </div>

        {/* Tips */}
        <Card className="mt-8 bg-teal/5 border-teal/20">
          <h3 className="font-bold text-navy mb-4">💡 Conseils</h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>✓ Reste toi-même : l'objectif est de mieux te connaître</li>
            <li>✓ Prends ton temps : tu peux revenir à tout moment</li>
            <li>✓ Sois honnête : tes réponses nous aident à te conseiller au mieux</li>
            <li>✓ Besoin d'aide ? contact@authentictalent.fr</li>
          </ul>
        </Card>

        {/* Status */}
        <div className="mt-8 p-4 rounded-lg bg-background border border-border-color text-center">
          <p className="text-text-secondary">
            En attente de confirmation de date pour ton Assessment Center
          </p>
        </div>
      </div>
    </div>
  )
}
