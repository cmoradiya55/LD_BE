import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { MInspectionService } from './m-inspection.service';
import { UserRole } from '@common/enums/user.enum';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { AdminAuth } from '@common/decorators/admin-panel/admin-auth.decorator';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { User } from '@entity/user/user.entity';
import { MSaveInspectionDraftDto, MSaveInspectionDraftParamDto } from './dto/save-inspection.dto';
import { MCompleteInspectionParamDto } from './dto/complete-inpection.dto';
import { MStartInspectionDto } from './dto/start-inspection.dto';
import { MGetInspectionDetailResource } from './resource/m-get-inspection-detail.resource';

@Controller(`${MODULE_PREFIX.MANAGER}/inspection`)
@AdminAuth()
@Roles(UserRole.MANAGER)
export class MInspectionController {
  constructor(private readonly mInspectionService: MInspectionService) { }

  @Post('start')
  async startInspection(
    @CurrentUser() user: User,
    @Body() body: MStartInspectionDto,
  ) {
    const { code, message } = await this.mInspectionService.startInspection(user, body);
    return code === HttpStatus.ALREADY_REPORTED
      ? ApiResponseUtil.alreadyReported(message)
      : ApiResponseUtil.success(message);
  }

  @Post(':usedCarId/progress')
  async saveProgress(
    @Param() param: MSaveInspectionDraftParamDto,
    @CurrentUser() user: User,
    @Body() body: MSaveInspectionDraftDto,
  ) {
    const data = await this.mInspectionService.saveInspectionProgress(param, user, body);
    return ApiResponseUtil.success(
      'Inspection progress saved successfully',
      new MGetInspectionDetailResource(data),
    );
  }

  @Post(':usedCarId/complete')
  async completeInspection(
    @Param() param: MCompleteInspectionParamDto,
    @CurrentUser() user: User,
  ) {
    await this.mInspectionService.completeInspection(user, param);
    return ApiResponseUtil.success(
      'Inspection completed successfully',
    );
  }

  @Get(':usedCarId/details')
  async getInspectionDetails(
    @Param('usedCarId') usedCarId: number,
    @CurrentUser() user: User,
  ) {
    const data = await this.mInspectionService.getInspectionDetails(user, usedCarId);
    // Implementation for fetching inspection details can be added here
    return ApiResponseUtil.success(
      'Inspection details fetched successfully',
      new MGetInspectionDetailResource(data),
    );
  }
}
