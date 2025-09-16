import { PermissionEnum } from '../../global/permissions/permissions.enum';

export interface UserInterface {
  id?: number;
  username?: string;
  password?: string;
  role?: PermissionEnum;
}
