import { IsNotEmpty } from 'class-validator';
import { ResourceInterface } from '../entities/resource.interface';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';

export class UpdateResourceDto implements ResourceInterface {
  @IsNotEmpty()
  id: number;
  name?: string;
  description?: string;
  icon?: string;
  link?: string;
  category?: Category;
  user?: User;
}
