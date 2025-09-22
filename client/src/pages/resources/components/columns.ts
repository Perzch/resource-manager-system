import type { ColumnDef } from '@tanstack/vue-table'

import { h } from 'vue'
import { ExternalLink } from 'lucide-vue-next'

import type { ResourceInterface } from '@/types/type'

import DataTableColumnHeader from '@/components/data-table/column-header.vue'
import { SelectColumn } from '@/components/data-table/table-columns'

import env from '@/utils/env'

import DataTableRowActions from './data-table-row-actions.vue'

export const columns: ColumnDef<ResourceInterface>[] = [
  SelectColumn as ColumnDef<ResourceInterface>,
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableColumnHeader<ResourceInterface>, { column, title: 'Name' }),
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      const icon = (row.original as any).icon as string | undefined

      return h('div', { class: 'flex items-center gap-3' }, [
        icon
          ? h('img', {
            src: `${env.VITE_IMAGE_PREFIX}${icon}`,
            alt: name,
            class: 'w-8 h-8 rounded object-cover',
          })
          : h('div', { class: 'w-8 h-8 bg-gray-200 rounded flex items-center justify-center' }, [
            h('span', { class: 'text-xs text-gray-500' }, name?.charAt(0)?.toUpperCase() || 'R'),
          ]),
        h('span', { class: 'font-medium' }, name),
      ])
    },
    enableSorting: true,
    enableHiding: false,
    enableResizing: true,
  },
  {
    accessorKey: 'description',
    header: ({ column }) => h(DataTableColumnHeader<ResourceInterface>, { column, title: 'Description' }),
    cell: ({ row }) => {
      const description = row.getValue('description') as string
      return h('span', { class: 'text-sm text-muted-foreground max-w-[200px] truncate' }, description || '-')
    },
    enableSorting: false,
    enableResizing: true,
  },
  {
    accessorKey: 'link',
    header: ({ column }) => h(DataTableColumnHeader<ResourceInterface>, { column, title: 'Link' }),
    cell: ({ row }) => {
      const link = row.getValue('link') as string
      if (!link)
        return h('span', { class: 'text-muted-foreground' }, '-')

      return h('a', {
        href: `${env.VITE_IMAGE_PREFIX}${link}`,
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline',
      }, [
        h('span', { class: 'max-w-[150px] truncate' }, 'Download'),
        h(ExternalLink, { class: 'h-3 w-3' }),
      ])
    },
    enableSorting: false,
    enableResizing: true,
  },
  {
    accessorKey: 'downloadCount',
    header: ({ column }) => h(DataTableColumnHeader<ResourceInterface>, { column, title: 'Downloads' }),
    cell: ({ row }) => {
      const count = row.getValue('downloadCount') as number
      return h('span', { class: 'font-mono' }, count?.toLocaleString() || '0')
    },
    enableSorting: true,
    enableResizing: true,
  },
  {
    accessorKey: 'category',
    header: ({ column }) => h(DataTableColumnHeader<ResourceInterface>, { column, title: 'Category' }),
    cell: ({ row }) => {
      const category = (row.original as any).category
      const categoryName = category?.name || '-'
      return h('span', {
        class: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
      }, categoryName)
    },
    enableSorting: false,
    enableResizing: true,
  },
  {
    accessorKey: 'user',
    header: ({ column }) => h(DataTableColumnHeader<ResourceInterface>, { column, title: 'Owner' }),
    cell: ({ row }) => {
      const user = (row.original as any).user
      const username = user?.username || '-'
      return h('span', { class: 'text-sm' }, username)
    },
    enableSorting: false,
    enableResizing: true,
  },
  {
    accessorKey: 'createDate',
    header: ({ column }) => h(DataTableColumnHeader<ResourceInterface>, { column, title: 'Created' }),
    cell: ({ row }) => {
      const date = row.getValue('createDate') as string
      return h('span', { class: 'text-sm' }, date ? new Date(date).toLocaleDateString() : '-')
    },
    enableSorting: true,
    enableResizing: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]