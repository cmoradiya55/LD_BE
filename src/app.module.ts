import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from './config'
import { typeOrmAsyncOptions } from './database/data-source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import { LoggerConfigService } from './common/utils/logger.utils';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useClass: LoggerConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: config,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
