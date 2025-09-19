import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResourceInterface } from './resource.interface';

@Entity()
export class Resource implements ResourceInterface {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @IsNotEmpty({ message: '资源名称不能为空' })
  name: string;
  @Column({ nullable: true })
  description?: string;
  @Column({ nullable: true })
  icon?: string;
  @Column()
  link: string;
  @Generated('increment')
  @Column()
  downloadCount: number;
  @CreateDateColumn()
  createDate: Date;
  @ManyToOne(() => Category, (category) => category.resources, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  category: Category;
}

export const resourceColumns: (keyof Resource)[] = [
  'id',
  'name',
  'description',
  'icon',
  'link',
  'downloadCount',
  'createDate',
  'category',
];
