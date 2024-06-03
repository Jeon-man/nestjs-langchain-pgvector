import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configDynamicModule } from '@module/config/config.module';
import { LangChainModule } from '@module/langchain/langchain.module';
import { VectorStoreModule } from '@module/vectorStore/vectorStore.module';

@Module({
  imports: [configDynamicModule, LangChainModule, VectorStoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
