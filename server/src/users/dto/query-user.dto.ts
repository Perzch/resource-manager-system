import { UserInterface } from '../entities/user.interface';

export class QueryUserDto implements UserInterface {
  username?: string;
}
