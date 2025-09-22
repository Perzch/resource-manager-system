<script setup lang="ts">
import type { Table } from '@tanstack/vue-table'

import { X } from 'lucide-vue-next'

import DataTableFacetedFilter from '@/components/data-table/faceted-filter.vue'
import DataTableViewOptions from '@/components/data-table/view-options.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import type { ResourceInterface } from '@/types/type'
import { useCategoryOptions } from '../data/data'

interface DataTableToolbarProps {
  table: Table<ResourceInterface>
}

const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
const { categoryOptions } = useCategoryOptions()
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-col items-start flex-1 space-y-2 md:items-center md:space-x-2 md:space-y-0 md:flex-row">
      <Input
        placeholder="Filter resources..."
        :model-value="(table.getColumn('name')?.getFilterValue() as string) ?? ''"
        class="h-8 w-[150px] lg:w-[250px]"
        @input="table.getColumn('name')?.setFilterValue($event.target.value)"
      />
      
      <DataTableFacetedFilter
        v-if="table.getColumn('category')"
        :column="table.getColumn('category')"
        title="Category"
        :options="categoryOptions"
      />

      <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="table.resetColumnFilters()"
      >
        Reset
        <X class="size-4" />
      </Button>
    </div>
    <DataTableViewOptions :table="table" />
  </div>
</template>