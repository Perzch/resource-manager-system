import { Category } from "src/categories/entities/category.entity";

export interface ResourceInterface {
  id?: number;
  name?: string;
  description?: string;
  icon?: string;
  link?: string;
  downloadCount?: number;
  category?: Category
}
