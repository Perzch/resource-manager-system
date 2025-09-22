import type { ColumnDef } from '@tanstack/vue-table'

import { h } from 'vue'

import type { CategoryInterface } from '@/types/type'

import DataTableColumnHeader from '@/components/data-table/column-header.vue'
import { SelectColumn } from '@/components/data-table/table-columns'

import DataTableRowActions from './data-table-row-actions.vue'

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
