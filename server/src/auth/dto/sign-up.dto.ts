import { IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { UserInterface } from '../../users/entities/user.interface';

export class SignUpDto implements UserInterface {
  @IsNotEmpty({ message: '用户名不能为空' })
  @MinLength(3, { message: '用户名至少3个字符' })
  @MaxLength(20, { message: '用户名不能超过20个字符' })
  @Matches(/^[a-zA-Z0-9_]+$/, { message: '用户名只能包含字母、数字和下划线' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码至少6个字符' })
  @MaxLength(20, { message: '密码不能超过20个字符' })
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/, {
  //   message: '密码必须包含至少一个字母和一个数字，可包含特殊字符@$!%*?&',
  // })
  password: string;
}
