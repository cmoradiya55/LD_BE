import { Controller, Get, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { ActiveCityDto } from './dto/active-city.dto';
import { ApiResponseUtil } from '@common/utils/api-response.utils';
import { ActiveCityResource } from './resource/active-city.resource';
import { GetAllCityDto } from './dto/get-all-city.dto';
import { AllCitiesResource } from './resource/all-cities.resource';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) { }

  @Get()
  async getAllCities(
    @Query() query: GetAllCityDto,
  ) {
    const { data, total, page, limit } = await this.cityService.getAllCities(query);
    return ApiResponseUtil.paginated(
      'Active cities fetched successfully',
      AllCitiesResource.collection(data),
      page,
      limit,
      total,
    );
  }

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
