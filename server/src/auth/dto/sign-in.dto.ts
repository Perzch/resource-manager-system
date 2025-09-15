import { OmitType } from '@nestjs/mapped-types';
import { IsByteLength, IsNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class SignInDto extends OmitType(User, ['id']) {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  @IsByteLength(6, 20)
  password: string;
}
