import { Module } from '@nestjs/common';
import { FileVectorStoreStrategy } from './file.vectorStore.strategy';

@Module({
  providers: [FileVectorStoreStrategy],
  exports: [FileVectorStoreStrategy],
})
export class VectorStoreModule {}
