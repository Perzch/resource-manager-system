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

// 使用 computed 使 sidebarData 响应式
export const sidebarData = computed(() => ({
  teams,
  navMain: navData.value || [],
}) as SidebarData)
