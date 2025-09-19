import { GeneralParam } from 'src/global/general.param';
import { User } from '../entities/user.entity';
import { UserInterface } from '../entities/user.interface';

export class QueryUserDto extends GeneralParam<User> implements UserInterface {
  username?: string;
}
