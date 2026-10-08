'use client'

import { useStore } from './store'
import { features } from './project'
import { wording } from './wording'

export function useMe() {
  const { state, dispatch } = useStore()
  const participant = state.participants.find((p) => p.id === state.session?.participantId)
  const project = state.projects.find((p) => p.id === participant?.projectId)
  if (!participant || !project) return null
  const cdp = state.users.find((u) => u.id === project.cdpId)
  return { state, dispatch, participant, project, cdp, w: wording(project.purpose), f: features(project) }
}
