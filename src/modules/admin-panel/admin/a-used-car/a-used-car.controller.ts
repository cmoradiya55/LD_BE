import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { AUsedCarService } from './a-used-car.service';
import { GetAllUsedCarsForAdminDto } from './dto/get-all-used-cars-for-admin.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { GetAllUsedCarsForAdminResource } from './resource/get-all-used-car-for-admin.resource';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { AdminAuth } from '@common/decorators/admin-panel/admin-auth.decorator';
import { UserRole } from '@common/enums/user.enum';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { GetUsedCarDetailForAdminParamDto } from './dto/get-used-car-detail.dto';
import { GetUsedCarDetailForAdminResource } from './resource/get-used-car-detail-for-admin.resource';
import { UsedCarChangeStatusDto, UsedCarChangeStatusParamDto } from './dto/used-car-chnage-status.dto';

@Controller(`${MODULE_PREFIX.ADMIN}/used-cars`)
@AdminAuth()
@Roles(UserRole.ADMIN)
export class AUsedCarController {
  constructor(private readonly aUsedCarService: AUsedCarService) { }

  @Get()
  async getAllUsedCars(
    @Query() query: GetAllUsedCarsForAdminDto
  ) {
    const { data, total, page, limit } = await this.aUsedCarService.getAllUsedCars(query);
    return ApiResponseUtil.paginated(
      'All used cars fetched successfully',
      GetAllUsedCarsForAdminResource.collection(data),
      page,
      limit,
      total,
    );
  }

  @Get(':id')
  async getUsedCarDetail(
    @Param() param: GetUsedCarDetailForAdminParamDto
  ) {
    const data = await this.aUsedCarService.getUsedCarDetail(param);
    return ApiResponseUtil.success(
      'Used car fetched successfully',
      new GetUsedCarDetailForAdminResource(data),
    );
  }

  @Patch(':id/status')
  async updateUsedCarStatus(
    @Param() param: UsedCarChangeStatusParamDto,
    @Body() body: UsedCarChangeStatusDto
  ) {
    const { message } = await this.aUsedCarService.updateUsedCarStatus(param, body);
    return ApiResponseUtil.success(
      message,
    );
  }
}
