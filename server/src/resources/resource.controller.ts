import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ValidationPipe,
  Put,
  Request,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { QueryResourceDto } from './dto/query-resource.dto';
import { IsPermission } from 'src/global/decorators/permission.decorator';
import { PermissionEnum } from 'src/global/permissions/permissions.enum';
import { ResourceStatusEnum } from './entities/resource.status.enum';

@Controller('resource')
export class ResourceController {
  constructor(private readonly productsService: ResourceService) {}

  @Post()
  @IsPermission(PermissionEnum.WRITE)
  async create(
    @Body(new ValidationPipe()) createResourceDto: CreateResourceDto,
    @Request() request: any,
  ) {
    createResourceDto.user = request.user;
    return await this.productsService.create(createResourceDto);
  }

  @Get()
  @IsPermission(PermissionEnum.READ)
  async findAll(@Query() query: QueryResourceDto, @Request() request: any) {
    query.owner &&= request.user.id;
    return await this.productsService.findAll(query, request.user);
  }

  @Get('/:id')
  @IsPermission(PermissionEnum.READ)
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  @Get('download/:id')
  @IsPermission(PermissionEnum.READ)
  async download(@Param('id') id: string) {
    return await this.productsService.download(+id);
  }

  @Put()
  @IsPermission(PermissionEnum.WRITE)
  update(@Body() updateProductDto: UpdateResourceDto, @Request() request: any) {
    // MANAGE 和 ADMIN 权限的用户可以修改任意资源
    const userPermissions = request.user.role || 0;  // 使用 role 字段而不是 permissions
    
    // 调试信息
    console.log('User role (permissions):', userPermissions);
    console.log('MANAGE permissions:', PermissionEnum.MANAGE);
    console.log('ADMIN permissions:', PermissionEnum.ADMIN);
    console.log('User ID:', request.user.id);
    console.log('Resource User ID:', updateProductDto.user?.id);
    
    // 检查用户是否具有 MANAGE 或 ADMIN 权限
    const hasManagePermission = (userPermissions & PermissionEnum.MANAGE) === PermissionEnum.MANAGE;
    const hasAdminPermission = (userPermissions & PermissionEnum.ADMIN) === PermissionEnum.ADMIN;
    const canManageAll = hasManagePermission || hasAdminPermission;
    
    console.log('Has MANAGE permission:', hasManagePermission);
    console.log('Has ADMIN permission:', hasAdminPermission);
    console.log('Can manage all:', canManageAll);
    
    if (!canManageAll && updateProductDto.user?.id !== request.user.id) {
      throw new BadRequestException('只能修改自己的资源');
    }
    return this.productsService.update(updateProductDto);
  }

  @Patch(':id/status')
  @IsPermission(PermissionEnum.MANAGE)
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ResourceStatusEnum },
  ) {
    if (![ResourceStatusEnum.ACTIVE, ResourceStatusEnum.INACTIVE].includes(body.status)) {
      throw new BadRequestException('只能在 ACTIVE 和 INACTIVE 状态之间切换');
    }
    return await this.productsService.updateStatus(+id, body.status);
  }

  @Delete(':ids')
  @IsPermission(PermissionEnum.DELETE)
  remove(@Param('ids') ids: string, @Request() request: any) {
    const idsArray = ids.split(',').map((id) => +id);
    return this.productsService.remove(idsArray);
  }
}
