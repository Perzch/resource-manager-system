<script setup lang="ts">
import { PermissionEnum } from '@/enums/global'
import AppearanceForm from './components/appearance-form.vue'
import SettingsLayout from './components/settings-layout.vue'

definePage({
  meta: {
    auth: true,
    role: PermissionEnum.READ
  }
})
</script>

<template>
  <SettingsLayout>
    <AppearanceForm />
  </SettingsLayout>
</template>
