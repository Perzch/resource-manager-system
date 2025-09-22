import type { ColumnDef } from '@tanstack/vue-table'

import { h } from 'vue'
import { Download } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import type { ResourceInterface } from '@/types/type'

import DataTableColumnHeader from '@/components/data-table/column-header.vue'
import { SelectColumn } from '@/components/data-table/table-columns'
import UiAvatar from '@/components/ui/avatar/Avatar.vue'
import UiAvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import UiAvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import { Button } from '@/components/ui/button'

import env from '@/utils/env'
import { useDownloadResourceMutation } from '@/services/api/resources.api'

import DataTableRowActions from './data-table-row-actions.vue'

export const columns: ColumnDef<ResourceInterface>[] = [
  SelectColumn as ColumnDef<ResourceInterface>,
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableColumnHeader<ResourceInterface>, { column, title: 'Name' }),
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return h('span', { class: 'font-medium' }, name)
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
      const resourceId = (row.original as any).id as number
      
      if (!link)
        return h('span', { class: 'text-muted-foreground' }, '-')

      const downloadMutation = useDownloadResourceMutation()

      const handleDownload = async (event: Event) => {
        event.preventDefault()
        
        try {
          // 调用下载接口
          await downloadMutation.mutateAsync(resourceId)
          
          // 下载接口调用成功后，打开文件链接
          window.open(`${env.VITE_IMAGE_PREFIX}${link}`, '_blank')
          
          // 手动更新本地数据的下载计数
          const originalResource = row.original as any
          if (originalResource.downloadCount !== undefined) {
            originalResource.downloadCount = (originalResource.downloadCount || 0) + 1
          } else {
            originalResource.downloadCount = 1
          }
          
          toast.success('Download started successfully')
        } catch (error) {
          console.error('Download failed:', error)
          toast.error('Failed to start download')
        }
      }

      return h(Button, {
        variant: 'ghost',
        size: 'sm',
        class: 'flex items-center gap-1 text-blue-600 hover:text-blue-800 p-0 h-auto',
        onClick: handleDownload,
        disabled: downloadMutation.isPending.value
      }, [
        h(Download, { class: 'h-3 w-3' }),
        h('span', { class: 'max-w-[150px] truncate' }, downloadMutation.isPending.value ? 'Downloading...' : 'Download'),
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
    filterFn: (row, _id, value) => {
      const category = (row.original as any).category
      const categoryName = category?.name || ''
      return value.includes(categoryName)
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
      const avatar = user?.avatar as string | undefined
      const initials = (username || '').slice(0, 2).toUpperCase()
      
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UiAvatar, {}, {
          default: () => [
            avatar ? h(UiAvatarImage, { src: `${env.VITE_IMAGE_PREFIX}${avatar}`, alt: username }) : null,
            h(UiAvatarFallback, null, () => initials),
          ],
        }),
        h('span', { class: 'text-sm' }, username),
      ])
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