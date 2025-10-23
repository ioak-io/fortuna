# Axion Monorepo

A modern, Axion monorepo using Poetry for dependency management and workspace orchestration.

## Project Structure

```
monorepo/
├── pyproject.toml              # Root workspace configuration
├── README.md                   # This file
├── docker-compose.yml          # Local development (optional)
├── .pre-commit-config.yaml     # Pre-commit hooks configuration
├── .env.example.dev            # Example env for service-example (root-level)
├── .env.ai.dev                 # Example env for service-unit (root-level)
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── packages/
│   ├── package-example/        # Core example logic + ExampleClient
│   │   ├── pyproject.toml
│   │   ├── src/package_example/
│   │   │   ├── __init__.py
│   │   │   ├── core.py
│   │   │   ├── client.py
│   │   │   ├── types.py
│   │   │   └── introspect.py
│   │   └── tests/
│   └── package-unit/            # LLM utilities + LLMClient
│       ├── pyproject.toml
│       ├── src/package_unit/
│       │   ├── __init__.py
│       │   ├── core.py
│       │   ├── client.py
│       │   ├── types.py
│       │   └── introspect.py
│       └── tests/
└── services/
    ├── service-example/        # FastAPI example service
    │   ├── pyproject.toml
    │   ├── src/service_example/
    │   │   ├── main.py
    │   │   ├── api/
    │   │   │   ├── routes.py
    │   │   │   ├── routers/
    │   │   │   │   ├── compute.py
    │   │   │   │   └── env.py
    │   │   ├── di/providers.py
    │   │   └── config.py
    │   └── tests/
    └── service-unit/             # FastAPI AI service
        ├── pyproject.toml
        ├── src/service_unit/
        │   ├── main.py
        │   ├── api/
        │   │   ├── routes.py
        │   │   └── routers/
        │   │       ├── info.py
        │   │       └── llm.py
        │   ├── di/providers.py
        │   └── config.py
        └── tests/
```

## Quick Start

### Prerequisites

- Python 3.13+
- Poetry 1.8+
- Docker & Docker Compose (optional, for containerized development)

### Installation

1. **Clone and setup the monorepo:**
   ```bash
   git clone <repository-url>
   cd python
   ```

2. **Install Poetry (if not already installed):**
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

3. **Install all packages in development mode:**
   ```bash
   # Install root dependencies and dev tools
   poetry install

   # Note: The root install sets up all workspace packages (package-example, package-unit, service-example, service-unit)
   # via path dependencies in editable mode. No need to install per subproject.
   ```

4. **Set up pre-commit hooks:**
   ```bash
   poetry run pre-commit install
   ```

5. **Verify installation:**
   ```bash
   # Run all tests to verify everything works
   ./scripts/test-all.sh

   # Or test individually
   cd packages/package-unit && poetry run pytest && cd ../..
   cd services/service-unit && poetry run pytest && cd ../..
   ```

### Running the Application

#### Local Development

1. **Start the LLM service (optional):**
   ```bash
   poetry run dotenv -f .env.unit.dev run uvicorn service_unit.main:app --reload --host 0.0.0.0 --port 2111
   ```

2. **Access the APIs:**
   - Unit service API: http://localhost:2111
     - Docs: http://localhost:2111/docs
     - Sample: http://localhost:2111/compute?a=5&b=3
     - Env: http://localhost:2111/env

#### Docker Development

```bash
# Start containers for both services (if compose is configured)
docker-compose up --build
```

Compose uses root-level env files by default (adjust as needed in `docker-compose.yml`):

```
service-unit:
  env_file:
    - .env.unit.dev        # or .env.unit.prod
```

Ensure these files exist at the repository root (under `python/`).

### Environment Management (Poetry)

```bash
# Show current virtualenv and interpreter
poetry env info

# Remove all Poetry-managed virtualenvs for this project
# Use when switching Python versions or after large dependency changes
poetry env remove --all

# Recreate environment after removal
poetry install

# Regenerate poetry.lock from pyproject.toml without upgrading versions
# Use after editing dependency constraints or when lock gets out of sync
poetry lock

# Upgrade locked dependencies to latest within constraints, then install
# Use during routine dependency updates
poetry update

# Optional: ensure you’re using a specific Python version
# (must already be installed on your system)
poetry env use python3.13
```

### Testing

```bash
# Run all tests
poetry run pytest

# Run tests with coverage
poetry run pytest --cov

# Run tests for specific package
cd packages/package-example && poetry run pytest
```

### Code Quality

```bash
# Format code
poetry run ruff format .

# Lint code
poetry run ruff check .

# Type checking
poetry run mypy packages/ services/

# Run all quality checks
poetry run pre-commit run --all-files
```

## Package Dependencies

- **package-example**: Core example logic (no internal deps)
- **package-unit**: LLM utilities (no internal deps)
- **service-example**: Uses `package-example` via DI (`ExampleClient`)
- **service-unit**: Uses `package-unit` via DI (`LLMClient`)

## API Endpoints

### service-example
- `GET /compute` → adds `a + b`
- `GET /env` → shows masked ExampleClient configuration

Example response for `/compute`:
```json
{
  "result": 8,
  "operation": "add",
  "inputs": {"a": 5, "b": 3}
}
```

### service-unit
- `GET /llm?prompt=...` → returns deterministic generated text
- `GET /llm/env` → shows masked LLMClient configuration

Postman local environment includes:

```
baseUrl:   http://localhost:2111
```

## Development Workflow

1. Make changes to packages or services
2. Run tests: `./scripts/test-all.sh`
3. Check code quality: `./scripts/lint-all.sh` or `poetry run pre-commit run --all-files`
4. Commit changes (pre-commit hooks will run automatically)
5. Push to trigger CI pipeline

## Quick Setup

For a one-command setup, run:
```bash
./scripts/setup.sh
```

This will install all dependencies, set up pre-commit hooks, and run initial tests.

## CI/CD

The project includes GitHub Actions workflows that:
- Run tests across all packages and services
- Perform linting and type checking
- Generate coverage reports
- Build and test Docker images

## Architecture Notes

This monorepo demonstrates:
- **Workspace management** with Poetry
- **Inter-package dependencies** with proper import resolution
- **Axion tooling** integration (ruff, mypy, pytest)
- **Containerized development** with Docker Compose
- **CI/CD best practices** with GitHub Actions
- **Code quality enforcement** with pre-commit hooks
