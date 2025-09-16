import { Resource } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
  @Column({ default: new Date(), update: false })
  createDate?: Date;

  @OneToMany(() => Resource, (resource) => resource.category)
  resources?: Resource[];
}
