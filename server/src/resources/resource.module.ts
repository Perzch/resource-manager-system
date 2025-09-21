import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { CategoryModule } from 'src/categories/category.module';

@Module({
  imports: [TypeOrmModule.forFeature([Resource]), CategoryModule],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
