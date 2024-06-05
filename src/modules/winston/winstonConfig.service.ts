import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WinstonModuleOptions,
  WinstonModuleOptionsFactory,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import winston from 'winston';

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createWinstonModuleOptions(): WinstonModuleOptions | Promise<WinstonModuleOptions> {
    return {
      transports: [
        new winston.transports.Console({
          level: this.config.get('LOG_LEVEL'),
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(this.config.get('APP_NAME'), {
              prettyPrint: true,
              colors: true,
              processId: true,
            }),
          ),
        }),
      ],
    };
  }
}
