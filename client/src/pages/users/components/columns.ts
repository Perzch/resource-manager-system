import type { ColumnDef } from '@tanstack/vue-table'

import { h } from 'vue'
import { toast } from 'vue-sonner'

import type { UserInterface } from '@/types/type'

import DataTableColumnHeader from '@/components/data-table/column-header.vue'
import { SelectColumn } from '@/components/data-table/table-columns'
import UiAvatar from '@/components/ui/avatar/Avatar.vue'
import UiAvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import UiAvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useGetUsersQuery, useUpdateUserMutation } from '@/services/api/users.api'
import env from '@/utils/env'

import { callTypes, userTypes } from '../data/data'
import DataTableRowActions from './data-table-row-actions.vue'

export const columns: ColumnDef<UserInterface>[] = [
  SelectColumn as ColumnDef<UserInterface>,
  {
    accessorKey: 'username',
    header: ({ column }) => h(DataTableColumnHeader<UserInterface>, { column, title: 'User' }),
    cell: ({ row }) => {
      const username = row.getValue('username') as string
      const avatar = (row.original as any).avatar as string | undefined
      const initials = (username || '').slice(0, 2).toUpperCase()
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UiAvatar, {}, {
          default: () => [
            avatar ? h(UiAvatarImage, { src: `${env.VITE_IMAGE_PREFIX}${avatar}`, alt: username }) : null,
            h(UiAvatarFallback, null, () => initials),
          ],
        }),
        h('span', {}, username),
      ])
    },
    enableSorting: false,
    enableHiding: false,
    enableResizing: true,
  },

  {
    accessorKey: 'status',
    header: ({ column }) => h(DataTableColumnHeader<UserInterface>, { column, title: 'Status' }),

    cell: ({ row }) => {
      const user = row.original
      const updateUserMutation = useUpdateUserMutation()
      const getUsersQuery = useGetUsersQuery()

      const handleStatusChange = async (newStatus: any) => {
        try {
          const statusValue = newStatus === 'true' ? true : newStatus === 'false' ? false : Boolean(newStatus)
          await updateUserMutation.mutateAsync({
            id: user.id!,
            status: statusValue,
          })
          await getUsersQuery.refetch()
          toast.success('User status updated successfully')
        }
        catch (error) {
          console.error('Failed to update user status:', error)
          toast.error('Failed to update user status')
        }
      }

      return h(Select, {
        'modelValue': user.status?.toString(),
        'onUpdate:modelValue': handleStatusChange,
      }, {
        default: () => [
          h(SelectTrigger, { class: 'w-[100px] h-8' }, {
            default: () => h(SelectValue),
          }),
          h(SelectContent, {}, {
            default: () => callTypes.map(callType =>
              h(SelectItem, {
                key: callType.value.toString(),
                value: callType.value.toString(),
              }, () => callType.label),
            ),
          }),
        ],
      })
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableResizing: true,
  },

  {
    accessorKey: 'role',
    header: ({ column }) => h(DataTableColumnHeader<UserInterface>, { column, title: 'Role' }),
    cell: ({ row }) => {
      const priority = userTypes.find(
        priority => priority.value === row.getValue('role'),
      )

      if (!priority)
        return null

      return h('div', { class: 'flex items-center' }, [
        priority.icon && h(priority.icon, { class: 'mr-2 h-4 w-4 text-muted-foreground' }),
        h('span', {}, priority.label),
      ])
    },
    enableSorting: false,
    enableResizing: true,
  },
  {
    accessorKey: 'createDate',
    header: ({ column }) => h(DataTableColumnHeader<UserInterface>, { column, title: 'createDate' }),
    cell: ({ row }) => {
      return h('span', {}, new Date(row.getValue('createDate')).toLocaleDateString())
    },
    enableSorting: true,
    enableResizing: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
