import type { ColumnDef } from '@tanstack/vue-table'

import { h } from 'vue'

import type { CategoryInterface } from '@/types/type'

import DataTableColumnHeader from '@/components/data-table/column-header.vue'
import { SelectColumn } from '@/components/data-table/table-columns'

import DataTableRowActions from './data-table-row-actions.vue'
import Tooltip from '@/components/ui/tooltip/Tooltip.vue'
import TooltipTrigger from '@/components/ui/tooltip/TooltipTrigger.vue'
import TooltipContent from '@/components/ui/tooltip/TooltipContent.vue'

export const columns: ColumnDef<CategoryInterface>[] = [
  SelectColumn as ColumnDef<CategoryInterface>,
  {
    accessorKey: 'name',
    header: ({ column }) => h(DataTableColumnHeader<CategoryInterface>, { column, title: 'Name' }),
    enableSorting: true,
    enableHiding: false,
    enableResizing: true,
  },
  {
    accessorKey: 'recommend',
    header: ({ column }) => h(DataTableColumnHeader<CategoryInterface>, { column, title: 'Recommend' }),
    cell: ({ row }) => {
      const description = row.getValue('recommend') as string
      
      if (!description) {
        return h('span', { class: 'text-muted-foreground' }, '-')
      }

      // 截取前30个字符作为显示文本
      const truncatedText = description.length > 30 
        ? `${description.substring(0, 30)}...` 
        : description

      // 使用原生 title 属性显示完整描述
      return h(Tooltip, {}, {
        default: () => [
          h(TooltipTrigger, { asChild: true }, () => 
            h('span', { 
              class: 'text-sm text-muted-foreground cursor-help underline-offset-4 hover:underline max-w-[200px] truncate inline-block'
            }, truncatedText)
          ),
          h(TooltipContent, { 
            class: 'max-w-xs break-words',
            side: 'top'
          }, () => 
            h('p', { class: 'text-sm' }, description)
          )
        ]
      })
    },
    enableSorting: false,
    enableResizing: true,
  },
  {
    accessorKey: 'createDate',
    header: ({ column }) => h(DataTableColumnHeader<CategoryInterface>, { column, title: 'Created' }),
    cell: ({ row }) => h('span', {}, row.getValue('createDate') ? new Date(row.getValue('createDate')).toLocaleDateString() : ''),
    enableSorting: true,
    enableResizing: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
