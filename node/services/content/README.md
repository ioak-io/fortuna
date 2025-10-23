# Content Service (NestJS)

A NestJS microservice for managing file uploads and content associated with units.

## Features

- **NestJS Framework**: Modern, scalable Node.js framework
- **Swagger Documentation**: Auto-generated API docs
- **Validation**: Request validation using class-validator
- **Type Safety**: Full TypeScript support with DTOs
- **Modular Architecture**: Clean separation of concerns

## Endpoints

### POST /unit/:slug/files
Creates a new file record for a unit.

**Request Body:**
```json
{
  "original_filename": "document.pdf",
  "storage_key": "s3://bucket/path/to/file",
  "mime_type": "application/pdf",
  "size_bytes": 1024000,
  "checksum": "sha256:abc123...",
  "metadata": {
    "description": "Course material"
  },
  "uploaded_by": 123
}
```

### GET /unit/:slug/files
Retrieves all files associated with a unit.

**Response:**
```json
[
  {
    "id": 1,
    "team_id": "uuid-string",
    "unit_id": 456,
    "original_filename": "document.pdf",
    "storage_key": "s3://bucket/path/to/file",
    "mime_type": "application/pdf",
    "size_bytes": 1024000,
    "checksum": "sha256:abc123...",
    "metadata": {
      "description": "Course material"
    },
    "uploaded_at": "2024-01-01T00:00:00Z",
    "uploaded_by": 123,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server with hot reload
pnpm start:dev

# Build for production
pnpm build

# Start production server
pnpm start:prod

# Debug mode
pnpm start:debug
```

## API Documentation

Once the service is running, visit `http://localhost:2111/api-docs` for interactive API documentation.

## Architecture

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
└── files/
    ├── files.module.ts    # Files feature module
    ├── files.controller.ts # HTTP endpoints
    ├── files.service.ts   # Business logic
    └── dto/
        ├── create-file.dto.ts
        └── file-response.dto.ts
```

## Database Integration

The service integrates with the `files` table from your V2 migration, supporting:
- File metadata (filename, storage key, MIME type, size, checksum)
- Team and unit associations
- Upload tracking (user, timestamp)
- JSON metadata storage

**Note**: The database service needs to be properly injected. Currently, the service has placeholder methods that need to be connected to your actual database implementation.
