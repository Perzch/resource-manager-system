import { UserInterface } from '@/types/type'
import type { LucideProps } from 'lucide-vue-next'
import type { FunctionalComponent } from 'vue'

type NavIcon = FunctionalComponent<LucideProps, Record<any, any>, any, Record<any, any>>

interface BaseNavItem {
  title: string
  icon?: NavIcon
}

export type NavItem
  = | BaseNavItem & {
    items: (BaseNavItem & { url?: string })[]
    url?: never
    isActive?: boolean
  } | BaseNavItem & {
    url: string
    items?: never
  }

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface User extends UserInterface {}

export interface Team {
  name: string
  logo: NavIcon
  plan: string
}

export interface SidebarData {
  user: User
  teams: Team[]
  navMain: NavGroup[]
}
