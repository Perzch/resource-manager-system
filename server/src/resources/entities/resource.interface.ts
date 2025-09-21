import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';

export interface ResourceInterface {
  id?: number;
  name?: string;
  description?: string;
  icon?: string;
  link?: string;
  downloadCount?: number;
  category?: Category;
  user?: User;
}
