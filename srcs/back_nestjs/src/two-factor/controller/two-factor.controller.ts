import { Body, Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserService } from 'src/user/service/user.service';
import { TwoFactorService } from '../service/two-factor.service';

@Controller('2fa')
export class TwoFactorController {
  constructor(
    private readonly twoFactorService: TwoFactorService
    private readonly userService: UserService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('generate')
  async generate(@Res() response: Response, @Request() req) {
    const { otpauthUrl } = await this.twoFactorService.generateTwoFactorSecret(req.user)

    console.log(otpauthUrl)

    return this.twoFactorService.generateQrCode(response, otpauthUrl)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('check-token')
  async verifyToken(@Body() token: string, @Request() req) {
    const valid =  await this.twoFactorService.codeIsValid(token, req.user);

    if (valid) {
      await this.userService.enable2FA(req.user.id)
    } else {
      throw new Error('Invalid token')
    }
  }


}
