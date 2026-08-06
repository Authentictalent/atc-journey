'use client'

import { Card } from '@/app/components/Card'
import { Button } from '@/app/components/UI'

export default function DebriefPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">🎉 Assessment Center complété !</h1>
          <p className="text-text-secondary">
            Merci Jean, tu as donné le meilleur de toi-même !
          </p>
        </div>

        {/* What's next */}
        <Card className="mb-8 bg-teal/5 border-teal/20">
          <h2 className="font-bold text-navy mb-4">Étapes suivantes</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="text-2xl">1️⃣</span>
              <div>
                <p className="font-medium text-navy">Analyse des données</p>
                <p className="text-sm text-text-secondary">
                  Nos experts analysent tes réponses et observations des assesseurs
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">2️⃣</span>
              <div>
                <p className="font-medium text-navy">Rapport personnalisé</p>
                <p className="text-sm text-text-secondary">
                  Tu recevras un rapport détaillé de tes forces et axes de développement
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-2xl">3️⃣</span>
              <div>
                <p className="font-medium text-navy">Débrief individuel</p>
                <p className="text-sm text-text-secondary">
                  Un échange avec notre Coach pour discuter de tes résultats (sous 10 jours)
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Feedback */}
        <Card className="mb-8">
          <h2 className="font-bold text-navy mb-4">Tes impressions</h2>
          <p className="text-sm text-text-secondary mb-4">
            Nous apprécierions tes retours sur l'expérience pour l'améliorer
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                As-tu appris quelque chose sur toi ?
              </label>
              <textarea
                placeholder="Tes pensées..."
                className="w-full px-4 py-2 rounded-lg border border-border-color bg-card-bg text-foreground placeholder-text-secondary"
                rows={3}
              />
            </div>
            <Button variant="secondary" className="w-full">
              Envoyer mon avis
            </Button>
          </div>
        </Card>

        {/* Summary */}
        <Card>
          <h2 className="font-bold text-navy mb-4">📋 Résumé de ta journée</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Durée totale</span>
              <span className="font-medium text-navy">3h 45 min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Exercices complétés</span>
              <span className="font-medium text-navy">4/4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Qualité des réponses</span>
              <span className="font-medium text-teal">Excellent</span>
            </div>
          </div>
        </Card>

        {/* Contact */}
        <div className="mt-8 p-4 rounded-lg bg-lime/5 border border-lime/20 text-center">
          <p className="text-sm text-text-secondary mb-3">
            Des questions en attendant ? Nous sommes là pour toi !
          </p>
          <a href="mailto:contact@authentictalent.fr" className="text-teal hover:underline font-medium">
            contact@authentictalent.fr
          </a>
        </div>
      </div>
    </div>
  )
}
