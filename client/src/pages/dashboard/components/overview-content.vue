<script lang="ts" setup>
import { Users, FileText, FolderOpen, Download } from 'lucide-vue-next'
import { useGetDashboardStatsQuery } from '@/services/api/statistics.api'
import env from '@/utils/env'

const statsQuery = useGetDashboardStatsQuery()
const stats = computed(() => statsQuery.data.value)

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString()
}
</script>

<template>
  <div v-if="statsQuery.isLoading.value" class="flex items-center justify-center h-64">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>

  <div v-else-if="statsQuery.error.value" class="flex items-center justify-center h-64">
    <div class="text-red-500">Failed to load dashboard statistics</div>
  </div>

  <div v-else class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Resources -->
      <UiCard>
        <UiCardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <UiCardTitle class="text-sm font-medium">
            Total Resources
          </UiCardTitle>
          <FileText class="size-4 text-muted-foreground" />
        </UiCardHeader>
        <UiCardContent>
          <div class="text-2xl font-bold">
            {{ formatNumber(stats?.totalResources || 0) }}
          </div>
          <p class="text-xs text-muted-foreground">
            Total uploaded resources
          </p>
        </UiCardContent>
      </UiCard>

      <!-- Total Users -->
      <UiCard>
        <UiCardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <UiCardTitle class="text-sm font-medium">
            Total Users
          </UiCardTitle>
          <Users class="size-4 text-muted-foreground" />
        </UiCardHeader>
        <UiCardContent>
          <div class="text-2xl font-bold">
            {{ formatNumber(stats?.totalUsers || 0) }}
          </div>
          <p class="text-xs text-muted-foreground">
            Registered users
          </p>
        </UiCardContent>
      </UiCard>

      <!-- Total Categories -->
      <UiCard>
        <UiCardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <UiCardTitle class="text-sm font-medium">
            Categories
          </UiCardTitle>
          <FolderOpen class="size-4 text-muted-foreground" />
        </UiCardHeader>
        <UiCardContent>
          <div class="text-2xl font-bold">
            {{ formatNumber(stats?.totalCategories || 0) }}
          </div>
          <p class="text-xs text-muted-foreground">
            Resource categories
          </p>
        </UiCardContent>
      </UiCard>

      <!-- Total Downloads -->
      <UiCard>
        <UiCardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
          <UiCardTitle class="text-sm font-medium">
            Total Downloads
          </UiCardTitle>
          <Download class="size-4 text-muted-foreground" />
        </UiCardHeader>
        <UiCardContent>
          <div class="text-2xl font-bold">
            {{ formatNumber(stats?.totalDownloads || 0) }}
          </div>
          <p class="text-xs text-muted-foreground">
            All-time downloads
          </p>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Charts and Lists -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <!-- Top Uploaders -->
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Top Uploaders</UiCardTitle>
          <UiCardDescription>
            Users with the most uploaded resources
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent>
          <div class="space-y-4">
            <div 
              v-for="(uploader, index) in stats?.topUploaders || []" 
              :key="uploader.userId"
              class="flex items-center space-x-4"
            >
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {{ index + 1 }}
              </div>
              <div class="flex items-center space-x-3 flex-1">
                <UiAvatar class="w-8 h-8">
                  <UiAvatarImage 
                    v-if="uploader.avatar" 
                    :src="`${env.VITE_IMAGE_PREFIX}${uploader.avatar}`" 
                    :alt="uploader.username" 
                  />
                  <UiAvatarFallback>
                    {{ uploader.username.slice(0, 2).toUpperCase() }}
                  </UiAvatarFallback>
                </UiAvatar>
                <div class="flex-1">
                  <p class="text-sm font-medium">{{ uploader.username }}</p>
                  <p class="text-xs text-muted-foreground">
                    {{ uploader.resourceCount }} resources
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium">{{ formatNumber(uploader.totalDownloads) }}</p>
                <p class="text-xs text-muted-foreground">downloads</p>
              </div>
            </div>
          </div>
        </UiCardContent>
      </UiCard>

      <!-- Top Categories -->
      <UiCard>
        <UiCardHeader>
          <UiCardTitle>Popular Categories</UiCardTitle>
          <UiCardDescription>
            Categories with the most resources
          </UiCardDescription>
        </UiCardHeader>
        <UiCardContent>
          <div class="space-y-4">
            <div 
              v-for="(category, index) in stats?.topCategories || []" 
              :key="category.categoryId"
              class="flex items-center space-x-4"
            >
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                {{ index + 1 }}
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium">{{ category.categoryName }}</p>
                <p class="text-xs text-muted-foreground">
                  {{ category.resourceCount }} resources
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium">{{ formatNumber(category.totalDownloads) }}</p>
                <p class="text-xs text-muted-foreground">downloads</p>
              </div>
            </div>
          </div>
        </UiCardContent>
      </UiCard>
    </div>

    <!-- Recent Resources -->
    <UiCard>
      <UiCardHeader>
        <UiCardTitle>Recent Resources</UiCardTitle>
        <UiCardDescription>
          Latest uploaded resources
        </UiCardDescription>
      </UiCardHeader>
      <UiCardContent>
        <div class="space-y-4">
          <div 
            v-for="resource in stats?.recentResources || []" 
            :key="resource.id"
            class="flex items-center space-x-4 p-3 rounded-lg border"
          >
            <div class="flex-1">
              <h4 class="text-sm font-medium">{{ resource.name }}</h4>
              <div class="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                <span>by {{ resource.username }}</span>
                <span>•</span>
                <span>{{ resource.categoryName }}</span>
                <span>•</span>
                <span>{{ formatDate(resource.createDate) }}</span>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium">{{ formatNumber(resource.downloadCount) }}</p>
              <p class="text-xs text-muted-foreground">downloads</p>
            </div>
          </div>
        </div>
      </UiCardContent>
    </UiCard>
  </div>
</template>
