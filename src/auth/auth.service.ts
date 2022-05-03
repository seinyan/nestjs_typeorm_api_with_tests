import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { NoticeService } from '../notice/notice.service';
import { LoginResultDto } from './result/login-result.dto';
import { AccessTokenResultDto } from './result/access-token-result.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly noticeService: NoticeService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(user: User) {
    await this.noticeService.addEmailNotice(
      user.email,
      'You login',
      'auth/login.hbs',
      {
        id: user.id,
        username: user.email,
        msg: 'You login',
      },
    );

    return {
      accessToken: await this.generateJWTToken(user),
      refreshToken: await this.generateRefreshToken(user),
    } as LoginResultDto;
  }

  async accessToken(user: User) {
    return {
      accessToken: await this.generateJWTToken(user),
    } as AccessTokenResultDto;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user: User = await this.userService.findByUsername(username);
    if (
      user &&
      user.isActive === true &&
      (await bcrypt.compare(password, user.password))
    ) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async generateJWTToken(user: User) {
    const payload = {
      username: user.email,
      id: user.id,
      sub: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(user: User) {
    const payload = {
      username: user.email,
      id: user.id,
      sub: user.id,
      role: user.role,
    };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES'),
    });
  }
}
