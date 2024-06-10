import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configDynamicModule } from '@module/config/config.module';
import { LangChainModule } from '@module/langchain/langchain.module';
import { CustomWinstonModule } from '@module/winston/winston.module';
import { LoggerMiddleware } from '@module/logger/logger.middleware';

@Module({
  imports: [configDynamicModule, LangChainModule, CustomWinstonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
