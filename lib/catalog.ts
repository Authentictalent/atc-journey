import type { Format } from './types'

export type ExerciseKind = 'interview' | 'case' | 'roleplay' | 'presentation' | 'prep' | 'self' | 'break'

export interface CatalogExercise {
  id: string
  name: string
  kind: ExerciseKind
  defaultDuration: number
  /** Faux pour les exercices que le candidat réalise seul (préparations, études de cas, auto-positionnement, pause). */
  assessed: boolean
  pitch: string
  instructions: string[]
  objective: string
  materials: { name: string; size: string }[]
}

export const EXERCISES: CatalogExercise[] = [
  {
    id: 'cbi',
    name: 'CBI (Competency Based Interview)',
    kind: 'interview',
    defaultDuration: 10,
    assessed: true,
    pitch: 'Un échange sur des situations professionnelles que vous avez vécues.',
    instructions: [
      "L'assesseur vous interroge sur des situations concrètes que vous avez vécues.",
      'Décrivez le contexte, ce que vous avez fait personnellement et le résultat obtenu.',
      "Il n'y a pas de bonne réponse : la précision et l'authenticité comptent plus que la performance.",
    ],
    objective: 'Recueillir des preuves comportementales passées (méthode STAR) sur chaque compétence du référentiel.',
    materials: [
      { name: "Guide d'entretien CBI", size: '420 Ko' },
      { name: 'Grille de prise de notes', size: '180 Ko' },
    ],
  },
  {
    id: 'etude-bioethics',
    name: 'Étude de cas · Bioethics',
    kind: 'case',
    defaultDuration: 15,
    assessed: false,
    pitch: "Analyser la situation d'une entreprise et formuler vos recommandations.",
    instructions: [
      'Vous recevez le dossier Bioethics, qui présente une situation d’entreprise.',
      'Prenez connaissance des éléments et préparez vos recommandations.',
      'Priorisez : il est impossible de tout traiter, vos arbitrages font partie de l’exercice.',
    ],
    objective: "Évaluer l'analyse, la hiérarchisation des enjeux et la qualité des recommandations.",
    materials: [{ name: 'Dossier candidat · Bioethics', size: '1,1 Mo' }],
  },
  {
    id: 'etude-ecoseeds',
    name: 'Étude de cas · Ecoseeds',
    kind: 'case',
    defaultDuration: 20,
    assessed: false,
    pitch: "Analyser la situation d'une entreprise et formuler vos recommandations.",
    instructions: [
      'Vous recevez le dossier Ecoseeds, qui présente une situation d’entreprise.',
      'Prenez connaissance des éléments et préparez vos recommandations.',
      'Priorisez : il est impossible de tout traiter, vos arbitrages font partie de l’exercice.',
    ],
    objective: "Évaluer l'analyse, la hiérarchisation des enjeux et la qualité des recommandations.",
    materials: [{ name: 'Dossier candidat · Ecoseeds', size: '1,3 Mo' }],
  },
  {
    id: 'presentation',
    name: 'Présentation stratégique',
    kind: 'presentation',
    defaultDuration: 30,
    assessed: true,
    pitch: 'Présenter une vision et la défendre face aux assesseurs.',
    instructions: [
      'Vous présentez votre vision sur le sujet transmis.',
      'Les assesseurs vous posent ensuite leurs questions.',
      'Le support est libre : quelques slides ou une présentation orale suffisent.',
    ],
    objective: "Évaluer la clarté, la hauteur de vue, l'impact et la solidité face à la contradiction.",
    materials: [{ name: 'Sujet de présentation', size: '190 Ko' }],
  },
  {
    id: 'prep-manager',
    name: 'Préparation jeu de rôle managérial',
    kind: 'prep',
    defaultDuration: 45,
    assessed: false,
    pitch: 'Prendre connaissance du contexte avant un échange avec un collaborateur.',
    instructions: [
      'Vous recevez le contexte d’une situation managériale.',
      'Préparez l’échange que vous aurez ensuite avec un collaborateur, joué par un assesseur.',
      'Notez vos objectifs et la façon dont vous souhaitez mener la conversation.',
    ],
    objective: 'Temps de préparation individuel, sans observation.',
    materials: [{ name: 'Fiche contexte · jeu de rôle managérial', size: '150 Ko' }],
  },
  {
    id: 'prep-influence',
    name: 'Préparation jeu de rôle influence',
    kind: 'prep',
    defaultDuration: 75,
    assessed: false,
    pitch: 'Préparer un échange où il faudra convaincre un interlocuteur.',
    instructions: [
      'Vous recevez le contexte d’une situation d’influence.',
      'Préparez vos arguments et votre stratégie pour l’échange qui suit.',
      'Anticipez les objections de votre interlocuteur.',
    ],
    objective: 'Temps de préparation individuel, sans observation.',
    materials: [{ name: 'Fiche contexte · jeu de rôle influence', size: '170 Ko' }],
  },
  {
    id: 'jeu-role',
    name: 'Jeu de rôle',
    kind: 'roleplay',
    defaultDuration: 30,
    assessed: true,
    pitch: 'Un échange en situation, avec un interlocuteur joué par un assesseur.',
    instructions: [
      'Vous menez l’échange que vous avez préparé, avec un assesseur dans le rôle de votre interlocuteur.',
      'Comportez-vous comme vous le feriez réellement dans votre rôle.',
      'L’assesseur observe la manière dont vous conduisez la conversation.',
    ],
    objective: "Observer l'écoute, l'assertivité, la gestion émotionnelle et la capacité à engager ou à convaincre.",
    materials: [{ name: 'Brief du rôle joué', size: '240 Ko' }],
  },
  {
    id: 'entretien-hogan',
    name: 'Entretien Hogan',
    kind: 'interview',
    defaultDuration: 90,
    assessed: true,
    pitch: 'Un échange approfondi à partir de vos résultats Hogan.',
    instructions: [
      'L’assesseur s’appuie sur vos inventaires Hogan pour explorer votre fonctionnement.',
      'C’est un moment d’échange : vos exemples et votre regard comptent autant que les résultats.',
      'Prenez le temps de nuancer et d’illustrer vos réponses.',
    ],
    objective: 'Confronter les résultats Hogan aux comportements observés et au parcours du participant.',
    materials: [{ name: 'Rapports Hogan du participant', size: 'Plateforme Hogan' }],
  },
  {
    id: 'auto-positionnement',
    name: 'Auto-positionnement',
    kind: 'self',
    defaultDuration: 45,
    assessed: false,
    pitch: 'Évaluer vous-même vos compétences.',
    instructions: [
      'Vous vous positionnez sur chacune des compétences du référentiel.',
      'Appuyez-vous sur des situations concrètes pour chaque appréciation.',
      'Soyez juste : cet exercice nourrit l’échange de feedback.',
    ],
    objective: 'Recueillir la perception du participant sur ses propres compétences.',
    materials: [{ name: "Grille d'auto-positionnement", size: '120 Ko' }],
  },
  {
    id: 'pause',
    name: 'Pause',
    kind: 'break',
    defaultDuration: 15,
    assessed: false,
    pitch: 'Un temps pour souffler.',
    instructions: ['Profitez-en pour vous déconnecter. La suite de votre programme apparaîtra au retour.'],
    objective: '',
    materials: [],
  },
]

export const exerciseById = (id: string) => EXERCISES.find((e) => e.id === id) ?? EXERCISES[0]

/** Durées proposées pour tous les exercices. */
export const DURATION_CHOICES = [10, 15, 20, 25, 30, 45, 60, 75, 90, 105, 120]

/** L'AC Light est un Entretien Hogan seul, de 1 h 30 ou 2 h. */
export const LIGHT_DURATIONS = [90, 120]

export interface FormatPreset {
  label: string
  length: string
  description: string
  defaultExercises: { catalogId: string; duration?: number }[]
  minSeconds: number
  features: { preQuestionnaire: boolean; postQuestionnaire: boolean; grid: boolean; feedback: boolean }
}

export const FORMATS: Record<Format, FormatPreset> = {
  light: {
    label: 'Light',
    length: '1 h 30 ou 2 h',
    description: 'Un Entretien Hogan approfondi, mené par un assesseur.',
    defaultExercises: [{ catalogId: 'entretien-hogan', duration: 90 }],
    minSeconds: 0,
    features: { preQuestionnaire: false, postQuestionnaire: false, grid: false, feedback: false },
  },
  robuste: {
    label: 'Robuste',
    length: 'Demi-journée',
    description: 'Plusieurs mises en situation, un lead et un second assesseur, une grille comportementale.',
    defaultExercises: [{ catalogId: 'cbi', duration: 45 }, { catalogId: 'etude-bioethics' }, { catalogId: 'prep-manager' }, { catalogId: 'jeu-role' }],
    minSeconds: 1,
    features: { preQuestionnaire: true, postQuestionnaire: true, grid: true, feedback: true },
  },
  premium: {
    label: 'Premium',
    length: 'Journée complète',
    description: 'Le dispositif complet : mises en situation variées, équipe d’assesseurs, restitution approfondie.',
    defaultExercises: [
      { catalogId: 'auto-positionnement' },
      { catalogId: 'cbi', duration: 60 },
      { catalogId: 'etude-ecoseeds' },
      { catalogId: 'presentation' },
      { catalogId: 'pause' },
      { catalogId: 'prep-influence' },
      { catalogId: 'jeu-role' },
      { catalogId: 'entretien-hogan' },
    ],
    minSeconds: 2,
    features: { preQuestionnaire: true, postQuestionnaire: true, grid: true, feedback: true },
  },
}

export interface Competency {
  id: string
  name: string
  definition: string
  anchors: { low: string; mid: string; high: string }
}

export const COMPETENCIES: Competency[] = [
  {
    id: 'vision',
    name: 'Vision stratégique',
    definition: 'Prend de la hauteur, relie les enjeux et projette son périmètre dans le temps.',
    anchors: {
      low: 'Reste centré sur l’opérationnel immédiat, peine à dégager des priorités.',
      mid: 'Identifie les enjeux clés et propose une direction cohérente.',
      high: 'Articule une vision claire, anticipe les ruptures et embarque autour d’un cap.',
    },
  },
  {
    id: 'leadership',
    name: "Leadership d'équipe",
    definition: 'Mobilise, responsabilise et fait grandir ses équipes.',
    anchors: {
      low: 'Dirige de façon directive ou en retrait, mobilise peu.',
      mid: 'Fixe le cadre, délègue et soutient ses collaborateurs.',
      high: 'Crée l’engagement, développe l’autonomie et incarne l’exemple.',
    },
  },
  {
    id: 'resultats',
    name: 'Orientation résultats',
    definition: 'Se fixe des objectifs exigeants et les tient.',
    anchors: {
      low: 'Objectifs flous, suivi irrégulier des engagements.',
      mid: 'Fixe des objectifs clairs et pilote leur atteinte.',
      high: 'Vise haut, sécurise les résultats et ajuste vite face aux écarts.',
    },
  },
  {
    id: 'influence',
    name: 'Communication & influence',
    definition: "Convainc, adapte son discours et construit des alliances.",
    anchors: {
      low: 'Message peu structuré, difficulté à convaincre.',
      mid: 'S’exprime clairement et argumente de façon adaptée.',
      high: 'Influence avec finesse, fédère des interlocuteurs aux intérêts divergents.',
    },
  },
  {
    id: 'agilite',
    name: 'Agilité & conduite du changement',
    definition: "S'adapte à l'incertitude et accompagne la transformation.",
    anchors: {
      low: "Résiste au changement ou s'y adapte difficilement.",
      mid: 'Accepte le changement et l’accompagne auprès de ses équipes.',
      high: 'Initie la transformation et en fait une opportunité collective.',
    },
  },
  {
    id: 'decision',
    name: 'Prise de décision',
    definition: 'Tranche avec discernement, y compris en situation ambiguë.',
    anchors: {
      low: 'Repousse les décisions ou tranche sans analyse.',
      mid: 'Décide à partir des informations disponibles, assume ses choix.',
      high: 'Décide vite et juste en contexte incertain, explique ses arbitrages.',
    },
  },
]

export const competencyById = (id: string) => COMPETENCIES.find((c) => c.id === id)!

export const SCALE = [
  { value: 1, label: 'Insuffisant' },
  { value: 2, label: 'À développer' },
  { value: 3, label: 'Conforme' },
  { value: 4, label: 'Solide' },
  { value: 5, label: 'Remarquable' },
]

export const PRE_QUESTIONS = [
  { id: 'parcours', label: 'En quelques lignes, comment résumeriez-vous votre parcours ?' },
  { id: 'reussite', label: 'Quelle est la réalisation professionnelle dont vous êtes le plus fier ou la plus fière ?' },
  { id: 'motivation', label: 'Qu’est-ce qui vous motive dans cette démarche ?' },
  { id: 'attentes', label: 'Qu’attendez-vous de cette journée ?' },
  { id: 'contexte', label: 'Y a-t-il un élément de contexte que nous devrions connaître ? (facultatif)', optional: true },
]

export const POST_QUESTIONS = [
  { id: 'organisation', label: 'Organisation et clarté des informations', kind: 'rating' as const },
  { id: 'exercices', label: 'Pertinence des mises en situation', kind: 'rating' as const },
  { id: 'assesseurs', label: 'Qualité de la relation avec les assesseurs', kind: 'rating' as const },
  { id: 'ressenti', label: 'Comment vous êtes-vous senti·e pendant la journée ?', kind: 'text' as const },
  { id: 'suggestion', label: 'Une suggestion pour améliorer l’expérience ? (facultatif)', kind: 'text' as const, optional: true },
]
