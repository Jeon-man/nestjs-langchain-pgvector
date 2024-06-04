import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Document } from '@langchain/core/documents';
import { AbstractVectorStoreStrategy } from './vectorStore.strategy';
import * as pg from 'pg';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class ChatVectorStoreStrategy extends AbstractVectorStoreStrategy implements OnModuleInit {
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
    this.ensureDatabaseSchema(this.config.get('OPEN_AI_API_KEY'), 'chat');
  }
}
