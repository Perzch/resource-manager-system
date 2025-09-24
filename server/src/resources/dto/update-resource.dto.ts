import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ResourceInterface } from '../entities/resource.interface';
import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import { ResourceStatusEnum } from '../entities/resource.status.enum';

export class UpdateResourceDto implements ResourceInterface {
  @IsNotEmpty()
  id: number;
  name?: string;
  description?: string;
  @IsOptional()
  @IsEnum(ResourceStatusEnum, { message: '无效的状态枚举值' })
  status?: ResourceStatusEnum;
  icon?: string;
  link?: string;
  category?: Category;
  user?: User;
}
