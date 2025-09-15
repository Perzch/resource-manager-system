import { IsByteLength, IsEnum, IsNotEmpty } from 'class-validator';
import Permissions from 'src/global/permissions.enum';

export class SignUpDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsByteLength(6, 20)
  // 满足至少一个字母和一个数字的正则表达式
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/)
  password: string;
  @IsEnum(Permissions)
  role: Permissions;
}
