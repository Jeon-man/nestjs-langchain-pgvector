import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AbstractVectorStoreStrategy } from './vectorStore.strategy';
import * as pg from 'pg';
import { Document } from '@langchain/core/documents';

@Injectable()
export class ChatVectorStoreStrategy extends AbstractVectorStoreStrategy implements OnModuleInit {
  constructor(private readonly config: ConfigService) {
    super('cosine', config.get('OPEN_AI_API_KEY'));
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

  async addDocument(documents: Document<Record<string, any>>[]) {
    return this.pgVectorStore.addDocuments(documents);
  }

  onModuleInit() {
    this.ensureDatabaseSchema(this.config.get('OPEN_AI_API_KEY'), 'chat');
  }
}
