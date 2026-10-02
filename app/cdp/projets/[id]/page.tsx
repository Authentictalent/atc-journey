'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Eye } from 'lucide-react'
import { useStore } from '@/lib/store'
import { fmtDate } from '@/lib/dates'
import { FORMATS } from '@/lib/catalog'
import { phaseOf, projectParticipants } from '@/lib/project'
import { wording } from '@/lib/wording'
import { ButtonLink, EmptyState, FormatPill, PageHeader, PurposePill, Tabs } from '@/components/ui'
import { OverviewTab } from '@/components/cdp/OverviewTab'
import { ParticipantsTab } from '@/components/cdp/ParticipantsTab'
import { PlanningTab } from '@/components/cdp/PlanningTab'
import { TeamTab } from '@/components/cdp/TeamTab'

type Tab = 'overview' | 'participants' | 'planning' | 'team'

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const search = useSearchParams()
  const router = useRouter()
  const { state } = useStore()
  const project = state.projects.find((p) => p.id === id)

  if (!project)
    return (
      <div className="mx-auto max-w-3xl px-4 pt-16">
        <EmptyState icon={<Eye size={20} />} title="Dispositif introuvable">
          Il a peut-être été supprimé lors d’une réinitialisation de la démo.
        </EmptyState>
      </div>
    )

  const participants = projectParticipants(state, project.id)
  const w = wording(project.purpose)
  const tab = (search.get('onglet') as Tab) || 'overview'
  const setTab = (t: Tab) => router.replace(`/cdp/projets/${project.id}${t === 'overview' ? '' : `?onglet=${t}`}`, { scroll: false })
  const team = [project.leadAssessorId, ...project.secondAssessorIds].filter(Boolean).length

  return (
    <>
      <PageHeader
        back={{ href: '/cdp', label: 'Tous les dispositifs' }}
        eyebrow={`${w.center} · ${FORMATS[project.format].label} · ${phaseOf(project, participants) === 'jour-j' ? 'Jour J' : fmtDate(project.date, false)}`}
        tone="lime"
        title={project.client}
        description={
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1">{project.position}</span>
            <FormatPill format={project.format} />
            <PurposePill purpose={project.purpose} />
          </div>
        }
        actions={
          <ButtonLink href={`/commanditaire?projet=${project.id}`} variant="outline" size="sm">
            <Eye size={14} /> Vue commanditaire
          </ButtonLink>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Tabs<Tab>
          value={tab}
          onChange={setTab}
          tabs={[
            { id: 'overview', label: "Vue d'ensemble" },
            { id: 'participants', label: w.participants, count: participants.length },
            { id: 'planning', label: 'Planning', count: project.exercises.length },
            { id: 'team', label: 'Équipe', count: team },
          ]}
        />
        <div className="pt-8">
          {tab === 'overview' && <OverviewTab project={project} participants={participants} onTab={setTab} />}
          {tab === 'participants' && <ParticipantsTab project={project} participants={participants} />}
          {tab === 'planning' && <PlanningTab project={project} />}
          {tab === 'team' && <TeamTab project={project} />}
        </div>
      </div>
    </>
  )
}
