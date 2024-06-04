import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Document } from '@langchain/core/documents';
import { AbstractVectorStoreStrategy } from './vectorStore.strategy';
import * as pg from 'pg';

@Injectable()
export class FileVectorStoreStrategy extends AbstractVectorStoreStrategy implements OnModuleInit {
  constructor(private readonly config: ConfigService) {
    super('cosine');
  }

  createPool(): void {
    this.pool = new pg.Pool({
      host: this.config.get('SQL_HOST'),
      port: this.config.get('SQL_PORT'),
      user: this.config.get('SQL_USER'),
      password: this.config.get('SQL_PASSWORD'),
      database: this.config.get('SQL_DATABASE'),
    });
  }

  onModuleInit() {
    this.ensureDatabaseSchema(this.config.get('OPEN_AI_API_KEY'), 'file');
  }

  async addDocument(documents: Document<Record<string, any>>[]) {
    return this.pgVectorStore.addDocuments(documents);
  }

  async search(query: string, key?: number) {
    this.pgVectorStore.asRetriever();
    return this.pgVectorStore.similaritySearch(query, key);
  }
}
