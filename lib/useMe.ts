'use client'

import { useStore } from './store'
import { features } from './project'
import { wording } from './wording'

export function useMe() {
  const { state, dispatch } = useStore()
  const participant = state.participants.find((p) => p.id === state.session?.participantId)
  const project = state.projects.find((p) => p.id === participant?.projectId)
  if (!participant || !project) return null
  return { state, dispatch, participant, project, w: wording(project.purpose), f: features(project) }
}
