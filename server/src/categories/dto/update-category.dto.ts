import { CategoryInterface } from '../entities/category.interface';
import { IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto implements CategoryInterface {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty({ message: '分类名称不能为空' })
  name: string;
  recommend: string;
}
