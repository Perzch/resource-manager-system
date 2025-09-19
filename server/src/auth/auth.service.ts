import {
  Inject,
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { UsersService } from 'src/users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  async signUp(signUpDto: SignUpDto) {
    // 检查用户名是否已存在
    const existingUser = await this.usersService.findByUsername(
      signUpDto.username,
    );
    if (existingUser) {
      throw new ConflictException('用户名已存在');
    }

    // 使用 UsersService 创建用户，密码会自动加密
    const user = await this.usersService.create({
      username: signUpDto.username,
      password: signUpDto.password,
    });

    // 返回用户信息（不包含密码）
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userInfo } = user;
    return userInfo;
  }

  async signIn(signInDto: SignInDto) {
    // 查找用户
    const user = await this.usersService.findByUsername(signInDto.username);

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 验证密码
    const hashedPassword = this.hashPassword(signInDto.password);
    if (user.password !== hashedPassword) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 检查用户状态
    if (!user.status) {
      throw new UnauthorizedException('用户账户已被禁用');
    }

    // 生成 JWT token
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        status: user.status,
        createDate: user.createDate,
      },
    };
  }
}
