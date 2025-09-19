import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, userColumns } from './entities/user.entity';
import { FindManyOptions, FindOptionsWhere, Like, Repository } from 'typeorm';
import { QueryUserDto } from './dto/query-user.dto';
import { createHash } from 'crypto';

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

  async findAll(query: QueryUserDto) {
    const where: FindOptionsWhere<User> = {
      username: Like(`%${query.username || ''}%`),
    };
    
    const options: FindManyOptions<User> = {
      where,
      select: userColumns.filter(col => query.columns?.includes(col) || !query.columns),
      order: {
        [query.sortColumn || 'id']: query.sort || 'asc',
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    };
    
    // 处理列选择,只有在columns存在且长度大于0时才处理
    // if (query.columns && query.columns.length) {
    //   options.select = query.columns.filter(col => userColumns.includes(col));
    // } else {
    //   options.select = userColumns;
    // }
    
    const data = await this.userRepository.find(options);
    const total = await this.userRepository.count({ where });
    
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
    return await this.userRepository.save(user);
  }

  async remove(ids: number[]) {
    return await this.userRepository.delete(ids);
  }
}