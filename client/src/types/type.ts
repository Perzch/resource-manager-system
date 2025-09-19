import type { PermissionEnum } from '@/enums/global'

export interface UserInterface {
  id?: number
  username?: string
  password?: string
  role?: PermissionEnum
}
