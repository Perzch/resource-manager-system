<script lang="ts" setup>
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'

import { sidebarData } from './data/sidebar-data'
import NavFooter from './nav-footer.vue'
import NavTeam from './nav-team.vue'

const auth = useAuthStore()
const { userInfo } = storeToRefs(auth)
</script>

<template>
  <UiSidebar collapsible="icon" class="z-50">
    <UiSidebarHeader>
      <NavFooter :user="userInfo" />
    </UiSidebarHeader>

    <UiSidebarContent>
      <NavTeam :nav-main="sidebarData.navMain" />
    </UiSidebarContent>

    <UiSidebarRail />
  </UiSidebar>
</template>

<style></style>
