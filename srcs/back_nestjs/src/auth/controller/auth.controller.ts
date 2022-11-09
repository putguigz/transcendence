import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Redirect,
  Req,
  Request,
  SerializeOptions,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/models/user.entity';
import FortyTwoGuard from '../guard/fortyTwo.guard';
import GoogleGuard from '../guard/google.guard';
import JwtGuard from '../guard/jwt.guard';
import JwtTwoFactorGuard from '../guard/jwtTwoFactor.guard';
import { AuthService } from '../service/auth.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  @Get('profile')
  getProfile(@Request() req): UserEntity {
    return req.user;
  }

  @UseGuards(JwtGuard)
  @Get('isTwoFactor')
  isTwoFactor(@Request() req): { isTwoFactor: boolean } {
    const user = req.user;
    let isTwoFactor = false;
    if (user.enabled2FA) {
      isTwoFactor = true;
    }
    return { isTwoFactor: isTwoFactor };
  }

  @UseGuards(FortyTwoGuard)
  @Get('oauth42')
  @Redirect(process.env.FRONT_URL, 301)
  async oauthFortyTwo(@Req() req) {
    // TODO Interface
    const user = req.user;
    if (!user) throw new UnauthorizedException('User not found');
    const accessToken = await this.authService.getCookie(user);

    req.res.cookie(process.env.COOKIE_NAME, accessToken, {
      httpOnly: false,
      path: '/',
    });
    return user;
  }

  @UseGuards(GoogleGuard)
  @Get('oauthGoogle')
  @Redirect(process.env.FRONT_URL, 301)
  async oauthGoogle(@Req() req) {
    const user = req.user;
    if (!user) throw new UnauthorizedException('User not found');
    const accessToken = await this.authService.getCookie(user);

    req.res.cookie(process.env.COOKIE_NAME, accessToken, {
      httpOnly: false,
      path: '/',
    });
    return user;
  }

  @UseGuards(JwtGuard)
  @Get('logout')
  async logout(@Request() req) {
    req.res.clearCookie(process.env.COOKIE_NAME);
    return { message: 'Logout' };
  }
}
