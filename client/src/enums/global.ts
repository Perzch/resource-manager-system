import type { RouteLocationRaw } from 'vue-router'

export const RouterPath: Record<string, RouteLocationRaw> = {
  HOME: '/dashboard',
  LOGIN: '/auth/sign-in',
}

export enum PermissionEnum {
  READ = 1, // 1 >> 1 读取权限
  WRITE = 2, // 1 >> 2 写入权限
  BASE = 3, // 基础权限，拥有读写权限
  UPDATE = 4, // 1 >> 3 更新权限
  DELETE = 8, // 1 >> 5 删除权限
  MANAGE = 7, //  管理权限,拥有读写更新权限
  ADMIN = 15, // 1 >> 6 管理员权限，拥有所有权限
}
