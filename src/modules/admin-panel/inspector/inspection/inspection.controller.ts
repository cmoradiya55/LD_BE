import { Body, Controller, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { InspectionService } from './inspection.service';
import { UserRole } from '@common/enums/user.enum';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { AdminAuth } from '@common/decorators/admin-panel/admin-auth.decorator';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { User } from '@entity/user/user.entity';
import { StartInspectionDto } from './dto/start-inspection.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { SaveInspectionDraftDto, SaveInspectionDraftParamDto } from './dto/save-inspection.dto';
import { AssignedCarListingResource } from './resource/assigned-car-list.resource';
import { GetAssignedCarQueryDto } from './dto/get-assigned-car.dto';
import { CompleteInspectionParamDto } from './dto/complete-inpection.dto';
import { GetInspectionDetailResource } from './resource/get-inspection-detail.resource';

@Controller(`${MODULE_PREFIX.INSPECTOR}/inspection`)
@AdminAuth()
@Roles(UserRole.INSPECTOR)
export class InspectionController {
  constructor(private readonly inspectionService: InspectionService) { }

  @Get('cars')
  async getAssignedCars(
    @CurrentUser() user: User,
    @Query() query: GetAssignedCarQueryDto,
  ) {
    const { data, page, limit, total } = await this.inspectionService.getAssignedCars(user, query);
    console.log('Assigned Cars Data:', data);
    return ApiResponseUtil.paginated(
      'Cars fetched successfully',
      // data,
      AssignedCarListingResource.collection(data),
      page,
      limit,
      total,
    );
  }

  @Post('start')
  async startInspection(
    @CurrentUser() user: User,
    @Body() body: StartInspectionDto,
  ) {
    const { code, message } = await this.inspectionService.startInspection(user, body);
    return code === HttpStatus.ALREADY_REPORTED 
      ? ApiResponseUtil.alreadyReported(message)
      : ApiResponseUtil.success(message);
  }

  @Post(':usedCarId/progress')
  async saveProgress(
    @Param() param: SaveInspectionDraftParamDto,
    @CurrentUser() user: User,
    @Body() body: SaveInspectionDraftDto,
  ) {
    const data = await this.inspectionService.saveInspectionProgress(param, user, body);
    return ApiResponseUtil.success(
      'Inspection progress saved successfully',
      new GetInspectionDetailResource(data),
    );
  }

  @Post(':usedCarId/complete')
  async completeInspection(
    @Param() param: CompleteInspectionParamDto,
    @CurrentUser() user: User,
  ) {
    await this.inspectionService.completeInspection(user, param);
    return ApiResponseUtil.success(
      'Inspection completed successfully',
    );
  }

  @Get(':usedCarId/details')
  async getInspectionDetails(
    @Param('usedCarId') usedCarId: number,
    @CurrentUser() user: User,
  ) {
    const data = await this.inspectionService.getInspectionDetails(user, usedCarId);
    // Implementation for fetching inspection details can be added here
    return ApiResponseUtil.success(
      'Inspection details fetched successfully',
      new GetInspectionDetailResource(data),
    );
  }
}
