import { Controller, Get } from '@nestjs/common';
import { MProfileService } from './m-profile.service';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { AdminAuth } from '@common/decorators/admin-panel/admin-auth.decorator';
import { UserRole } from '@common/enums/user.enum';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { User } from '@entity/user/user.entity';
import { ManagerProfileResource } from './resource/manager-profile.resource';

@Controller(`${MODULE_PREFIX.MANAGER}/profile`)
@AdminAuth()
@Roles(UserRole.MANAGER)
export class MProfileController {
  constructor(private readonly mProfileService: MProfileService) { }

  /**
    * Get current manager profile
    */
  @Get()
  async getProfile(@CurrentUser() user: User) {
    const managerData = await this.mProfileService.getProfile(user.id);
    return ApiResponseUtil.success(
      'Profile fetched successfully',
      new ManagerProfileResource(managerData),
    );
  }
}
