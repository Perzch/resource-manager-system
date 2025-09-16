import { IsEmpty, IsNotEmpty } from 'class-validator';
import { CategoryInterface } from '../entities/category.interface';

export class CreateCategoryDto implements CategoryInterface {
  @IsEmpty({ message: '不能传入id' })
  id: number;
  @IsNotEmpty({ message: '分类名称不能为空' })
  name: string;
  recommend: string;
}
