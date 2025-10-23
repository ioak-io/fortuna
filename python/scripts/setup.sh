#!/bin/bash

# Setup script for the Axion monorepo
set -e

echo "Setting up Axion Monorepo..."

# Check if Poetry is installed
if ! command -v poetry &> /dev/null; then
    echo "Installing Poetry..."
    curl -sSL https://install.python-poetry.org | python3 -
    export PATH="$HOME/.local/bin:$PATH"
fi

# Install root dependencies
echo "Installing root dependencies..."
poetry install

# Install package-example
echo "Installing package-example..."
cd packages/package-example
poetry install
cd ../..

# Install service-example
echo "Installing service-example..."
cd services/service-example
poetry install
cd ../..

# Set up pre-commit hooks
echo "Setting up pre-commit hooks..."
poetry run pre-commit install

# Run initial tests
echo "Running initial tests..."
./scripts/test-all.sh

echo "Setup completed successfully."
echo ""
echo "Next steps:"
echo "  1. Start the API: poetry run uvicorn service_example.main:app --reload"
echo "  2. Visit http://localhost:2110/docs for API documentation"
echo "  3. Test the endpoint: curl 'http://localhost:2110/compute?a=5&b=3'"
