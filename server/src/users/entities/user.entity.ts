import { PermissionEnum } from 'src/global/permissions/permissions.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserInterface } from './user.interface';
import { Resource } from 'src/resources/entities/resource.entity';

@Entity()
@Unique(['username'])
export class User implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: `avatar/avatar-${Math.floor(Math.random() * 11)}.png` })
  avatar: string;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  @Column({
    default: true,
  })
  status: boolean;
  @CreateDateColumn()
  createDate: Date;
  @Column({
    default: PermissionEnum.READ,
  })
  role: PermissionEnum; // 使用位运算表示用户权限

  @OneToMany(() => Resource, (resource) => resource.user)
  resources: Resource[];
}

export const userColumns: (keyof User)[] = [
  'id',
  'avatar',
  'username',
  'status',
  'createDate',
  'role',
  'resources',
];
