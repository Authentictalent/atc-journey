import { fmtDate, fmtDuration, fmtTime } from './dates'
import { features } from './project'
import { wording } from './wording'
import type { Participant, Project, User } from './types'

function formatPhrase(project: Project) {
  if (project.format === 'light') return `d’un entretien de ${fmtDuration(project.exercises[0]?.duration ?? 90)}`
  return project.format === 'robuste' ? 'd’une demi-journée d’évaluation' : 'd’une journée complète d’évaluation'
}

function signature(cdp: User | undefined) {
  return cdp ? [cdp.name, `${cdp.title} · Authentic Talent Consulting`, cdp.email] : ['Authentic Talent Consulting']
}

/** Mail de bienvenue, à copier dans Outlook par la cheffe de projet. */
export function welcomeEmail(project: Project, p: Participant, cdp: User | undefined, loginUrl: string) {
  const w = wording(project.purpose)
  const f = features(project)
  const first = cdp?.name.split(' ')[0]
  const role = cdp?.title.toLowerCase() ?? 'cheffe de projet'
  const teams = project.venue.mode === 'teams'

  const intro = first
    ? `Je suis ${first}, ${role} chez Authentic Talent, et j’aurai le plaisir de vous accompagner tout au long de votre ${w.center}.`
    : `Authentic Talent aura le plaisir de vous accompagner tout au long de votre ${w.center}.`

  const why =
    project.purpose === 'AC'
      ? `Il s’inscrit dans le cadre de votre candidature au poste de ${project.position} chez ${project.client}.`
      : `Il s’inscrit dans le cadre de « ${project.position} », proposé par ${project.client}.`

  const where = teams
    ? `Il se déroulera à distance, sur Microsoft Teams, sous la forme ${formatPhrase(project)}.`
    : project.venue.address
      ? `Il se déroulera en présentiel, ${project.venue.address}, sous la forme ${formatPhrase(project)}.`
      : `Il se déroulera en présentiel, sous la forme ${formatPhrase(project)} ; je vous préciserai l’adresse très prochainement.`

  const date =
    p.slot.status === 'confirmed' && p.slot.confirmed
      ? `Il est prévu le ${fmtDate(p.slot.confirmed.date)} à ${fmtTime(p.slot.confirmed.time)}.`
      : p.slot.status === 'proposed'
        ? 'Pour bloquer la date, je vous propose plusieurs créneaux dans votre espace personnel ATC Journey. Il vous suffit de choisir celui qui vous convient ; si aucun ne vous convient, vous pourrez m’indiquer d’autres disponibilités directement depuis votre espace.'
        : 'Pour bloquer la date, je vous proposerai très prochainement plusieurs créneaux dans votre espace personnel ATC Journey. Vous pourrez choisir celui qui vous convient, ou m’indiquer d’autres disponibilités.'

  const prep = [
    'Pour préparer cette rencontre, nous vous invitons à réaliser en amont :',
    `• Vos inventaires Hogan (environ 45 minutes). Vous trouverez votre invitation en pièce jointe. Nous vous conseillons de les réaliser dans un endroit calme, sans interruption, au plus tard 48 heures avant votre ${w.center}.`,
    ...(f.preQuestionnaire
      ? ['• Le questionnaire de pré-assessment, directement dans votre espace (environ 20 minutes). Il nous permettra de mieux connaître votre parcours et de préparer nos échanges.']
      : []),
  ]

  const dayJ = teams
    ? 'Le jour J, je vous invite à vous connecter 10 minutes avant le début de la session, avec le lien Teams disponible dans votre espace. Installez-vous dans un endroit calme, avec une bonne connexion, et testez votre caméra et votre micro la veille. Prévoyez un stylo et quelques feuilles de brouillon.'
    : 'Le jour J, je vous invite à arriver 15 minutes avant le début de la session, afin de vous installer tranquillement. Prévoyez un stylo et quelques feuilles de brouillon, ainsi que vos lunettes de lecture si vous en utilisez. De l’eau sera à votre disposition sur place.'

  const focus =
    project.format === 'light'
      ? 'Cet entretien demandera toute votre attention : je vous recommande de prévoir ce créneau sans appels ni réunions professionnelles.'
      : `La ${project.format === 'robuste' ? 'demi-journée' : 'journée'} comprendra plusieurs exercices et échanges qui demanderont toute votre attention. Je vous recommande donc de prévoir ce créneau sans appels ni réunions professionnelles.`

  const body = [
    `Bonjour ${p.firstName},`,
    '',
    `${intro} ${why}`,
    '',
    `${where} ${date}`,
    '',
    `Votre espace ATC Journey réunit toutes les informations de votre parcours : votre date, les étapes de préparation, votre programme le jour J${f.feedback ? ', puis votre feedback' : ''}. Vous pouvez vous y connecter dès maintenant avec cette adresse email :`,
    loginUrl,
    '',
    ...prep,
    '',
    dayJ,
    '',
    focus,
    '',
    'Si vous devez annuler ou reporter, merci de me prévenir au moins 48 heures à l’avance.',
    '',
    'Je reste bien sûr à votre disposition si vous avez la moindre question. Au plaisir de vous rencontrer prochainement !',
    '',
    'Belle journée,',
    ...signature(cdp),
  ].join('\n')

  return { subject: `Votre ${w.center} avec Authentic Talent · ${project.client}`, body }
}

/** Relance courte quand le candidat n'a pas encore choisi sa date. */
export function dateReminderEmail(project: Project, p: Participant, cdp: User | undefined, loginUrl: string) {
  const w = wording(project.purpose)
  const body = [
    `Bonjour ${p.firstName},`,
    '',
    `Je me permets de revenir vers vous au sujet de votre ${w.center}. Plusieurs créneaux vous attendent dans votre espace ATC Journey : il vous suffit de choisir celui qui vous convient.`,
    '',
    'Si aucun ne vous convient, vous pouvez m’indiquer d’autres disponibilités directement depuis votre espace :',
    loginUrl,
    '',
    'Je reste à votre disposition pour toute question.',
    '',
    'Belle journée,',
    ...signature(cdp),
  ].join('\n')
  return { subject: `Votre ${w.center} · choix de votre date`, body }
}
