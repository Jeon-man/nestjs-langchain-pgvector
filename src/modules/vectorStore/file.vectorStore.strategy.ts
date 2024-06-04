import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Document } from '@langchain/core/documents';
import { AbstractVectorStoreStrategy } from './vectorStore.strategy';

@Injectable()
export class FileVectorStoreStrategy extends AbstractVectorStoreStrategy implements OnModuleInit {
  constructor(private readonly config: ConfigService) {
    super('cosine');
  }

  onModuleInit() {
    this.ensureDatabaseSchema(this.config.get('OPEN_AI_API_KEY'), 'file');
  }

  async addDocument(documents: Document<Record<string, any>>[]) {
    return this.pgVectorStore.addDocuments(documents);
  }

  async search(query: string, key?: number) {
    return this.pgVectorStore.similaritySearch(query, key);
  }
}
