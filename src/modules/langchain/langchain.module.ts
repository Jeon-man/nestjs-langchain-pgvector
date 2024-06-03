import { Module } from '@nestjs/common';
import { LangChainController } from './langchain.controller';
import { VectorStoreModule } from '@module/vectorStore/vectorStore.module';

@Module({
  providers: [VectorStoreModule],
  controllers: [LangChainController],
})
export class LangChainModule {}
