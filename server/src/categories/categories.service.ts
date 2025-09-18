import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Like, Repository } from 'typeorm';
import { QueryCategoryDto } from './dto/query-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(query: QueryCategoryDto) {
    return await this.categoryRepository.find({
      where: {
        name: Like(`%${query.name || ''}%`),
      },
      order: {
        [query.sortColumn || 'id']: query.sort || 'asc',
      },
      skip: query.page * query.limit,
      take: query.limit,
    });
  }

  async findAllName() {
    return await this.categoryRepository.find({
      select: ['name', 'id'],
    });
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByName(name: string) {
    return await this.categoryRepository.findOne({
      where: {
        name,
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
