import type { PermissionEnum } from '@/enums/global'

export interface UserInterface {
  id?: number
  username?: string
  password?: string
  role?: PermissionEnum
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
