import { DistanceStrategy, PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import * as pg from 'pg';
import { PgVectorColumn } from './vectorStore.interface';
import { OpenAIEmbeddings } from '@langchain/openai';

export abstract class AbstractVectorStoreStrategy {
  constructor(distanceStrategy: DistanceStrategy) {
    this.distanceStrategy = distanceStrategy;
  }

  protected pgVectorStore: PGVectorStore;
  protected pool: pg.Pool;

  private distanceStrategy: DistanceStrategy;

  private createTableQuery: string;

  private generateCreateQuery(tableName: string, columns: PgVectorColumn) {
    this.createTableQuery = `CREATE TABLE IF NOT EXISTS ${tableName} (
      ${columns.idColumnName} UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      ${columns.vectorColumnName} VECTOR,
      ${columns.contentColumnName} TEXT,
      ${columns.metadataColumnName} JSONB
    );`;
  }

  protected async ensureDatabaseSchema(apiKey: string, tableName: string) {
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
}