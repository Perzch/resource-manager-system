import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from '../permissions/permissions.enum';

export const IS_PERMISSION_KEY = 'isPermission';
export const IsPermission = (permissions: PermissionEnum | PermissionEnum[]) =>
  SetMetadata(IS_PERMISSION_KEY, [permissions].flat());
