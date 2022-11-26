import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { canvas_back_height } from './const/const';
import { GameService } from './service/game.service';
import { PaddleDto } from './dto/paddle.dto';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { GameStatEntity } from './entity/gameStat.entity';
import { AuthService } from 'src/auth/service/auth.service';
import Room, { RoomStatus, Winner } from './class/room.class';
import { throwError } from 'rxjs';

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private gameService: GameService,
    private authService: AuthService,
  ) {}

  private allUsers: Map<string, Socket> = new Map();

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GameGateway');

  async handleConnection(client: Socket) {
    const user = await this.authService.validateSocket(client);
    this.allUsers.set(user.id, client);
    this.logger.log(`Client GAME connected: ${user.username}`);
  }

  async handleDisconnect(client: Socket) {
    const user = await this.authService.validateSocket(client);
    this.logger.log(`Client GAME disconnected: ${user.username}`);

    const room = this.gameService.findRoomBySocket(client);
    if (room && room.status === RoomStatus.WAITING && room.p1_id === user.id) {
      this.gameService.deleteRoomById(room.id);
    }

    this.gameService.leaveRoom(null, client);
    this.allUsers.delete(user.id);

    client.disconnect();
  }

  ///////////////////////////////////////////////
  //////////////// CREATE ROOM
  ///////////////////////////////////////////////

  @SubscribeMessage('matchmaking')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateRoomDto,
  ) {
    const user = await this.authService.validateSocket(client);

    const room: Room = this.gameService.findRoom(user, data.mode);

    if (room && user) {
      if (room.status === RoomStatus.EMPTY) {
        room.game_mode = data.mode;
        room.p1_id = user.id;
        room.p1_SocketId = client.id;
        room.status = RoomStatus.WAITING;

        this.gameService.joinRoom(room.id, client, this.server);
        this.server.to(room.id).emit('updateGame', room);
      } else if (room.status === RoomStatus.WAITING) {
        room.p2_id = user.id;
        room.p2_SocketId = client.id;
        room.status = RoomStatus.PLAYING;

        this.gameService.joinRoom(room.id, client, this.server);
        this.server.to(room.id).emit('updateGame', room);
        this.gameService.launchGame(room, this.server, this.allUsers);
      }
    }
  }

  ///////////////////////////////////////////////
  //////////////// ROOM/
  ///////////////////////////////////////////////

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room_id: string,
  ) {
    console.log('joinRoom');
    this.gameService.joinRoom(room_id, client, this.server);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room_id: string,
  ) {
    const user = await this.authService.validateSocket(client);

    const room: Room = this.gameService.getRoomById(room_id);

    if (room && room.status === RoomStatus.WAITING && room.p1_id === user.id) {
      this.gameService.deleteRoomById(room.id);
    }

    this.gameService.leaveRoom(room_id, client);
  }

  ///////////////////////////////////////////////
  //////////////// PADDLE DATA
  ///////////////////////////////////////////////

  @SubscribeMessage('setPaddle')
  async setPaddle(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: PaddleDto,
  ) {
    const room = this.gameService.getRoomById(data.room_id);
    if (!room) return;

    const user = await this.authService.validateSocket(client);
    if (!user) return;

    if (room.p1_id === user.id) {
      room.p1_y_paddle =
        (data.positionY * canvas_back_height) / data.front_canvas_height;
    } else if (room.p2_id === user.id) {
      room.p2_y_paddle =
        (data.positionY * canvas_back_height) / data.front_canvas_height;
    }
  }
  ///////////////////////////////////////////////
}
