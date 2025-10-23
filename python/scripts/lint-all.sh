#!/bin/bash

# Run linting and formatting for all packages and services
set -e

echo "🔍 Running linting and formatting for all packages and services..."

# Run ruff formatting
echo "🎨 Formatting code with ruff..."
poetry run ruff format .

# Run ruff linting
echo "🔍 Linting code with ruff..."
poetry run ruff check . --fix

# Run mypy type checking
echo "🔬 Type checking with mypy..."
poetry run mypy packages/ services/

echo "✅ All linting and formatting completed!"
