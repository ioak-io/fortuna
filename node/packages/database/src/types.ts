import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

export interface DatabaseConfig {
  connectionString?: string;
  max?: number;
  min?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

export interface DatabaseClient {
  query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>>;
  getClient(): Promise<PoolClient>;
  end(): Promise<void>;
  getPool(): Pool;
  withTransaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T>;
  withTransactionForUser<T>(
    userId: string,
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T>;
}

export interface DatabaseManager {
  getClient(): DatabaseClient;
  createClient(config?: DatabaseConfig): DatabaseClient;
  shutdown(): Promise<void>;
}
