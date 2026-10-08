'use client'

import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { daysBetween, todayISO } from './dates'
import { buildSeed, shiftDemo } from './seed'
import type { AppState, Assessor, Feedback, GridEntry, Participant, Project, Session, User } from './types'

const STORAGE_KEY = 'atc-journey-demo-v3'

type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'reset' }
  | { type: 'signIn'; session: Session }
  | { type: 'signOut' }
  | { type: 'addUser'; user: User }
  | { type: 'updateUser'; id: string; patch: Partial<User> }
  | { type: 'addAssessor'; assessor: Assessor }
  | { type: 'updateAssessor'; id: string; patch: Partial<Assessor> }
  | { type: 'createProject'; project: Project; participants: Participant[] }
  | { type: 'updateProject'; id: string; patch: Partial<Project> }
  | { type: 'addParticipant'; participant: Participant }
  | { type: 'removeParticipant'; id: string }
  | { type: 'updateParticipant'; id: string; patch: Partial<Participant> }
  | { type: 'setFeedback'; id: string; feedback: Feedback }
  | { type: 'saveNote'; key: string; text: string }
  | { type: 'setGrid'; key: string; entry: GridEntry }
  | { type: 'toggleCheck'; key: string }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
      return action.state
    case 'reset':
      return { ...buildSeed(), session: state.session }
    case 'signIn':
      return { ...state, session: action.session }
    case 'signOut':
      return { ...state, session: null }
    case 'addUser':
      return { ...state, users: [...state.users, action.user] }
    case 'updateUser':
      return { ...state, users: state.users.map((u) => (u.id === action.id ? { ...u, ...action.patch } : u)) }
    case 'addAssessor':
      return { ...state, assessors: [...state.assessors, action.assessor] }
    case 'updateAssessor':
      return { ...state, assessors: state.assessors.map((a) => (a.id === action.id ? { ...a, ...action.patch } : a)) }
    case 'createProject':
      return {
        ...state,
        projects: [action.project, ...state.projects],
        participants: [...state.participants, ...action.participants],
      }
    case 'updateProject':
      return { ...state, projects: state.projects.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)) }
    case 'addParticipant':
      return { ...state, participants: [...state.participants, action.participant] }
    case 'removeParticipant':
      return { ...state, participants: state.participants.filter((p) => p.id !== action.id) }
    case 'updateParticipant':
      return {
        ...state,
        participants: state.participants.map((p) => (p.id === action.id ? { ...p, ...action.patch } : p)),
      }
    case 'setFeedback':
      return {
        ...state,
        participants: state.participants.map((p) => (p.id === action.id ? { ...p, feedback: action.feedback } : p)),
      }
    case 'saveNote':
      return { ...state, notes: { ...state.notes, [action.key]: { text: action.text, updatedAt: new Date().toISOString() } } }
    case 'setGrid':
      return { ...state, grid: { ...state.grid, [action.key]: action.entry } }
    case 'toggleCheck':
      return { ...state, checklist: { ...state.checklist, [action.key]: !state.checklist[action.key] } }
  }
}

interface Internal {
  app: AppState
  hydrated: boolean
}

function outer(state: Internal, action: Action): Internal {
  if (action.type === 'hydrate') return { app: action.state, hydrated: true }
  return { ...state, app: reducer(state.app, action) }
}

interface Ctx {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const StoreContext = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [{ app: state, hydrated }, dispatch] = useReducer(outer, undefined, () => ({ app: buildSeed(), hydrated: false }))

  useEffect(() => {
    let restored = buildSeed()
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as AppState
        restored = shiftDemo(saved, daysBetween(saved.seededOn, todayISO()))
      }
    } catch {
      // stockage indisponible : la démo repart des données initiales
    }
    dispatch({ type: 'hydrate', state: restored })
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // stockage plein ou bloqué : la démo reste utilisable en mémoire
    }
  }, [state, hydrated])

  const value = useMemo(() => ({ state, dispatch }), [state])

  if (!hydrated) return <div className="min-h-screen bg-cream" />
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore doit être utilisé dans StoreProvider')
  return ctx
}

export const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`
