import { useAuthStore } from '@/stores/auth'
import { PermissionEnum } from '@/enums/global'

/**
 * 权限检查组合式函数
 */
export function usePermission() {
  const authStore = useAuthStore()

  /**
   * 检查用户是否拥有指定权限
   * @param requiredPermission 要求的权限
   * @returns 是否拥有权限
   */
  function hasPermission(requiredPermission: PermissionEnum): boolean {
    const userRole = authStore.userInfo.role as number
    if (!userRole) return false
    
    // 使用位运算检查用户是否拥有所需的权限
    return (userRole & requiredPermission) === requiredPermission
  }

  /**
   * 检查用户是否拥有任意一个指定权限
   * @param permissions 权限数组
   * @returns 是否拥有任意权限
   */
  function hasAnyPermission(permissions: PermissionEnum[]): boolean {
    return permissions.some(permission => hasPermission(permission))
  }

  /**
   * 检查用户是否拥有所有指定权限
   * @param permissions 权限数组
   * @returns 是否拥有所有权限
   */
  function hasAllPermissions(permissions: PermissionEnum[]): boolean {
    return permissions.every(permission => hasPermission(permission))
  }

  /**
   * 检查是否为管理员
   */
  function isAdmin(): boolean {
    return hasPermission(PermissionEnum.ADMIN)
  }

  /**
   * 检查是否为管理者（拥有管理权限）
   */
  function isManager(): boolean {
    return hasPermission(PermissionEnum.MANAGE)
  }

  /**
   * 检查是否可以读取
   */
  function canRead(): boolean {
    return hasPermission(PermissionEnum.READ)
  }

  /**
   * 检查是否可以写入
   */
  function canWrite(): boolean {
    return hasPermission(PermissionEnum.WRITE)
  }

  /**
   * 检查是否可以更新
   */
  function canUpdate(): boolean {
    return hasPermission(PermissionEnum.UPDATE)
  }

  /**
   * 检查是否可以删除
   */
  function canDelete(): boolean {
    return hasPermission(PermissionEnum.DELETE)
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isAdmin,
    isManager,
    canRead,
    canWrite,
    canUpdate,
    canDelete,
  }
}