import { IsNotEmpty } from 'class-validator';
import { ResourceInterface } from '../entities/resource.interface';

export class UpdateResourceDto implements ResourceInterface {
  @IsNotEmpty()
  id: number;
  name?: string;
  description?: string;
  icon?: string;
  link?: string;
  categoryId?: number;
}
