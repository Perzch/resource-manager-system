import { Category } from 'src/categories/entities/category.entity';
import { Resource } from '../entities/resource.entity';
import { ResourceInterface } from '../entities/resource.interface';
import { SortPageParam } from 'src/global/sortPage.param';

export class QueryResourceDto
  extends SortPageParam<Resource>
  implements ResourceInterface
{
  name: string;
  sort: 'asc' | 'desc';
  sortColumn: keyof Resource;
  category: Category;
}
