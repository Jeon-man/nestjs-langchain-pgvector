import { Module } from '@nestjs/common';
import { ChatVectorStoreStrategy } from './chat.vectorStore.strategy';

@Module({
  providers: [ChatVectorStoreStrategy],
  exports: [ChatVectorStoreStrategy],
})
export class ChatVectorStoreModule {}
