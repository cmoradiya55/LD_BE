import { Controller, Get } from '@nestjs/common';
import { SProfileService } from './s-profile.service';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { UserRole } from '@common/enums/user.enum';
import { AdminAuth } from '@common/decorators/admin-panel/admin-auth.decorator';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { User } from '@entity/user/user.entity';
import { StaffProfileResource } from './resource/staff-profile.resource';


@Controller(`${MODULE_PREFIX.STAFF}/profile`)
@AdminAuth()
@Roles(UserRole.STAFF)
export class SProfileController {
  constructor(private readonly sProfileService: SProfileService) { }

  /**
    * Get current staff profile
    */
  @Get()
  async getProfile(@CurrentUser() user: User) {
    const staffData = await this.sProfileService.getProfile(user.id);
    return ApiResponseUtil.success(
      'Profile fetched successfully',
      new StaffProfileResource(staffData),
    );
  }
}
