import type { ColumnDef } from '@tanstack/vue-table'

export interface FacetedFilterOption {
  label: string
  value: boolean | string | number
  icon?: Component
}

export interface DataTableProps<T> {
  loading?: boolean
  columns: ColumnDef<T, any>[]
  data: T[]
  // Server-side features (optional)
  manualPagination?: boolean
  manualSorting?: boolean
  manualFiltering?: boolean
  // Total items from server for pagination
  total?: number
}
