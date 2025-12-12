import { Module } from '@nestjs/common';
import { CAuthService } from './c-auth.service';
import { CAuthController } from './c-auth.controller';
import { RepositoriesModule } from '@repository/repositories.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { CJwtAuthGuard } from './guards/jwt-c-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtTokenService } from './jwt-token.service';
import { CustomerOtpModule } from '@common/providers/customer-otp/customer-otp.module';

@Module({
  imports: [
    CustomerOtpModule,
    RepositoriesModule,
    JwtModule,
    PassportModule
  ],
  controllers: [CAuthController],
  providers: [CAuthService, JwtStrategy, CJwtAuthGuard, JwtTokenService],
})
export class CAuthModule { }
