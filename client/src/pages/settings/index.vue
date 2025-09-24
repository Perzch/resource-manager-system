<script setup lang="ts">
import { PermissionEnum } from '@/enums/global'
import ProfileForm from './components/profile-form.vue'
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
    <div class="space-y-8">
      <ProfileForm />
    </div>
  </SettingsLayout>
</template>
