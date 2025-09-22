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
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { QueryResourceDto } from './dto/query-resource.dto';
import { IsPermission } from 'src/global/decorators/permission.decorator';
import { PermissionEnum } from 'src/global/permissions/permissions.enum';

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
    return await this.productsService.findAll(query);
  }

  @Get('/:id')
  @IsPermission(PermissionEnum.READ)
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  @Put()
  @IsPermission(PermissionEnum.WRITE)
  update(@Body() updateProductDto: UpdateResourceDto, @Request() request: any) {
    if (updateProductDto.user.id !== request.user.id) {
      throw new BadRequestException('只能修改自己的资源');
    }
    return this.productsService.update(updateProductDto);
  }

  @Delete(':ids')
  @IsPermission(PermissionEnum.UPDATE)
  remove(@Param('ids') ids: number[], @Request() request: any) {
    if (ids.includes(request.user.id)) {
      throw new BadRequestException('不能删除自己的资源');
    }
    return this.productsService.remove(ids);
  }
}
