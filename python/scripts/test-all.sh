#!/bin/bash

# Test all packages and services in the monorepo
set -e

echo "🧪 Running tests for all packages and services..."

# Test package-example
echo "📦 Testing package-example..."
cd packages/package-example
poetry install --no-interaction
poetry run pytest --cov=src/package_example --cov-report=term-missing
cd ../..

# Test service-example
echo "🚀 Testing service-example..."
cd services/service-example
poetry install --no-interaction
poetry run pytest --cov=src/service_example --cov-report=term-missing
cd ../..

# Test service-unit
echo "🤖 Testing service-unit..."
cd services/service-unit
poetry install --no-interaction
poetry run pytest --cov=src/service_unit --cov-report=term-missing
cd ../..

echo "✅ All tests passed!"
