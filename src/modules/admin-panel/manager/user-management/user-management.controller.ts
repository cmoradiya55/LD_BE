import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { MUserManagementService } from './user-management.service';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { UserRole } from '@common/enums/user.enum';
import { AdminAuth } from '@common/decorators/admin-panel/admin-auth.decorator';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { User } from '@entity/user/user.entity';
import { GetInspectorQueryDto } from './dto/get-inspector.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { GetInspectorResource } from './resource/get-inspector.resource';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { ToggleInspectorStatusDto } from './dto/toggle-inspector-status.dto';

@Controller(`${MODULE_PREFIX.MANAGER}/user-management`)
@AdminAuth()
@Roles(UserRole.MANAGER)
export class MUserManagementController {
  constructor(private readonly userManagementService: MUserManagementService) { }

  @Get('inspectors')
  async getInspectorsByManager(
    @CurrentUser() user: User,
    @Query() query: GetInspectorQueryDto,
  ) {
    const { data, page, limit, total } = await this.userManagementService.getInspectors(user, query);
    return ApiResponseUtil.paginated(
      'Users fetched successfully',
      GetInspectorResource.collection(data),
      page,
      limit,
      total,
    );
  }


  @Patch('inspectors/:id/toggle')
  async toggleInspectorStatus(
    @CurrentUser('id') managerId: number,
    @Param() dto: ToggleInspectorStatusDto,
  ) {
    await this.userManagementService.toggleInspectorStatus(managerId, dto);
    return ApiResponseUtil.success('Status toggled successfully');
  }
}
