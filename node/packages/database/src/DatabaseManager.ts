import { DatabaseClient } from './DatabaseClient';
import { DatabaseConfig, DatabaseManager as IDatabaseManager, DatabaseClient as IDatabaseClient } from './types';

export class DatabaseManager implements IDatabaseManager {
  private defaultClient: IDatabaseClient | null = null;
  private clients: Map<string, IDatabaseClient> = new Map();

  constructor(defaultConfig?: DatabaseConfig) {
    if (defaultConfig) {
      this.defaultClient = new DatabaseClient(defaultConfig);
    }
  }

  getClient(): IDatabaseClient {
    if (!this.defaultClient) {
      this.defaultClient = new DatabaseClient({});
    }
    return this.defaultClient;
  }

  createClient(config?: DatabaseConfig): IDatabaseClient {
    const client = new DatabaseClient(config || {});
    return client;
  }

  createNamedClient(name: string, config: DatabaseConfig): IDatabaseClient {
    const client = new DatabaseClient(config);
    this.clients.set(name, client);
    return client;
  }

  getNamedClient(name: string): IDatabaseClient | undefined {
    return this.clients.get(name);
  }

  async shutdown(): Promise<void> {
    const shutdownPromises: Promise<void>[] = [];

    if (this.defaultClient) {
      shutdownPromises.push(this.defaultClient.end());
    }

    for (const client of this.clients.values()) {
      shutdownPromises.push(client.end());
    }

    await Promise.all(shutdownPromises);
    this.clients.clear();
    this.defaultClient = null;
  }
}
