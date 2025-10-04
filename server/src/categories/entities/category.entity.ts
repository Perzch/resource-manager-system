import { Resource } from 'src/resources/entities/resource.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryInterface } from './category.interface';
import { MaxLength } from 'class-validator';

@Entity()
export class Category implements CategoryInterface {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({
    nullable: true,
  })
  @MaxLength(255, { message: '推荐语不能超过255个字符' })
  recommend?: string;
  @CreateDateColumn()
  createDate?: Date;

  @OneToMany(() => Resource, (resource) => resource.category)
  resources?: Resource[];
}

export const categoryColumns: (keyof Category)[] = [
  'id',
  'name',
  'recommend',
  'createDate',
  'resources',
];
