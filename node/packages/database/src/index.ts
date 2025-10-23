import { DatabaseManager } from './DatabaseManager';
import { DatabaseClient } from './DatabaseClient';
import { DatabaseConfig } from './types';
import { validateEnvironmentVariables } from './utils';

// Export types
export type { DatabaseConfig, DatabaseClient as IDatabaseClient, DatabaseManager as IDatabaseManager } from './types';

// Export classes
export { DatabaseManager, DatabaseClient };

// Export utilities
export { validateEnvironmentVariables };

// Create a singleton instance for easy use
const databaseManager = new DatabaseManager();

// Export the singleton instance
export const db = databaseManager.getClient();

// Export functions for creating clients
export const createDatabaseClient = (config?: DatabaseConfig): DatabaseClient => {
  return new DatabaseClient(config || {});
};

export const createDatabaseManager = (config?: DatabaseConfig): DatabaseManager => {
  return new DatabaseManager(config);
};

// Graceful shutdown handler
process.on('SIGINT', async () => {
  console.log('Shutting down database connections...');
  await databaseManager.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down database connections...');
  await databaseManager.shutdown();
  process.exit(0);
});
