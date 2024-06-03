import { Module } from '@nestjs/common';
import { VectorStoreProvider } from './vectorStore.provider';
import { LangChainController } from './langchain.controller';

@Module({
  providers: [VectorStoreProvider],
  controllers: [LangChainController],
  exports: [VectorStoreProvider],
})
export class LangChainModule {}
