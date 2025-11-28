import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from './config'
import { typeOrmAsyncOptions } from './database/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { LoggerConfigService } from './common/utils/logger.utils';
import { RepositoriesModule } from './repositories/repositories.module';
import { CustomerModule } from './modules/customer/customer.module';
import { AdminModule } from './modules/admin/customer.module';

@Module({
  imports: [
    // Logger
    WinstonModule.forRootAsync({
      useClass: LoggerConfigService,
    }),

    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: config,
    }),
    
    // Database connection
    TypeOrmModule.forRootAsync(typeOrmAsyncOptions),
    
    // Repositories
    RepositoriesModule,

    // Feature modules
    CustomerModule,
    AdminModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
