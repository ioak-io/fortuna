# Fortuna Migration Service

A TypeScript-based database migration service using Flyway, built with Express.js and Docker.

## Architecture

This project follows a monorepo structure with:

- **`packages/db-migration`**: Core migration logic and Flyway integration
- **`services/migration`**: Express.js API service for running migrations

## Features

- ✅ TypeScript-based Flyway migration execution
- ✅ Express.js REST API for migration operations
- ✅ Docker containerization
- ✅ Schema validation and system schema protection
- ✅ Environment-specific configuration (dev/prod)
- ✅ Health check endpoints
- ✅ Error handling and logging

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm
- Docker & Docker Compose

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Copy environment files:
```bash
cp env.migration.dev.example .env.migration.dev
cp env.migration.prod.example .env.migration.prod
```

3. Start the development environment:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Development

Start the migration service in development mode:
```bash
pnpm dev:migration
```

The service will be available at `http://localhost:3001`

## API Endpoints

### Health Check
```bash
GET /api/migration/health
```

### Run Migration
```bash
POST /api/migration/migrate
Content-Type: application/json

{
  "schemaName": "example_schema",
  "environment": "dev"
}
```

## Migration Files

Place your Flyway migration files in the `migrations/` directory following the naming convention:
- `V{version}__{description}.sql`

Example: `V1__Create_users_table.sql`

## Configuration

The service supports two environments:
- **dev**: Development environment with local PostgreSQL
- **prod**: Production environment with containerized PostgreSQL

Configuration is managed through environment variables and the `ConfigLoader` class in the `db-migration` package.

## Docker

### Development
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Production
```bash
docker-compose up -d
```

## Project Structure

```
├── packages/
│   └── db-migration/          # Core migration package
│       ├── src/
│       │   ├── config.ts      # Configuration loader
│       │   ├── flyway-migrator.ts  # Flyway integration
│       │   ├── schema-validator.ts # Schema validation
│       │   ├── types.ts       # TypeScript types
│       │   └── index.ts       # Package exports
│       ├── package.json
│       └── tsconfig.json
├── services/
│   └── migration/             # Express.js API service
│       ├── src/
│       │   ├── app.ts         # Express app setup
│       │   ├── server.ts      # Server entry point
│       │   ├── controllers/   # API controllers
│       │   ├── routes/        # API routes
│       │   ├── middleware/    # Express middleware
│       │   └── types.ts       # Service types
│       ├── Dockerfile
│       └── package.json
├── migrations/                # Flyway migration files
├── docker-compose.yml         # Production Docker setup
├── docker-compose.dev.yml     # Development Docker setup
└── README.md
```

## Migration from Shell Script

This TypeScript implementation replaces the shell script functionality from:
`/Users/arun/project/workspace/ioak/staging/fortuna/nocode/flyway/migrate-schema-specific.sh`

Key improvements:
- Type safety with TypeScript
- REST API interface
- Better error handling
- Docker integration
- Environment-specific configuration
- Schema validation
- System schema protection

## Contributing

1. Make changes to the relevant packages
2. Build the project: `pnpm build`
3. Test your changes
4. Submit a pull request

## License

ISC
