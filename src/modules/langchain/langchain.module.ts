import { Module } from '@nestjs/common';
import { LangChainController } from './langchain.controller';
import { VectorStoreModule } from '@module/vectorStore/vectorStore.module';
import { LangChainService } from './langchain.service';
import { CustomMulterModule } from '@module/multer/multer.module';

@Module({
  imports: [VectorStoreModule, CustomMulterModule],
  providers: [LangChainService],
  controllers: [LangChainController],
})
export class LangChainModule {}
