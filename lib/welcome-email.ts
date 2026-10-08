import { fmtDuration } from './dates'
import { features } from './project'
import { wording } from './wording'
import type { Participant, Project, User } from './types'

export function welcomeEmail(project: Project, p: Participant, cdp: User | undefined, loginUrl: string) {
  const w = wording(project.purpose)
  const f = features(project)
  const assessmentLower = w.assessment.toLowerCase()

  const context =
    project.purpose === 'AC'
      ? `Dans le cadre de votre candidature au poste de ${project.position}, ${project.client} a choisi de vous faire vivre un ${assessmentLower} avec Authentic Talent Consulting.`
      : `Dans le cadre de « ${project.position} », ${project.client} vous propose un ${assessmentLower} accompagné par Authentic Talent Consulting.`

  const day =
    project.format === 'light'
      ? `un entretien approfondi de ${fmtDuration(project.exercises[0]?.duration ?? 90)} avec l’un de nos assesseurs`
      : project.format === 'robuste'
        ? 'une demi-journée de mises en situation professionnelles'
        : 'une journée complète de mises en situation professionnelles'

  const where =
    project.venue.mode === 'teams'
      ? 'à distance, sur Microsoft Teams (le lien vous attendra dans votre espace)'
      : project.venue.address
        ? `en présentiel, ${project.venue.address}`
        : 'en présentiel, à une adresse que nous vous préciserons'

  const steps = [
    `Vous vous connectez à votre espace ATC Journey : ${loginUrl}`,
    'Vous choisissez la date de votre journée parmi les créneaux proposés. Si aucun ne vous convient, vous pouvez en suggérer d’autres directement depuis votre espace.',
    f.preQuestionnaire
      ? 'Vous complétez vos inventaires de personnalité Hogan (45 à 60 minutes) et un court questionnaire de présentation (environ 20 minutes).'
      : 'Vous complétez vos inventaires de personnalité Hogan (45 à 60 minutes).',
    `Le jour J, vous vivez ${day}, ${where}.`,
    ...(f.feedback ? ['Un temps de feedback personnalisé vous est ensuite proposé.'] : []),
  ]

  const subject = `${project.client} · Votre ${assessmentLower} avec Authentic Talent`

  const body = [
    `Bonjour ${p.firstName},`,
    '',
    context,
    'Je serai votre contact privilégié tout au long de ce parcours.',
    '',
    'Voici comment cela va se passer :',
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    '',
    'Vous retrouverez dans votre espace toutes les informations pratiques, au fil des étapes.',
    '',
    'Je reste à votre disposition pour toute question.',
    '',
    'Bien cordialement,',
    cdp?.name ?? '',
    cdp ? `${cdp.title} · Authentic Talent Consulting` : 'Authentic Talent Consulting',
  ]
    .filter((line, i, all) => !(line === '' && all[i - 1] === ''))
    .join('\n')

  return { subject, body }
}
