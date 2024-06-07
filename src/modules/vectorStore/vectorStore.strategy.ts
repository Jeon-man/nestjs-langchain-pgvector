import { DistanceStrategy, PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import * as pg from 'pg';
import { PgVectorColumn } from './vectorStore.interface';
import { OpenAIEmbeddings } from '@langchain/openai';
import { makeChain, Prompt } from '@util/makeChain';

export abstract class AbstractVectorStoreStrategy {
  constructor(distanceStrategy: DistanceStrategy, apiKey: string) {
    this.distanceStrategy = distanceStrategy;
    this.apiKey = apiKey;
  }
  private apiKey: string;

  protected pgVectorStore: PGVectorStore;
  protected pool: pg.Pool;

  private distanceStrategy: DistanceStrategy;

  private createTableQuery: string;

  abstract createPool(): void;

  private generateCreateQuery(tableName: string, columns: PgVectorColumn) {
    this.createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (
      ${columns.idColumnName} UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      ${columns.vectorColumnName} VECTOR,
      ${columns.contentColumnName} TEXT,
      ${columns.metadataColumnName} JSONB
    );`;
  }

  protected async ensureDatabaseSchema(apiKey: string, tableName: string) {
    this.createPool();
    const client = await this.pool.connect();

    const columns: PgVectorColumn = {
      idColumnName: 'id',
      vectorColumnName: 'vector',
      contentColumnName: 'content',
      metadataColumnName: 'metadata',
    };

    this.generateCreateQuery(tableName, columns);

    try {
      client.query(this.createTableQuery);
    } finally {
      client.release();
    }

    this.pgVectorStore = new PGVectorStore(
      new OpenAIEmbeddings({
        apiKey,
      }),
      {
        pool: this.pool,
        tableName,
        columns,
        distanceStrategy: this.distanceStrategy,
      },
    );
  }

  public async getChain(key?: number, metadata?: object, prompt?: Partial<Prompt>) {
    return makeChain(
      this.pgVectorStore.asRetriever({
        filter: {
          ...metadata,
        },
      }),
      this.apiKey,
      { ...prompt },
    );
  }
}
