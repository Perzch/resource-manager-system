import type { App, DirectiveBinding } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { PermissionEnum } from '@/enums/global'

/**
 * 权限指令，用于控制元素的显示/隐藏
 * 用法：v-permission="PermissionEnum.ADMIN" 或 v-permission="[PermissionEnum.READ, PermissionEnum.WRITE]"
 */
export const permissionDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding)
  },
}

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const authStore = useAuthStore()
  const userRole = authStore.userInfo.role as number

  if (!userRole) {
    // 未登录，隐藏元素
    hideElement(el)
    return
  }

  const requiredPermissions = binding.value

  // 如果没有指定权限要求，显示元素
  if (!requiredPermissions) {
    showElement(el)
    return
  }

  let hasPermission = false

  if (Array.isArray(requiredPermissions)) {
    // 数组形式：检查是否拥有任意一个权限
    hasPermission = requiredPermissions.some((permission: PermissionEnum) => 
      (userRole & permission) === permission
    )
  } else {
    // 单个权限：检查是否拥有该权限
    hasPermission = (userRole & requiredPermissions) === requiredPermissions
  }

  if (hasPermission) {
    showElement(el)
  } else {
    hideElement(el)
  }
}

function hideElement(el: HTMLElement) {
  // 方式1：完全移除元素
  if (el.parentNode) {
    el.parentNode.removeChild(el)
  }
  
  // 方式2：隐藏元素（可选）
  // el.style.display = 'none'
}

function showElement(_el: HTMLElement) {
  // 如果使用 display 方式，这里恢复显示
  // el.style.display = ''
  
  // 如果使用移除方式，这里不需要操作，因为元素已被移除
}

/**
 * 安装权限指令到 Vue 应用
 */
export function setupPermissionDirective(app: App) {
  app.directive('permission', permissionDirective)
}