import { Injectable } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category, categoryColumns } from './entities/category.entity';
import { FindManyOptions, FindOptionsWhere, Like, Repository } from 'typeorm';
import { QueryCategoryDto } from './dto/query-category.dto';
import { CategoryInterface } from './entities/category.interface';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CategoryInterface) {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(query: QueryCategoryDto) {
    const where: FindOptionsWhere<Category> = {
      name: Like(`%${query.name || ''}%`),
    };
    const options: FindManyOptions<Category> = {
      where,
      select: categoryColumns.filter(
        (col) => query.columns?.includes(col) || !query.columns,
      ),
      order: {
        [query.sortColumn || 'id']: query.sort || 'asc',
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    };
    // 处理列选择,只有在columns存在且长度大于0时才处理
    // if(query.columns && query.columns.length) {
    //   options.select = query.columns.filter(col => categoryColumns.includes(col));
    // } else {
    //   options.select = categoryColumns
    // }
    const data = await this.categoryRepository.find(options);
    const total = await this.categoryRepository.count({ where });
    return { data, total };
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findOneByColumn(column: keyof Category, value: any) {
    return await this.categoryRepository.findOne({
      where: {
        [column]: value,
      },
    });
  }

  async update(updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.preload(updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(ids: number[]) {
    return await this.categoryRepository.delete(ids);
  }
}
