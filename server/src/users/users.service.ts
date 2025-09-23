import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, userColumns } from './entities/user.entity';
import { FindManyOptions, FindOptionsWhere, In, Like, Not, Repository } from 'typeorm';
import { QueryUserDto } from './dto/query-user.dto';
import { createHash } from 'crypto';
import { PermissionEnum } from 'src/global/permissions/permissions.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  async create(createUserDto: CreateUserDto) {
    // 加密密码
    const hashedPassword = this.hashPassword(createUserDto.password);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async findAll() {
    // const where: FindOptionsWhere<User> = {
    //   username: Like(`%${query.username || ''}%`),
    // };

    // const options: FindManyOptions<User> = {
    //   where,
    //   select: userColumns.filter(
    //     (col) => query.columns?.includes(col) || !query.columns,
    //   ),
    //   order: {
    //     [query.sortColumn || 'id']: query.sort || 'asc',
    //   },
    //   skip: (query.page - 1) * query.limit,
    //   take: query.limit,
    // };

    // 处理列选择,只有在columns存在且长度大于0时才处理
    // if (query.columns && query.columns.length) {
    //   options.select = query.columns.filter(col => userColumns.includes(col));
    // } else {
    //   options.select = userColumns;
    // }

    const data = await this.userRepository.find({
      select: userColumns
    });
    const total = await this.userRepository.count();

    return { data, total };
  }

  async findOne(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByUsername(username: string) {
    return await this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async update(updateUserDto: UpdateUserDto) {
    // 如果包含密码，需要加密
    if (updateUserDto.password) {
      updateUserDto.password = this.hashPassword(updateUserDto.password);
    }

    const user = await this.userRepository.preload(updateUserDto);
    if(user.role === PermissionEnum.ADMIN) {
      // 不能修改管理员的权限
      throw new BadRequestException('不能修改管理员用户');
    }
    const result = await this.userRepository.save(user)
    result.password = '';
    return result;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id
      }
    })
    if(user.role & PermissionEnum.ADMIN) {
      // 不能删除管理员
      throw new BadRequestException('不能删除管理员用户');
    }
    return await this.userRepository.delete(id);
  }
}
