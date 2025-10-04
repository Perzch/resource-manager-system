import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsPermission } from '../global/decorators/permission.decorator';
import { PermissionEnum } from '../global/permissions/permissions.enum';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @IsPermission(PermissionEnum.MANAGE)
  async create(@Body() createUserDto: CreateUserDto) { 
    createUserDto.password ??= '123456';
    createUserDto.avatar ??= `avatar/avatar-${Math.floor(Math.random() * 11)}.png`;
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @IsPermission(PermissionEnum.READ)
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @IsPermission(PermissionEnum.MANAGE)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Put()
  @IsPermission(PermissionEnum.READ)
  async update(@Body() updateUserDto: UpdateUserDto, @Request() request:any) {
    if(request.user.id !== updateUserDto.id && (request.user.role & PermissionEnum.ADMIN) !== PermissionEnum.ADMIN) {
      // 只能修改自己的信息，除非是管理员
      throw new BadRequestException('只能修改自己的信息');
    }
    return await this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  @IsPermission(PermissionEnum.ADMIN)
  async remove(@Param('id') id: string) {;
    return await this.usersService.remove(+id);
  }
}
