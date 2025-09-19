import { IsEmpty, IsNotEmpty, IsNotEmptyObject } from 'class-validator';
import { ResourceInterface } from '../entities/resource.interface';
import { Category } from 'src/categories/entities/category.entity';
import { IsCategoryValid } from '../../categories/validators/category.validator';

export class CreateResourceDto implements ResourceInterface {
  @IsEmpty({ message: 'id必须为空' })
  id?: number;
  @IsNotEmpty({ message: '资源名称不能为空' })
  name: string;
  description?: string;
  icon?: string;
  link?: string;
  @IsNotEmptyObject()
  @IsCategoryValid({ message: '分类信息必须包含有效的 id 或 name 属性' })
  category: Category;
}
