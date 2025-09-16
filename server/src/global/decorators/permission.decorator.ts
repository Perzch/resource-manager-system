import { SetMetadata } from '@nestjs/common';

export const IS_PERMISSION_KEY = 'isPermission';
export const IsPermission = (num: number) =>
  SetMetadata(IS_PERMISSION_KEY, num);
