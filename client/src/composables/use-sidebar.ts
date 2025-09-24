import {
  ContainerIcon,
  Layers2,
  LayoutDashboard,
  Palette,
  Settings,
  SquareUserRound,
  User,
  Users,
} from 'lucide-vue-next'

import type { NavGroup } from '@/components/app-sidebar/types'
import { usePermission } from '@/composables/use-permission'
import { useAuthStore } from '@/stores/auth'
import { PermissionEnum } from '@/enums/global'

export function useSidebar() {
  const { hasPermission } = usePermission()
  const authStore = useAuthStore()

  // 构建导航数据，基于用户权限过滤
  const navData = computed(() => {
    // 如果用户未登录，返回空数组
    if (!authStore.userInfo?.id) {
      return []
    }
    
    const generalItems = []
    
    // Dashboard - 需要 READ 权限
    if (hasPermission(PermissionEnum.READ)) {
      generalItems.push({
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
      })
    }
    
    // Users - 需要 MANAGE 权限
    if (hasPermission(PermissionEnum.MANAGE)) {
      generalItems.push({
        title: 'Users',
        url: '/users',
        icon: Users,
      })
    }
    
    // Categories - 需要 WRITE 权限
    if (hasPermission(PermissionEnum.READ)) {
      generalItems.push({
        title: 'Categories',
        url: '/categories',
        icon: Layers2,
      })
    }
    
    // Resources - 需要 READ 权限
    if (hasPermission(PermissionEnum.READ)) {
      generalItems.push({
        title: 'Resources',
        url: '/resources',
        icon: ContainerIcon,
      })
    }

    const groups: NavGroup[] = []
    
    // 只有当有可用项目时才添加 General 组
    if (generalItems.length > 0) {
      groups.push({
        title: 'General',
        items: generalItems,
      })
    }

    // Pages 组 - 这些页面通常对所有用户开放
    groups.push({
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: SquareUserRound,
          items: [
            { title: 'Sign In', url: '/auth/sign-in' },
            { title: 'Sign Up', url: '/auth/sign-up' },
            // { title: 'Forgot Password', url: '/auth/forgot-password' },
          ],
        },
      ],
    })

    // Settings 组 - 对所有认证用户开放
    if (authStore.userInfo?.id) {
      groups.push({
        title: 'Other',
        items: [
          {
            title: 'Settings',
            icon: Settings,
            items: [
              { title: 'Profile', url: '/settings/', icon: User },
              { title: 'Appearance', url: '/settings/appearance', icon: Palette },
            ],
          },
        ],
      })
    }

    return groups
  })

  const otherPages = ref<NavGroup[]>([
    // 其他页面可以在这里添加
  ])

  return {
    navData,
    otherPages,
  }
}
