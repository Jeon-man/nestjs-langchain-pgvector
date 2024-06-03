import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { DistanceStrategy, PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import * as pg from 'pg';
import { Document } from '@langchain/core/documents';

interface PgVectorColumn {
  idColumnName: string;
  vectorColumnName: string;
  contentColumnName: string;
  metadataColumnName: string;
}

@Injectable()
export class VectorStoreProvider implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}

  private pgVectorStore: PGVectorStore;
  private pool: pg.Pool;

  async onModuleInit() {
    const tableName = 'langchain';
    const columns: PgVectorColumn = {
      idColumnName: 'id',
      vectorColumnName: 'vector',
      contentColumnName: 'content',
      metadataColumnName: 'metadata',
    };
    const distanceStrategy = 'cosine' as DistanceStrategy;

    this.pool = new pg.Pool({
      host: this.config.get('SQL_HOST'),
      port: this.config.get('SQL_PORT'),
      user: this.config.get('SQL_USER'),
      password: this.config.get('SQL_PASSWORD'),
      database: this.config.get('SQL_DATABASE'),
    });

    await this.ensureDatabaseSchema(columns, tableName);

    this.pgVectorStore = new PGVectorStore(new OpenAIEmbeddings(), {
      pool: this.pool,
      tableName,
      columns,
      distanceStrategy,
    });
  }

  private async ensureDatabaseSchema(columns: PgVectorColumn, tableName: string) {
    const client = await this.pool.connect();

    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      await client.query('CREATE EXTENSION IF NOT EXISTS vector');

      await client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (
        ${columns.idColumnName} UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        ${columns.vectorColumnName} VECTOR,
        ${columns.contentColumnName} TEXT,
        ${columns.metadataColumnName} JSONB
      );`);
    } finally {
      client.release();
    }
  }

  async addDocument(documents: Document<Record<string, any>>[]) {
    return this.pgVectorStore.addDocuments(documents);
  }

  async search(query: string, key: number) {
    return this.pgVectorStore.similaritySearch(query, key);
  }
}
