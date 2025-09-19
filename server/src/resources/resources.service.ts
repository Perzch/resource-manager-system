import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource, resourceColumns } from './entities/resource.entity';
import { FindManyOptions, FindOptionsWhere, Like, Repository } from 'typeorm';
import { QueryResourceDto } from './dto/query-resource.dto';
import { Category } from 'src/categories/entities/category.entity';

/**
 * 产品服务类，提供对产品的增删改查操作。
 */
@Injectable()
export class ResourcesService {
  /**
   * 构造函数，注入产品仓库。
   * @param resourceRepository 产品仓库实例
   */
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * 创建新产品。
   * @param createProductDto 创建产品的数据传输对象
   * @returns 创建的产品
   */
  async create(createProductDto: CreateResourceDto) {
    // 通过id加载分类,如果不存在并且有name则创建新分类
    const category = this.categoryRepository.preload(createProductDto.category);
    if (!category) {
      createProductDto.category = await this.categoryRepository.save(
        createProductDto.category,
      );
    }
    const createdProduct = this.resourceRepository.create(createProductDto);
    return await this.resourceRepository.save(createdProduct);
  }

  /**
   * 查找所有产品，支持分页和查询条件。
   * @param query 查询条件的数据传输对象
   * @param page 页码
   * @param limit 每页数量
   * @returns 包含产品数据和总数的对象
   */
  async findAll(query: QueryResourceDto) {
    const where: FindOptionsWhere<Resource> = {
      name: Like(`%${query.name || ''}%`),
      category: query.category,
    };
    const searchOptions: FindManyOptions<Resource> = {
      where,
      select: resourceColumns.filter(col => query.columns?.includes(col) || !query.columns),
      relations: ['category'],
      skip: query.page * query.limit,
      take: query.limit,
      order: {
        [query.sortColumn || 'id']: query.sort || 'ASC',
      },
    };
    const data = await this.resourceRepository.find(searchOptions);
    const total = await this.resourceRepository.count({ where });
    return { data, total };
  }

  /**
   * 根据产品ID查找产品。
   * @param id 产品ID
   * @returns 查找到的产品
   */
  async findOne(id: number) {
    return await this.resourceRepository.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * 更新产品信息。
   * @param updateProductDto 更新产品的数据传输对象
   * @returns 更新后的产品
   */
  async update(updateProductDto: UpdateResourceDto) {
    const product = await this.resourceRepository.preload({
      ...updateProductDto,
    });
    return await this.resourceRepository.save(product);
  }

  /**
   * 根据产品ID删除产品。
   * @param id 产品ID
   * @returns 删除结果
   */
  async remove(ids: number[]) {
    return await this.resourceRepository.delete(ids);
  }
}
