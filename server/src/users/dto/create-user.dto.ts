import { IsEmpty, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { PermissionEnum } from 'src/global/permissions/permissions.enum';
import { UserInterface } from '../entities/user.interface';

export class CreateUserDto implements UserInterface {
  @IsEmpty({ message: '不能传入id' })
  id?: number;

  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @IsOptional()
  @IsEnum(PermissionEnum, { message: '无效的权限枚举值' })
  role?: PermissionEnum;
}