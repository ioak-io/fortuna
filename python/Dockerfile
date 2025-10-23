FROM python:3.13-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV POETRY_NO_INTERACTION=1
ENV POETRY_VENV_IN_PROJECT=1
ENV POETRY_CACHE_DIR=/tmp/poetry_cache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry==1.8.3
RUN poetry config virtualenvs.in-project true

# Set work directory
WORKDIR /app

# Copy root pyproject.toml and install root dependencies
COPY pyproject.toml poetry.lock* ./
RUN poetry install --only=dev && rm -rf $POETRY_CACHE_DIR

# Copy packages (as libraries, not services)
COPY packages/ ./packages/

# Copy services
COPY services/ ./services/

# Install packages and services with editable installs
RUN cd packages/package-example && poetry install && rm -rf $POETRY_CACHE_DIR
RUN cd packages/package-unit && poetry install && rm -rf $POETRY_CACHE_DIR
RUN cd services/service-example && poetry install && rm -rf $POETRY_CACHE_DIR
RUN cd services/service-unit && poetry install && rm -rf $POETRY_CACHE_DIR
RUN cd services/service-agent && poetry install && rm -rf $POETRY_CACHE_DIR

# Sanity check: ensure uvicorn exists in the services' venvs
RUN test -x /app/services/service-example/.venv/bin/uvicorn
RUN test -x /app/services/service-unit/.venv/bin/uvicorn
RUN test -x /app/services/service-agent/.venv/bin/uvicorn

# Expose port
EXPOSE 2006

# Default command
CMD ["poetry", "run", "uvicorn", "service_example.main:app", "--host", "0.0.0.0", "--port", "2006"]
