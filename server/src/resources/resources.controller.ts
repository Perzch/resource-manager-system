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
} from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { QueryResourceDto } from './dto/query-resource.dto';
import { IsPermission } from 'src/global/decorators/permission.decorator';
import { PermissionEnum } from 'src/global/permissions/permissions.enum';

@Controller('resources')
export class ResourcesController {
  constructor(private readonly productsService: ResourcesService) {}

  @Post()
  @IsPermission(PermissionEnum.WRITE)
  async create(
    @Body(new ValidationPipe()) createResourceDto: CreateResourceDto,
  ) {
    return await this.productsService.create(createResourceDto);
  }

  @Get()
  @IsPermission(PermissionEnum.READ)
  async findAll(@Query() query: QueryResourceDto) {
    return await this.productsService.findAll(query);
  }

  @Get('ids')
  @IsPermission(PermissionEnum.READ)
  async findAllIds() {
    return await this.productsService.findAllColumn('id');
  }

  @Get('names')
  @IsPermission(PermissionEnum.READ)
  async findAllNames() {
    return await this.productsService.findAllColumn('name');
  }

  @Get('name/:name')
  @IsPermission(PermissionEnum.READ)
  async findByName(@Param('name') name: string) {
    return await this.productsService.findByName(name);
  }

  @Get('/:id')
  @IsPermission(PermissionEnum.READ)
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  @Put()
  @IsPermission(PermissionEnum.WRITE)
  update(@Body() updateProductDto: UpdateResourceDto) {
    return this.productsService.update(updateProductDto);
  }

  @Delete(':ids')
  @IsPermission(PermissionEnum.DELETE)
  remove(@Param('ids') ids: string) {
    return this.productsService.remove(ids.split(',').map(Number));
  }
}
