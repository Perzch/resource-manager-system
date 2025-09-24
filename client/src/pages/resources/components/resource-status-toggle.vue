<script setup lang="ts">
import { computed } from 'vue'
import { toast } from 'vue-sonner'
import { useQueryClient } from '@tanstack/vue-query'

import type { ResourceInterface, ResourceStatusEnum } from '@/types/type'
import { useAuthStore } from '@/stores/auth'
import { useUpdateResourceStatusMutation } from '@/services/api/resources.api'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

interface Props {
  resource: ResourceInterface
}

const props = defineProps<Props>()

const authStore = useAuthStore()
const queryClient = useQueryClient()
const updateStatusMutation = useUpdateResourceStatusMutation()

// 状态配置
const statusConfig = {
  1: { text: 'Active', class: 'bg-green-100 text-green-800 hover:bg-green-200' },    // ACTIVE
  2: { text: 'Inactive', class: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },    // INACTIVE
  3: { text: 'Pending', class: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' }, // PENDING
}

const currentStatus = computed(() => props.resource.status || 3)
const currentConfig = computed(() => statusConfig[currentStatus.value] || statusConfig[3])

// 管理员或拥有管理权限的用户可以修改状态
const canModifyStatus = computed(() => {
  const userRole = authStore.userInfo.role || 0
  // 检查是否有管理权限：MANAGE(7) 或 ADMIN(15)
  const hasManagePermission = (userRole & 7) === 7
  const hasAdminPermission = (userRole & 15) === 15
  return hasManagePermission || hasAdminPermission
})

const handleStatusChange = async (newStatus: ResourceStatusEnum) => {
  if (!props.resource.id || !canModifyStatus.value) return

  try {
    await updateStatusMutation.mutateAsync({
      id: props.resource.id,
      status: newStatus
    })

    // 刷新资源列表
    await queryClient.invalidateQueries({ queryKey: ['resources'] })
    
    const statusText = statusConfig[newStatus]?.text || 'Unknown'
    toast.success(`Resource status updated to ${statusText}`)
  } catch (error) {
    console.error('Failed to update status:', error)
    toast.error('Failed to update resource status')
  }
}
</script>

<template>
  <div>
    <!-- 如果不能修改状态，只显示当前状态 -->
    <Badge 
      v-if="!canModifyStatus"
      :class="currentConfig.class"
    >
      {{ currentConfig.text }}
    </Badge>

    <!-- 如果可以修改状态，显示下拉菜单 -->
    <DropdownMenu v-else>
      <DropdownMenuTrigger as-child>
        <Button
          variant="ghost"
          size="sm"
          :class="currentConfig.class"
          :disabled="updateStatusMutation.isPending.value"
        >
          {{ updateStatusMutation.isPending.value ? 'Updating...' : currentConfig.text }}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        <!-- 如果是 PENDING 状态，显示激活选项 -->
        <DropdownMenuItem
          v-if="currentStatus === 3"
          @click="handleStatusChange(1)"
          :disabled="updateStatusMutation.isPending.value"
        >
          Activate Resource
        </DropdownMenuItem>
        
        <!-- 如果是 ACTIVE 状态，显示停用选项 -->
        <DropdownMenuItem
          v-if="currentStatus === 1"
          @click="handleStatusChange(2)"
          :disabled="updateStatusMutation.isPending.value"
        >
          Deactivate Resource
        </DropdownMenuItem>
        
        <!-- 如果是 INACTIVE 状态，显示激活选项 -->
        <DropdownMenuItem
          v-if="currentStatus === 2"
          @click="handleStatusChange(1)"
          :disabled="updateStatusMutation.isPending.value"
        >
          Activate Resource
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>