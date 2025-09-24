import type { CategoryInterface, ResourceInterface, ResourceStatusEnum } from '@/types/type'
import { useGetCategoriesQuery } from '@/services/api/categories.api'
import { useGetResourcesQuery } from '@/services/api/resources.api'

// Generate category options for filtering from API data
export function useCategoryOptions() {
  const categoriesQuery = useGetCategoriesQuery()
  
  const categoryOptions = computed(() => {
    const categories = categoriesQuery.data.value?.data || []
    return categories.map((category: CategoryInterface) => ({
      label: category.name || 'Unknown',
      value: category.name || '',
    }))
  })

  return {
    categoryOptions,
    isLoading: categoriesQuery.isLoading,
    error: categoriesQuery.error
  }
}

// Generate status options for filtering
export function useStatusOptions() {
  const statusOptions = computed(() => [
    {
      label: 'Active',
      value: 1 as ResourceStatusEnum,
      color: 'bg-green-100 text-green-800'
    },
    {
      label: 'Inactive', 
      value: 2 as ResourceStatusEnum,
      color: 'bg-gray-100 text-gray-800'
    },
    {
      label: 'Pending',
      value: 3 as ResourceStatusEnum,
      color: 'bg-yellow-100 text-yellow-800'
    }
  ])

  return {
    statusOptions
  }
}

// Generate user options for filtering from resources data
export function useUserOptions() {
  const resourcesQuery = useGetResourcesQuery()
  
  const userOptions = computed(() => {
    const resources = resourcesQuery.data.value?.data || []
    const uniqueUsers = new Map()
    
    // 收集所有唯一用户
    resources.forEach((resource: ResourceInterface) => {
      const user = resource.user
      if (user && user.id) {
        uniqueUsers.set(user.id, {
          id: user.id,
          username: user.username || 'Unknown',
          avatar: user.avatar
        })
      }
    })
    
    // 转换为选项格式，包含头像信息
    return Array.from(uniqueUsers.values()).map(user => ({
      label: user.username,
      value: user.username,
      avatar: user.avatar ? `${import.meta.env.VITE_IMAGE_PREFIX || ''}${user.avatar}` : undefined,
      id: user.id
    }))
  })

  return {
    userOptions,
    isLoading: resourcesQuery.isLoading,
    error: resourcesQuery.error
  }
}