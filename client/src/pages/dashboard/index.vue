<script lang="ts" setup>
import { toast } from 'vue-sonner'

import Page from '@/components/global-layout/basic-page.vue'
import { Button } from '@/components/ui/button'
import { PermissionEnum } from '@/enums/global'

import OverviewContent from './components/overview-content.vue'

definePage({
  meta: {
    auth: true,
    role: PermissionEnum.READ
  }
})

const tabs = ref([
  { name: 'Overview', value: 'overview' },
  { name: 'Analytics', value: 'analytics', disabled: true },
  { name: 'Reports', value: 'reports', disabled: true },
  { name: 'Notifications', value: 'notifications', disabled: true },
])

const activeTab = ref(tabs.value[0].value)
</script>

<template>
  <Page
    title="workspace"
    description="workspace description"
    sticky
  >
    <UiTabs :default-value="activeTab" class="w-full">
      <!-- <UiTabsList>
        <UiTabsTrigger
          v-for="tab in tabs" :key="tab.value"
          :value="tab.value"
          :disabled="tab.disabled"
        >
          {{ tab.name }}
        </UiTabsTrigger>
      </UiTabsList> -->
      <UiTabsContent value="overview" class="space-y-4">
        <OverviewContent />
      </UiTabsContent>
    </UiTabs>
  </Page>
</template>

<style>

</style>
