import type { Router } from 'vue-router'

import { storeToRefs } from 'pinia'

import pinia from '@/plugins/pinia'
import { useAuthStore } from '@/stores/auth'

export function authGuard(router: Router) {
  router.beforeEach((to, _from) => {
    const authStore = useAuthStore(pinia)
    const { isLogin } = storeToRefs(authStore)
    console.log('auth guard', to.meta)
    
    // 检查是否需要登录
    if (to.meta.auth && !unref(isLogin) && to.name !== '/auth/sign-in') {
      return { name: '/auth/sign-in' }
    }
    console.log(to.meta.role);
    
    // 检查权限要求
    if (to.meta.role && authStore.userInfo.role) {
      const requiredRole = to.meta.role as number
      const userRole = authStore.userInfo.role as number
      // 使用位运算检查用户是否拥有所需的权限
      // 用户必须拥有所有要求的权限位
      if ((userRole & requiredRole) !== requiredRole) {
        console.log('权限不足:', { userRole, requiredRole, hasPermission: (userRole & requiredRole) === requiredRole })
        return { path: '/errors/403' }
      }
    }
    
    return true
  })
}
