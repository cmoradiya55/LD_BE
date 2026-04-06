import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { VehicleVerificationService } from './vehicle-verification.service';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { UserRole } from '@common/enums/user.enum';
import { AdminAuth } from '@common/decorators/admin-panel/admin-auth.decorator';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { User } from '@entity/user/user.entity';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { UpdateVehicleDetailsDto, UpdateVehicleDetailsParamDto } from './dto/update-vehicle-detail.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { GetVehicleDetailResource } from './resource/get-vehicle-detail.resource';
import { GetVehicleListQueryDto } from './dto/get-vehicle-list.dto';
import { GetVehicleListingResource } from './resource/get-vehicle-list.resource';

@Controller(`${MODULE_PREFIX.STAFF}/vehicles`)
@AdminAuth()
@Roles(UserRole.STAFF)
export class VehicleVerificationController {
  constructor(private readonly vehicleVerificationService: VehicleVerificationService) { }

  @Patch(':id/details')
  async updateVehicleDetails(
    @Param() param: UpdateVehicleDetailsParamDto,
    @Body() body: UpdateVehicleDetailsDto,
    @CurrentUser() user: User,
  ) {
    await this.vehicleVerificationService.updateVehicleDetails(user, param, body);
    return ApiResponseUtil.updated("Vehicle details updated successfully");
  }

  @Get()
  async getVehicleList(
    @Query() query: GetVehicleListQueryDto,
  ) {
    const { data, page, limit, total } = await this.vehicleVerificationService.getVehicleList(query);
    return ApiResponseUtil.paginated(
      'Cars fetched successfully',
      GetVehicleListingResource.collection(data),
      page,
      limit,
      total,
    );
  }

  @Get(':id/details')
  async getVehicleDetails(
    @Param('id') id: number,
  ) {
    const vehicleDetails = await this.vehicleVerificationService.getVehicleDetails(id);
    return ApiResponseUtil.success(
      "Vehicle details fetched successfully",
      new GetVehicleDetailResource(vehicleDetails)
    );
  }
}
