import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { ResourceStatusEnum } from './resource.status.enum';

export interface ResourceInterface {
  id?: number;
  name?: string;
  description?: string;
  icon?: string;
  link?: string;
  status?: ResourceStatusEnum;
  downloadCount?: number;
  category?: Category;
  user?: User;
}
