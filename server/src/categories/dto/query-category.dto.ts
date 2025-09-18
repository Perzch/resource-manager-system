import { SortPageParam } from 'src/global/sortPage.param';
import { Category } from '../entities/category.entity';

export class QueryCategoryDto extends SortPageParam<Category> {
  name: string;
}
