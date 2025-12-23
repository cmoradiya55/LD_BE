import { Body, Controller, Post } from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { UserRole } from '@common/enums/user.enum';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { AdminAuth } from '@common/decorators/admin-panel/admin-auth.decorator';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { User } from '@entity/user/user.entity';
import { StartInspectionDto } from './dto/start-inspection.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';

@Controller(`${MODULE_PREFIX.INSPECTOR}/inspection`)
@AdminAuth()
@Roles(UserRole.INSPECTOR)
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) { }

  @Post('start')
  async startInspection(
    @CurrentUser() user: User,
    @Body() body: StartInspectionDto,
  ) {
    await this.inspectionService.startInspection(user, body);
    return ApiResponseUtil.success(
      'Inspection started successfully',
    );
  }

  @Post('save-progress')
  async saveProgress(
    @CurrentUser() user: User,
    @Body() body: any,
  ) {
    await this.inspectionService.saveInspectionProgress();
    // Implementation for saving progress in an inspection workflow
    return ApiResponseUtil.success(
      'Inspection progress saved successfully',
    );
  }

  @Post('complete')
  async completeInspection() {
    // Implementation for completing an inspection workflow
    return ApiResponseUtil.success(
      'Inspection completed successfully',
    );
  }
}
