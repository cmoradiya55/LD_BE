import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { InspectionCentreService } from './inspection-centre.service';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { User } from '@entity/user/user.entity';
import { CreateInspectionCentreDto } from './dto/create-inspection-centre.dto';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { UserRole } from '@common/enums/user.enum';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { GetAllInspectionCentresResource } from './resource/get-all-inspection-centres.resource';
import { GetInspectionCentreDetailResource } from './resource/get-inspection-centre-detail.resource';
import { UpdateInspectionCenterParamDto, UpdateInspectionCentreDto } from './dto/update-inspection-centre.dto';
import { AdminPincodeCitySuggestionResource } from './resource/admin-pincode-city-suggestion.resource';
import { AdminCitySuggestionDto } from './dto/admin-city-suggestion.dto';
import { AdminAuth } from '@common/decorators/admin-panel/admin-auth.decorator';

@Controller(`${MODULE_PREFIX.ADMIN}/inspection-centre`)
@AdminAuth()
@Roles(UserRole.ADMIN)
export class InspectionCentreController {
  constructor(private readonly inspectionCentreService: InspectionCentreService) { }

  @Get()
  async inspectionCentreDetails() {
    const data = await this.inspectionCentreService.getAllInspectionCentreDetails();
    return ApiResponseUtil.success(
      'Inspection centres fetched successfully',
      GetInspectionCentreDetailResource.collection(data)
    );
  }

  
  @Get('city-suggestions')
  async getCitySuggestions(@Query() queryDto: AdminCitySuggestionDto) {
    const { data, total, page, limit } = await this.inspectionCentreService.getCitySuggestions(queryDto);
    return ApiResponseUtil.paginated(
      'City suggestions fetched successfully',
      AdminPincodeCitySuggestionResource.collection(data),
      page,
      limit,
      total,
    );
  }

  @Post()
  async createInspectionCentre(
    @CurrentUser() adminUser: User,
    @Body() body: CreateInspectionCentreDto
  ) {
    await this.inspectionCentreService.createInspectionCentre(adminUser, body);
    return ApiResponseUtil.created('Inspection centre created successfully');
  }

  @Put(':id')
  async updateInspectionCentre(
    @Param() param: UpdateInspectionCenterParamDto,
    @CurrentUser() adminUser: User,
    @Body() body: UpdateInspectionCentreDto
  ) {
    await this.inspectionCentreService.updateInspectionCentre(param, adminUser, body);
    return ApiResponseUtil.success('Inspection centre updated successfully');
  }

  @Get(':cityId/centres')
  async getInspectionCentres() {
    const data = await this.inspectionCentreService.getInspectionCentres();
    return ApiResponseUtil.success(
      'Inspection centres fetched successfully',
      GetAllInspectionCentresResource.collection(data)
    );
  }
}
