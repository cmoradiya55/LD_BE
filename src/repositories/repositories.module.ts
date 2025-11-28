import { Module } from '@nestjs/common';
import { CarBrandRepository } from './car/car-brand.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarBrand } from '@entity/car/car-brand.entity';
import { CarModel } from '@entity/car/car-model.entity';
import { CarVariant } from '@entity/car/car-variant.entity';
import { CarVariantFeature } from '@entity/car/car-variant-feature.entity';
import { City } from '@entity/general/city.entity';
import { Color } from '@entity/general/color.entity';
import { Feature } from '@entity/general/feature.entity';
import { Pincode } from '@entity/general/pincode.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarBrand,
      CarModel,
      CarVariant,
      CarVariantFeature,

      City,
      Color,
      Feature,
      Pincode,
    ]),
  ],
  providers: [
    CarBrandRepository
  ],
  exports: [
    CarBrandRepository
  ],
})
export class RepositoriesModule { }
