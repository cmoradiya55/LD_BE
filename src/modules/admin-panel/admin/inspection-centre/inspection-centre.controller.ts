import { Body, Controller, Get, Post } from '@nestjs/common';
import { InspectionCentreService } from './inspection-centre.service';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { CurrentUser } from '@common/decorators/admin-panel/current-user.decorator';
import { User } from '@entity/user/user.entity';
import { CreateInspectionCentreDto } from './dto/create-inspection-centre.dto';
import { Roles } from '../../u-auth/decorator/user-roles.decorator';
import { UserRole } from '@common/enums/user.enum';
import { MODULE_PREFIX } from '@common/constants/app.constant';
import { GetAllInspectionCentresResource } from './resource/get-all-inspection-centres.resource';

@Controller(`${MODULE_PREFIX.ADMIN}/inspection-centre`)
@Roles(UserRole.ADMIN)
export class InspectionCentreController {
  constructor(private readonly inspectionCentreService: InspectionCentreService) { }

  @Post()
  async createInspectionCentre(
    @CurrentUser() adminUser: User,
    @Body() body: CreateInspectionCentreDto
  ) {
    await this.inspectionCentreService.createInspectionCentre(adminUser, body);
    return ApiResponseUtil.created('Inspection centre created successfully');
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
