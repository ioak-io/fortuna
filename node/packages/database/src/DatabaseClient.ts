import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { DatabaseConfig, DatabaseClient as IDatabaseClient } from './types';

export class DatabaseClient implements IDatabaseClient {
  private pool: Pool;

  constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      connectionString: config.connectionString || process.env.DATABASE_URL,
      max: config.max || parseInt(process.env.DATABASE_MAX_CONNECTIONS || '20'),
      min: config.min || parseInt(process.env.DATABASE_MIN_CONNECTIONS || '2'),
      idleTimeoutMillis: config.idleTimeoutMillis || parseInt(process.env.DATABASE_IDLE_TIMEOUT || '30000'),
      connectionTimeoutMillis: config.connectionTimeoutMillis || parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '2000'),
    });

    // Handle pool errors
    this.pool.on('error', (err: Error) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  async query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const client = await this.getClient();
    try {
      return await client.query<T>(text, params);
    } finally {
      client.release();
    }
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  async end(): Promise<void> {
    await this.pool.end();
  }

  getPool(): Pool {
    return this.pool;
  }

  async withTransaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      const result = await callback(client);
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async withTransactionForUser<T>(
    userId: string,
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    return this.withTransaction(async (client) => {
      await client.query(
        `SET LOCAL "request.jwt.claims" = '${JSON.stringify({ sub: userId }).replace(/'/g, "''")}'`
      );

      return callback(client);
    });
  }
}
