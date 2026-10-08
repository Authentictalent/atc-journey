import type { Format } from './types'

export type ExerciseKind = 'interview' | 'case' | 'roleplay' | 'presentation' | 'inbox' | 'group' | 'break'

export interface CatalogExercise {
  id: string
  name: string
  kind: ExerciseKind
  defaultDuration: number
  pitch: string
  instructions: string[]
  objective: string
  materials: { name: string; size: string }[]
}

export const EXERCISES: CatalogExercise[] = [
  {
    id: 'entretien',
    name: 'Entretien structuré par compétences',
    kind: 'interview',
    defaultDuration: 60,
    pitch: 'Un échange approfondi sur votre parcours et des situations professionnelles vécues.',
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
    id: 'etude-cas',
    name: 'Étude de cas',
    kind: 'case',
    defaultDuration: 75,
    pitch: "Analyser une situation d'entreprise et formuler des recommandations.",
    instructions: [
      'Vous recevez un dossier présentant une situation d’entreprise fictive.',
      '45 minutes de préparation individuelle, puis 30 minutes de restitution à l’assesseur.',
      'Priorisez : il est impossible de tout traiter, vos arbitrages font partie de l’exercice.',
    ],
    objective: "Évaluer l'analyse, la hiérarchisation des enjeux, la vision et la qualité des recommandations.",
    materials: [
      { name: 'Dossier candidat · Cas Nova Industries', size: '1,2 Mo' },
      { name: 'Corrigé et pistes attendues', size: '610 Ko' },
    ],
  },
  {
    id: 'jeu-role',
    name: 'Jeu de rôle managérial',
    kind: 'roleplay',
    defaultDuration: 30,
    pitch: 'Une conversation délicate avec un collaborateur, jouée par un assesseur.',
    instructions: [
      'Vous disposez de 10 minutes pour prendre connaissance du contexte.',
      "Puis 20 minutes d'échange avec un collaborateur, joué par l'un de nos assesseurs.",
      'Comportez-vous comme vous le feriez réellement dans votre rôle de manager.',
    ],
    objective: "Observer l'écoute, l'assertivité, la gestion émotionnelle et la capacité à engager.",
    materials: [
      { name: 'Brief du rôle joué', size: '240 Ko' },
      { name: 'Fiche contexte candidat', size: '150 Ko' },
    ],
  },
  {
    id: 'presentation',
    name: 'Présentation stratégique',
    kind: 'presentation',
    defaultDuration: 30,
    pitch: 'Présenter une vision et la défendre face à un comité.',
    instructions: [
      'Vous présentez votre vision sur le sujet transmis, en 15 minutes maximum.',
      "Suivent 15 minutes de questions de la part du comité d'assesseurs.",
      'Le support est libre : quelques slides ou une présentation orale suffisent.',
    ],
    objective: "Évaluer la clarté, la hauteur de vue, l'impact et la solidité face à la contradiction.",
    materials: [{ name: 'Sujet de présentation', size: '190 Ko' }],
  },
  {
    id: 'in-basket',
    name: 'In-basket',
    kind: 'inbox',
    defaultDuration: 45,
    pitch: 'Traiter une boîte de réception chargée et arbitrer les priorités.',
    instructions: [
      'Vous prenez la place d’un dirigeant de retour de congés, face à sa boîte de réception.',
      'Traitez les messages : répondre, déléguer, planifier ou écarter, en justifiant vos choix.',
      'Le temps est volontairement court.',
    ],
    objective: 'Mesurer la priorisation, la délégation, le sens politique et la gestion du temps.',
    materials: [
      { name: 'Boîte de réception · 18 messages', size: '880 Ko' },
      { name: 'Grille de correction', size: '320 Ko' },
    ],
  },
  {
    id: 'groupe',
    name: 'Exercice de groupe',
    kind: 'group',
    defaultDuration: 45,
    pitch: 'Construire une décision commune avec les autres participants.',
    instructions: [
      'Vous travaillez avec les autres participants sur une problématique commune.',
      'Chacun dispose d’informations propres, à partager pour aboutir à une décision collective.',
      "L'objectif n'est pas de « gagner » mais d'aboutir ensemble.",
    ],
    objective: "Observer la coopération, l'influence, la contribution et la gestion des désaccords.",
    materials: [{ name: 'Fiches de rôles · 6 participants', size: '540 Ko' }],
  },
  {
    id: 'pause',
    name: 'Pause déjeuner',
    kind: 'break',
    defaultDuration: 60,
    pitch: 'Un temps pour souffler.',
    instructions: ['Profitez-en pour vous déconnecter. La suite de votre programme apparaîtra au retour.'],
    objective: '',
    materials: [],
  },
]

export const exerciseById = (id: string) => EXERCISES.find((e) => e.id === id)!

export interface FormatPreset {
  label: string
  length: string
  description: string
  defaultExercises: { catalogId: string; duration?: number }[]
  minSeconds: number
  features: { preQuestionnaire: boolean; postQuestionnaire: boolean; grid: boolean; feedback: boolean }
}

export const LIGHT_DURATIONS = [90, 120]

export const FORMATS: Record<Format, FormatPreset> = {
  light: {
    label: 'Light',
    length: '1 h 30 ou 2 h',
    description: 'Un entretien approfondi mené par un assesseur, appuyé sur le Hogan.',
    defaultExercises: [{ catalogId: 'entretien', duration: 90 }],
    minSeconds: 0,
    features: { preQuestionnaire: false, postQuestionnaire: false, grid: false, feedback: false },
  },
  robuste: {
    label: 'Robuste',
    length: 'Demi-journée',
    description: 'Plusieurs mises en situation, un lead et un second assesseur, une grille comportementale.',
    defaultExercises: [{ catalogId: 'entretien' }, { catalogId: 'etude-cas' }, { catalogId: 'jeu-role' }],
    minSeconds: 1,
    features: { preQuestionnaire: true, postQuestionnaire: true, grid: true, feedback: true },
  },
  premium: {
    label: 'Premium',
    length: 'Journée complète',
    description: 'Le dispositif complet : mises en situation variées, équipe d’assesseurs, restitution approfondie.',
    defaultExercises: [
      { catalogId: 'entretien' },
      { catalogId: 'in-basket' },
      { catalogId: 'etude-cas' },
      { catalogId: 'pause' },
      { catalogId: 'jeu-role' },
      { catalogId: 'presentation' },
      { catalogId: 'groupe' },
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
