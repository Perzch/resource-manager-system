import { Award, BadgeDollarSign, Handshake, Shield } from 'lucide-vue-next'
import { h } from 'vue'

import type { FacetedFilterOption } from '@/components/data-table/types'

import { PermissionEnum } from '@/enums/global'

export const callTypes: (FacetedFilterOption & { style: string })[] = [
  {
    label: 'Active',
    value: true,
    style: 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200',
  },
  {
    label: 'Inactive',
    value: false,
    style: 'bg-neutral-300/40 border-neutral-300',
  },
]

export const userTypes: FacetedFilterOption[] = [
  {
    label: 'ADMIN',
    value: PermissionEnum.ADMIN,
    icon: h(BadgeDollarSign),
  },
  {
    label: 'MANAGER',
    value: PermissionEnum.MANAGE,
    icon: h(Handshake),
  },
  {
    label: 'EDITOR',
    value: PermissionEnum.UPDATE,
    icon: h(Shield),
  },
  {
    label: 'BASE',
    value: PermissionEnum.BASE,
    icon: h(Shield),
  },
  {
    label: 'WRITER',
    value: PermissionEnum.WRITE,
    icon: h(Handshake),
  },
  {
    label: 'READER',
    value: PermissionEnum.READ,
    icon: h(Award),
  },
] as const
