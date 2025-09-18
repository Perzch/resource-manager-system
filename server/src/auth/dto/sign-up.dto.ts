import { IsByteLength, IsNotEmpty } from 'class-validator';
import { UserInterface } from '../../users/entities/user.interface';

export class SignUpDto implements UserInterface {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsByteLength(6, 20)
  // 满足至少一个字母和一个数字的正则表达式
  // @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/)
  password: string;
}
