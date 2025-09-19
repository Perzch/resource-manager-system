import { Resource } from 'src/resources/entities/resource.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryInterface } from './category.interface';

@Entity()
export class Category implements CategoryInterface {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({
    nullable: true,
  })
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
