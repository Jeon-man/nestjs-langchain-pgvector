import { Module } from '@nestjs/common';
import { FileVectorStoreStrategy } from './file/file.vectorStore.strategy';
import { ChatVectorStoreStrategy } from './chat/chat.vectorStore.strategy';

@Module({
  providers: [FileVectorStoreStrategy, ChatVectorStoreStrategy],
  exports: [FileVectorStoreStrategy, ChatVectorStoreStrategy],
})
export class VectorStoreModule {}
