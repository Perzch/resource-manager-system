import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { UserInterface } from '../../users/entities/user.interface';

export class SignInDto implements UserInterface {
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名至少3个字符' })
  @MaxLength(20, { message: '用户名不能超过20个字符' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少6个字符' })
  @MaxLength(20, { message: '密码不能超过20个字符' })
  password: string;
}
