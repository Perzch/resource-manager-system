import { IsNotEmpty } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  @IsNotEmpty({ message: '资源名称不能为空' })
  name: string;
  @Column({ nullable: true })
  description?: string;
  @Column()
  icon?: string;
  @Column({ nullable: true })
  link?: string;
  @Column({ default: 0 })
  viewCount: number;
  @Column({ default: 0 })
  downloadCount: number;
  @Column({ default: new Date(), update: false })
  createDate: Date;
  @ManyToOne(() => Category, (category) => category.resources, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  category: Category;
}
