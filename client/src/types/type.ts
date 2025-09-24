import type { PermissionEnum } from '@/enums/global'

// 资源状态枚举
export enum ResourceStatusEnum {
  ACTIVE = 1,
  INACTIVE = 2,
  PENDING = 3,
}

export interface UserInterface {
  id?: number
  avatar?: string
  username?: string
  password?: string
  status?: boolean
  createDate?: string
  role?: PermissionEnum
}

export interface CategoryInterface {
  id?: number
  name?: string
  recommend?: string
  createDate?: string
}

export interface ResourceInterface {
  id?: number
  name?: string
  description?: string
  icon?: string
  link?: string
  status?: ResourceStatusEnum
  downloadCount?: number
  createDate?: string
  category?: CategoryInterface
  user?: UserInterface
}

export interface ResponseData<T> {
  code: number
  message: string
  data: T
}

export interface PageData<T> {
  list: T[]
  total: number
}

export interface PageResponseData<T> extends ResponseData<PageData<T>> {}
