import { GeneralParam } from 'src/global/general.param';
import { Category } from '../entities/category.entity';
import { CategoryInterface } from '../entities/category.interface';

export class QueryCategoryDto
  extends GeneralParam<Category>
  implements CategoryInterface
{
  name?: string;
}
