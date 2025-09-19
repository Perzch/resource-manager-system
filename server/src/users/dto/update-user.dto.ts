import { IsOptional, IsEnum, IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { PermissionEnum } from 'src/global/permissions/permissions.enum';

export class UpdateUserDto {
  @IsNumber({}, { message: 'id必须是数字' })
  id: number;

  @IsOptional()
  @IsNotEmpty({ message: '用户名不能为空' })
  username?: string;

  @IsOptional()
  @IsNotEmpty({ message: '密码不能为空' })
  password?: string;

  @IsOptional()
  @IsEnum(PermissionEnum, { message: '无效的权限枚举值' })
  role?: PermissionEnum;

  @IsOptional()
  @IsBoolean({ message: '状态必须是布尔值' })
  status?: boolean;
}