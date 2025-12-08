import { Module } from '@nestjs/common';
import { CarModule } from './car/car.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    CarModule
  ],
})
export class CommonModule { }
