import { Module } from '@nestjs/common';
import { CAuthService } from './c-auth.service';
import { CAuthController } from './c-auth.controller';

@Module({
  controllers: [CAuthController],
  providers: [CAuthService],
})
export class CAuthModule {}
