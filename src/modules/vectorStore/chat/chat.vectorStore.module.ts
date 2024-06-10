import { Module } from '@nestjs/common';

@Module({
  providers: [ChatVectorStoreModule],
  exports: [ChatVectorStoreModule],
})
export class ChatVectorStoreModule {}
