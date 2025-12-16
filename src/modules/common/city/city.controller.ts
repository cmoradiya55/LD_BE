import { Controller, Get, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { ActiveCityDto } from './dto/active-city.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { ActiveCityResource } from './resource/active-city.resource';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) { }

  @Get('active')
  async getActiveCities(
    @Query() query: ActiveCityDto,
  ) {
    const { data, total, page, limit } = await this.cityService.getActiveCities(query);

    return ApiResponseUtil.paginated(
      'Active cities fetched successfully',
      ActiveCityResource.collection(data),
      page,
      limit,
      total,
    );
  }
}
