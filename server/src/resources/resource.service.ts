import { Injectable } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource, resourceColumns } from './entities/resource.entity';
import { FindManyOptions, FindOptionsWhere, Like, Repository, Or, In } from 'typeorm';
import { QueryResourceDto } from './dto/query-resource.dto';
import { CategoryService } from 'src/categories/category.service';
import { ResourceStatusEnum } from './entities/resource.status.enum';
import { PermissionEnum } from 'src/global/permissions/permissions.enum';

/**
 * 产品服务类，提供对产品的增删改查操作。
 */
@Injectable()
export class ResourceService {
  /**
   * 构造函数，注入产品仓库。
   * @param resourceRepository 产品仓库实例
   */
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    private readonly categoriesService: CategoryService,
  ) {}

  /**
   * 创建新产品。
   * @param createProductDto 创建产品的数据传输对象
   * @returns 创建的产品
   */
  async create(createProductDto: CreateResourceDto) {
    // 通过id加载分类,如果不存在并且有name则创建新分类
    const category = await this.categoriesService.findOneByColumn(
      'id',
      createProductDto.category.id,
    );
    if (!category) {
      this.categoriesService.create(createProductDto.category);
    }
    const createdProduct = this.resourceRepository.create(createProductDto);
    return await this.resourceRepository.save(createdProduct);
  }

  /**
   * 查找所有产品，支持分页和查询条件。
   * @param query 查询条件的数据传输对象
   * @param user 当前请求的用户信息
   * @returns 包含产品数据和总数的对象
   */
  async findAll(query: QueryResourceDto, user?: any) {
    const where: FindOptionsWhere<Resource> = {
      name: Like(`%${query.name || ''}%`),
      category: query.category,
      user: query.owner ? { id: query.owner } : undefined,
    };

    // 状态过滤逻辑
    if (user) {
      const hasManagePermission = (user.role & PermissionEnum.MANAGE) === PermissionEnum.MANAGE;
      const hasAdminPermission = (user.role & PermissionEnum.ADMIN) === PermissionEnum.ADMIN;
      const canSeeAllResources = hasManagePermission || hasAdminPermission;
      
      if (!canSeeAllResources) {
        // 普通用户只能看到 ACTIVE 状态的资源和自己上传的所有资源
        // 使用数组形式实现 OR 查询
        const activeWhere = { ...where, status: ResourceStatusEnum.ACTIVE };
        const userWhere = { ...where, user: { id: user.id } };
        
        const searchOptions: FindManyOptions<Resource> = {
          where: [activeWhere, userWhere],
          select: resourceColumns.filter(
            (col) => query.columns?.includes(col) || !query.columns,
          ),
          relations: ['category', 'user'],
          order: {
            [query.sortColumn || 'id']: query.sort || 'ASC',
          },
        };
        const data = await this.resourceRepository.find(searchOptions);
        const total = await this.resourceRepository.count({ where: [activeWhere, userWhere] });
        return { data, total };
      }
      // 如果有管理权限或管理员权限，继续执行下面的代码，可以看到所有资源
    } else {
      // 未登录用户只能看到 ACTIVE 状态的资源
      where.status = ResourceStatusEnum.ACTIVE;
    }

    const searchOptions: FindManyOptions<Resource> = {
      where,
      select: resourceColumns.filter(
        (col) => query.columns?.includes(col) || !query.columns,
      ),
      relations: ['category', 'user'],
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

  async download(id: number) {
    await this.resourceRepository.increment({ id }, 'downloadCount', 1)
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
   * 更新资源状态（仅管理员可用）
   * @param id 资源ID
   * @param status 新状态
   * @returns 更新后的资源
   */
  async updateStatus(id: number, status: ResourceStatusEnum) {
    await this.resourceRepository.update(id, { status });
    return await this.resourceRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
    });
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
