import { Resource } from 'src/resources/entities/resource.entity';
import { PermissionEnum } from '../../global/permissions/permissions.enum';

export interface UserInterface {
  id?: number;
  username?: string;
  password?: string;
  status?: boolean;
  createDate?: Date;
  avatar?: string;
  role?: PermissionEnum;
  resources?: Resource[];
}
