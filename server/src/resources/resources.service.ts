import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { FindManyOptions, FindOptionsWhere, Like, Repository } from 'typeorm';
import { QueryResourceDto } from './dto/query-resource.dto';

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
  ) {}

  /**
   * 创建新产品。
   * @param createProductDto 创建产品的数据传输对象
   * @returns 创建的产品
   */
  async create(createProductDto: CreateResourceDto) {
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
   * 查找所有产品的指定列。
   * @param column 产品的列名
   * @returns 指定列的值数组
   */
  async findAllColumn(column: keyof Resource) {
    const result = await this.resourceRepository.find({
      select: [column],
    });
    return result.map((item) => item[column]);
  }

  /**
   * 根据产品名称查找产品。
   * @param name 产品名称
   * @returns 查找到的产品数组
   */
  async findByName(name: string) {
    return await this.resourceRepository.find({
      where: {
        name,
      },
    });
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
