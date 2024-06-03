import { Module } from '@nestjs/common';
import { LangChainController } from './langchain.controller';
import { VectorStoreModule } from '@module/vectorStore/vectorStore.module';
import { LangChainService } from './langchain.service';

@Module({
  imports: [VectorStoreModule],
  providers: [LangChainService],
  controllers: [LangChainController],
})
export class LangChainModule {}
