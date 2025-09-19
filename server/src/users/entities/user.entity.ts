import { PermissionEnum } from 'src/global/permissions/permissions.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserInterface } from './user.interface';

@Entity()
@Unique(['username'])
export class User implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;
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
}

export const userColumns: (keyof User)[] = [
  'id',
  'username',
  'status',
  'createDate',
  'role',
];
