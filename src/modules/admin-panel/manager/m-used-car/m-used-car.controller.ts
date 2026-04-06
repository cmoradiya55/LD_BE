import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MUsedCarService } from './m-used-car.service';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { User } from '@entity/user/user.entity';
import { GetUsedCarQueryDto } from './dto/get-inspector.dto';
import { AdminAuth } from '@common/decorators/admin-panel/admin-auth.decorator';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { UserRole } from '@common/enums/user.enum';
import { ManagerUsedCarListingResource } from './resource/manager-used-car-listing.resource';
import { MAssignInspectorDto } from './dto/m-assign-inspector.dto';
import { GetInspectionReportParamDto } from './dto/get-inspection-report.dto';
import { GetInspectionReportResource } from './resource/get-inspection-report.resource';
import { MApproveAndSuggestPriceDto, MApproveAndSuggestPriceParamDto } from './dto/approve-and-suggest-price.dto';

@Controller(`${MODULE_PREFIX.MANAGER}/used-car`)
@AdminAuth()
@Roles(UserRole.MANAGER)
export class MUsedCarController {
  constructor(private readonly mUsedCarService: MUsedCarService) { }

  @Get()
  async getUsedCars(
    @CurrentUser() user: User,
    @Query() query: GetUsedCarQueryDto,
  ) {
    const { data, page, limit, total } = await this.mUsedCarService.getUsedCars(user, query);
    return ApiResponseUtil.paginated(
      'Cars fetched successfully',
      // data,
      ManagerUsedCarListingResource.collection(data),
      page,
      limit,
      total,
    );
  }

  @Get(':usedCarId/inspection-report')
  async getInspectionReport(
    @CurrentUser() user: User,
    @Param() param: GetInspectionReportParamDto
  ) {
    const report = await this.mUsedCarService.getInspectionReport(user, param);
    return ApiResponseUtil.success(
      'Inspection report fetched successfully',
      new GetInspectionReportResource(report)
    );
  }

  @Post('assign-inspector')
  async assignInspector(
    @Body() body: MAssignInspectorDto,
    @CurrentUser() user: User,
  ) {
    await this.mUsedCarService.assignInspector(user, body);
    return ApiResponseUtil.success('Inspector assigned successfully');
  }

  @Patch(':usedCarId/approve')
  async approveUsedCar(
    @Param() param: MApproveAndSuggestPriceParamDto,
    @Body() body: MApproveAndSuggestPriceDto,
    @CurrentUser() user: User,
  ) {
    await this.mUsedCarService.approveUsedCarAndSuggestPrice(user, param, body);
    return ApiResponseUtil.success('Used car approved successfully');
  }
}
