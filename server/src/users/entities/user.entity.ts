import { PermissionEnum } from 'src/global/permissions/permissions.enum';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { UserInterface } from './user.interface';

@Entity()
@Unique(['username'])
export class User implements UserInterface {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  role: PermissionEnum; // 使用位运算表示用户权限
}
