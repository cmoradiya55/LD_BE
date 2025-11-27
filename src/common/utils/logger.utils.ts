import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format, transports } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { WinstonModuleOptions, WinstonModuleOptionsFactory } from 'nest-winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerConfigService implements WinstonModuleOptionsFactory {
    constructor(private readonly config: ConfigService) { }

    createWinstonModuleOptions(): WinstonModuleOptions {
        const zip_log = this.config.get('LOG_ZIP_ARCHIVE') === 'true';

        return {
            transports: [
                new transports.DailyRotateFile({
                    filename: 'logs/%DATE%-error.log',
                    level: 'error',
                    format: format.combine(format.timestamp(), format.json()),
                    datePattern: 'DD-MM-YYYY',
                    zippedArchive: zip_log,
                    maxFiles: '7d',
                    maxSize: '5m',
                }),
                new transports.DailyRotateFile({
                    filename: 'logs/%DATE%.log',
                    format: format.combine(format.timestamp(), format.json()),
                    datePattern: 'DD-MM-YYYY',
                    zippedArchive: zip_log,
                    maxFiles: '7d',
                    maxSize: '5m',
                }),
                new transports.Console({
                    format: format.combine(
                        format.timestamp(),
                        nestWinstonModuleUtilities.format.nestLike(),
                    ),
                }),
            ],
        };
    }
}
