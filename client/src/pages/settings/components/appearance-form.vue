<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import CustomColor from '@/components/custom-theme/custom-color.vue'
import CustomRadius from '@/components/custom-theme/custom-radius.vue'
import ToggleColorMode from '@/components/custom-theme/toggle-color-mode.vue'
import ContentLayout from '@/components/custom-theme/content-layout.vue'
</script>

<template>
  <div>
    <h3 class="text-lg font-medium">
      Appearance
    </h3>
    <p class="text-sm text-muted-foreground">
      Customize the appearance of the app. Automatically switch between day and night themes.
    </p>
  </div>
  <Separator class="my-4" />
  
  <div class="space-y-6">
    <!-- Color Mode Toggle -->
    <ToggleColorMode />
    
    <!-- Theme Color Selection -->
    <CustomColor />
    
    <!-- Border Radius -->
    <CustomRadius />
    
    <!-- Content Layout -->
    <ContentLayout />
  </div>
</template>
