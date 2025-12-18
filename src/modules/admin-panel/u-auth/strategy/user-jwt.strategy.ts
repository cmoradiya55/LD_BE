import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CustomerRepository } from '@repository/customer/customer.repository';
import { UserRepository } from '@repository/user/user.repository';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy, 'user-jwt') {
    constructor(
        private configService: ConfigService,
        private userRepo: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('adminJwt.secret'),
        });
    }

    async validate(payload: any) {
        const user = await this.userRepo.findActiveUserById(payload.sub, payload.jwt_version);

        if (!user) {
            throw new UnauthorizedException('User not found or inactive');
        }

        return user;
    }
}