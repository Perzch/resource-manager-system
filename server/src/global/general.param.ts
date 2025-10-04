import { IsArray, IsOptional, Min } from 'class-validator';

export class GeneralParam<T> {

  sort?: 'asc' | 'desc' = 'asc';

  sortColumn?: keyof T;

  // 表示需要查询哪些字段
  @IsOptional()
  @IsArray({ message: 'columns must be an array' })
  columns?: (keyof T)[];
}
