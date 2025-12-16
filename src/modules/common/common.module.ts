import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';
import { CityModule } from './city/city.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    CarModule,
    CityModule
  ],
})
export class CommonModule { }
