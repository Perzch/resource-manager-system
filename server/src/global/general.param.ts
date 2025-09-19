import { IsArray } from "class-validator";

export class GeneralParam<T> {
  page?: number = 1;
  limit?: number = 10;
  sort?: 'asc' | 'desc' = 'asc';
  sortColumn?: keyof T;
  // 表示需要查询哪些字段
  @IsArray({ message: 'columns must be an array' })
  columns?: (keyof T)[];
}
