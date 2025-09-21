import { Category } from 'src/categories/entities/category.entity';
import { Resource } from '../entities/resource.entity';
import { ResourceInterface } from '../entities/resource.interface';
import { GeneralParam } from 'src/global/general.param';

export class QueryResourceDto
  extends GeneralParam<Resource>
  implements ResourceInterface
{
  name?: string;
  category?: Category;
  owner?: number; // 是否只查询当前用户的资源
}
