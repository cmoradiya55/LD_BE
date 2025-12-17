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
import { CarModelRepository } from './car/car-model.repository';
import { CarVariantRepository } from './car/car-variant.repository';
import { CityRepository } from './general/city.repository';
import { PincodeRepository } from './general/pincode.repository';
import { UsedCarRepository } from './used-car/used-car.repository';
import { UsedCar } from '@entity/used-car/used-car.entity';
import { UsedCarCustomerPhoto } from '@entity/used-car/used-car-customer-photo.entity';
import { UsedCarCustomerPhotoRepository } from './used-car/used-car-customer-photo.repository';
import { InspectionImage } from '@entity/used-car/inspection-image.entity';
import { Customer } from '@entity/customer/customer.entity';
import { CustomerOtp } from '@entity/customer/customer-otp.entity';
import { CustomerRefreshToken } from '@entity/customer/customer-refresh-token.entity';
import { CustomerFcmToken } from '@entity/customer/customer-fcm-token.entity';
import { CustomerRepository } from './customer/customer.repository';
import { CustomerOtpRepository } from './customer/customer-otp.repository';
import { CustomerRefreshTokenRepository } from './customer/customer-refresh-token.repository';
import { CustomerFcmTokenRepository } from './customer/customer-fcm-token.repository';
import { CustomerWishlistRepository } from './customer-ops/customer-wishlist.repository';
import { CustomerWishlist } from '@entity/customer-ops/customer-wishlist.entity';
import { UserRepository } from './user/user.repository';
import { UserRefreshTokenRepository } from './user/user-refresh-token.repository';
import { User } from '@entity/user/user.entity';
import { UserRefreshToken } from '@entity/user/user-refresh-token.entity';

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

      UsedCar,
      UsedCarCustomerPhoto,
      InspectionImage,

      Customer,
      CustomerOtp,
      CustomerRefreshToken,
      CustomerFcmToken,

      CustomerWishlist,

      // Admiinn User
      User,
      UserRefreshToken,
    ]),
  ],
  providers: [
    CarBrandRepository,
    CarModelRepository,
    CarVariantRepository,
    CityRepository,
    PincodeRepository,
    UsedCarRepository,
    UsedCarCustomerPhotoRepository,

    CustomerRepository,
    CustomerOtpRepository,
    CustomerRefreshTokenRepository,
    CustomerFcmTokenRepository,

    CustomerWishlistRepository,

    UserRepository,
    UserRefreshTokenRepository,
  ],
  exports: [
    CarBrandRepository,
    CarModelRepository,
    CarVariantRepository,
    CityRepository,
    PincodeRepository,
    UsedCarRepository,
    UsedCarCustomerPhotoRepository,


    CustomerRepository,
    CustomerOtpRepository,
    CustomerRefreshTokenRepository,
    CustomerFcmTokenRepository,

    CustomerWishlistRepository,

    UserRepository,
    UserRefreshTokenRepository,
  ],
})
export class RepositoriesModule { }
