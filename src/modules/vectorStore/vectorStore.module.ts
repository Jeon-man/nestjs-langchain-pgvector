import { Module } from '@nestjs/common';
import { VectorStoreProvider } from './vectorStore.service';

@Module({
  providers: [VectorStoreProvider],
  exports: [VectorStoreProvider],
})
export class VectorStoreModule {}
