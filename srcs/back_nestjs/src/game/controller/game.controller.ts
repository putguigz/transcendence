import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessageBody } from '@nestjs/websockets';
import { Request } from 'express';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { UserEntity } from 'src/user/models/user.entity';
import { IGameStat, IInfoGame, IInfoRoom } from '../class/room.class';
import { CreateRoomDto } from '../dto/createRoom.dto';
import { GameGateway } from '../game.gateway';
import { GameService } from '../service/game.service';

@Controller('game')
@UseInterceptors(ClassSerializerInterceptor)
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('rooms')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getRoom(@Req() req: Request): Promise<IInfoRoom[]> {
    return this.gameService.getCurrentRooms();
  }

  @Get('history')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getHistory(@Req() req: Request): Promise<IGameStat[]> {
    return this.gameService.getHistory(req.user);
  }

  @Get('friends-log')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  getFriendsLog(@Req() req: Request): UserEntity[] {
    return this.gameService.getFriendsLog(req.user);
  }

  @Post('invite')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  invite(@Req() req: Request, @MessageBody() data: CreateRoomDto): string {
    //TODO game mode
    console.log(data);
    return this.gameService.invite(
      data.invitation_user_id,
      data.mode,
      req.user,
    );
  }

  /*@Get()
  async index(): Promise<RoomEntity[]> {
    return await this.gameService.findAll();
  }*/

  /*@Get('/del')
  async detail() {
    await this.gameService.deleteUser();
  }*/
}
