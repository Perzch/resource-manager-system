import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ResourceInterface } from './resource.interface';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Resource implements ResourceInterface {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @IsNotEmpty({ message: '资源名称不能为空' })
  name: string;
  @Column({ nullable: true })
  description?: string;
  @Column()
  link: string;
  @Column({ default: 0 })
  downloadCount: number;
  @CreateDateColumn()
  createDate: Date;
  @ManyToOne(() => Category, (category) => category.resources, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  category: Category;

  @ManyToOne(() => User, (user) => user.resources, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;
}

export const resourceColumns: (keyof Resource)[] = [
  'id',
  'name',
  'description',
  'link',
  'downloadCount',
  'createDate',
  'category',
  'user',
];
