// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { TokenPayload } from '../interface/token-payload.interface';
// import { CustomerService } from '@modules/customer/customer.service';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//     constructor(private readonly config: ConfigService, private readonly customerService: CustomerService) {
//         super({
//             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//             secretOrKey: config.getOrThrow<string>('jwt.access_secret'),
//         });
//     }

//     async validate(payload: TokenPayload) {
//         const user = await this.customerService.getUserByIdAndCode(payload.sub, payload.code);
//         if (user.jwt_version !== payload.version) {
//             throw new UnauthorizedException('Session expired, please login again');
//         }
//         return user;
//     }
// }

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CustomerRepository } from '@repository/customer/customer.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private customerRepo: CustomerRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        const customer = await this.customerRepo.findById(payload.sub);

        if (!customer || !customer.is_active || customer.is_blocked) {
            throw new UnauthorizedException('User not found or inactive');
        }

        return customer;
    }
}