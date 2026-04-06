import { Controller, Get } from '@nestjs/common';
import { AProfileService } from './a-profile.service';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { AdminAuth } from '@common/decorators/admin-panel/admin-auth.decorator';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { UserRole } from '@common/enums/user.enum';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { User } from '@entity/user/user.entity';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { AdminProfileResource } from './resource/admin-profile.resource';

@Controller(`${MODULE_PREFIX.ADMIN}/profile`)
@AdminAuth()
@Roles(UserRole.ADMIN)
export class AProfileController {
  constructor(private readonly aProfileService: AProfileService) { }


  /**
  * Get current admin profile
  */
  @Get()
  async getProfile(@CurrentUser() user: User) {
    const adminData = await this.aProfileService.getProfile(user.id);
    return ApiResponseUtil.success(
      'Profile fetched successfully',
      new AdminProfileResource(adminData),
    );
  }

}
