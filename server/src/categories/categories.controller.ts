import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { IsPermission } from '../global/decorators/permission.decorator';
import { PermissionEnum } from '../global/permissions/permissions.enum';
import { QueryCategoryDto } from './dto/query-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @IsPermission(PermissionEnum.WRITE)
  async create(
    @Body(new ValidationPipe()) createCategoryDto: CreateCategoryDto,
  ) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @IsPermission(PermissionEnum.READ)
  async findAll(@Query() query: QueryCategoryDto) {
    return await this.categoriesService.findAll(query);
  }

  @Get('names')
  @IsPermission(PermissionEnum.READ)
  async findAllName() {
    const categories = await this.categoriesService.findAllName();
    return categories;
  }

  @Get(':id')
  @IsPermission(PermissionEnum.READ)
  async findOne(@Param('id') id: string) {
    return await this.categoriesService.findOne(+id);
  }

  @Put()
  @IsPermission(PermissionEnum.WRITE)
  async update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesService.update(updateCategoryDto);
  }

  @Delete(':ids')
  @IsPermission(PermissionEnum.DELETE)
  async remove(@Param('ids') ids: string) {
    return await this.categoriesService.remove(ids.split(',').map(Number));
  }
}
