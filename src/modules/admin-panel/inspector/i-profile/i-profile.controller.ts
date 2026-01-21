import { Controller, Get } from '@nestjs/common';
import { IProfileService } from './i-profile.service';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { UserRole } from '@common/enums/user.enum';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { AdminAuth } from '@common/decorators/admin-panel/admin-auth.decorator';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { User } from '@entity/user/user.entity';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { InspectorProfileResource } from './resource/inspector-profile.resource';

@Controller(`${MODULE_PREFIX.INSPECTOR}/profile`)
@AdminAuth()
@Roles(UserRole.INSPECTOR)
export class IProfileController {
  constructor(private readonly iProfileService: IProfileService) { }


  /**
    * Get current inspector profile
    */
  @Get()
  async getProfile(@CurrentUser() user: User) {
    const inspectorData = await this.iProfileService.getProfile(user.id);
    return ApiResponseUtil.success(
      'Profile fetched successfully',
      new InspectorProfileResource(inspectorData),
    );
  }
}
