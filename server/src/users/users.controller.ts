import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsPermission } from '../global/decorators/permission.decorator';
import { PermissionEnum } from '../global/permissions/permissions.enum';
import { QueryUserDto } from './dto/query-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @IsPermission(PermissionEnum.MANAGE)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @IsPermission(PermissionEnum.MANAGE)
  async findAll(@Query() query: QueryUserDto) {
    return await this.usersService.findAll(query);
  }

  @Get(':id')
  @IsPermission(PermissionEnum.MANAGE)
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(+id);
  }

  @Put()
  @IsPermission(PermissionEnum.MANAGE)
  async update(@Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(updateUserDto);
  }

  @Delete(':ids')
  @IsPermission(PermissionEnum.ADMIN)
  async remove(@Param('ids') ids: number[]) {
    return await this.usersService.remove(ids);
  }
}
