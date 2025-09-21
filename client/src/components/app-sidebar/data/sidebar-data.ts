import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from 'lucide-vue-next'

import { useSidebar } from '@/composables/use-sidebar'

import type { SidebarData, Team } from '../types'

const teams: Team[] = [
  {
    name: 'Acme Inc',
    logo: GalleryVerticalEnd,
    plan: 'Enterprise',
  },
  {
    name: 'Acme Corp.',
    logo: AudioWaveform,
    plan: 'Startup',
  },
  {
    name: 'Evil Corp.',
    logo: Command,
    plan: 'Free',
  },
]

const { navData } = useSidebar()

export const sidebarData: SidebarData = {
  teams,
  navMain: navData.value!,
}
