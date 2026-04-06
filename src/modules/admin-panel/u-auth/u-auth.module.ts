import { Module } from '@nestjs/common';
import { UAuthService } from './u-auth.service';
import { UAuthController } from './u-auth.controller';
import { RepositoriesModule } from '@repository/repositories.module';
import { UserJwtTokenService } from './user-jwt-token.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserJwtStrategy } from './strategy/user-jwt.strategy';
import { UJwtAuthGuard } from './guards/jwt-u-auth.guard';

@Module({
  imports: [
    RepositoriesModule,
    JwtModule,
    PassportModule
  ],
  controllers: [UAuthController,],
  providers: [UAuthService, UserJwtStrategy, UJwtAuthGuard, UserJwtTokenService],
})
export class UAuthModule { }
