import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { WinstonConfigService } from './winstonConfig.service';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
  ],
  exports: [WinstonModule],
})
export class CustomWinstonModule {}
