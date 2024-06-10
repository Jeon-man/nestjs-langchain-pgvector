import { Module } from '@nestjs/common';
import { LangChainController } from './langchain.controller';
import { LangChainService } from './langchain.service';
import { CustomMulterModule } from '@module/multer/multer.module';
import { FileVectorStoreModule } from '@module/vectorStore/file/file.vectorStore.module';
import { ChatVectorStoreModule } from '@module/vectorStore/chat/chat.vectorStore.module';

@Module({
  imports: [FileVectorStoreModule, ChatVectorStoreModule, CustomMulterModule],
  providers: [LangChainService],
  controllers: [LangChainController],
})
export class LangChainModule {}
