import type { Purpose } from './types'

export function wording(purpose: Purpose) {
  return purpose === 'AC'
    ? {
        short: 'AC',
        participant: 'Candidat',
        participants: 'Candidats',
        assessment: 'Assessment de sélection',
        center: 'Assessment Center',
        pre: 'Pré-AC',
        post: 'Post-AC',
      }
    : {
        short: 'DC',
        participant: 'Bénéficiaire',
        participants: 'Bénéficiaires',
        assessment: 'Assessment de développement',
        center: 'Development Center',
        pre: 'Pré-DC',
        post: 'Post-DC',
      }
}
