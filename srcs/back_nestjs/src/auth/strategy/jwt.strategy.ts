import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from 'src/user/service/user.service';
import { IPayload } from "../models/payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          console.log('hello')
          const cookie = request?.cookies['AuthToken'];
          console.log('cookie', cookie)
          return cookie ? cookie.access_token : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'secret', // TODO edit that
    });
  }

  async validate(payload: IPayload) {  // TODO all check for validate jeton
    console.log('validate')
    console.log('payloade', payload)
    //console.log(payload)
    //console.log( await this.userService.findByName(payload.username));
    return await this.userService.findById(payload.sub);
  }
}
