import Permissions from 'src/global/permissions.enum';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  role: Permissions; // 使用位运算表示用户权限
}
