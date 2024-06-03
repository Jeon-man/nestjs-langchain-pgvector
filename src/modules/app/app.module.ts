import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configDynamicModule } from '@module/config/config.module';

@Module({
  imports: [configDynamicModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
