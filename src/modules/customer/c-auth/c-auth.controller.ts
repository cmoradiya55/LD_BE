import { Controller } from '@nestjs/common';
import { CAuthService } from './c-auth.service';

@Controller('c-auth')
export class CAuthController {
  constructor(private readonly cAuthService: CAuthService) {
    
  }
}
