import { IsEmpty, IsNotEmpty } from 'class-validator';
import { ResourceInterface } from '../entities/resource.interface';

export class CreateResourceDto implements ResourceInterface {
  @IsEmpty({ message: 'id必须为空' })
  id?: number;
  @IsNotEmpty({ message: '资源名称不能为空' })
  name: string;
  description?: string;
  icon?: string;
  link?: string;
  @IsNotEmpty({ message: '分类ID不能为空' })
  categoryId: number;
}
