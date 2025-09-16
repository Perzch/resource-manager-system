import { IsByteLength, IsNotEmpty } from 'class-validator';
import { UserInterface } from '../../users/entities/user.interface';

export class SignInDto implements UserInterface {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsByteLength(6, 20)
  password: string;
}
