# syntax=docker/dockerfile:1

FROM python:3.13-slim AS base
ENV POETRY_VERSION=1.8.3 \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends curl build-essential && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python - --version ${POETRY_VERSION}
ENV PATH="/root/.local/bin:${PATH}"

WORKDIR /app

# Copy only service and its local deps to leverage Docker layer caching
COPY pyproject.toml poetry.lock* /app/
COPY packages/database /app/packages/database
COPY packages/middlewares /app/packages/middlewares
COPY packages/package-unit /app/packages/package-unit
COPY services/service-unit /app/services/service-unit

# Install deps for the service
WORKDIR /app/services/service-unit
RUN poetry install --no-interaction --no-ansi

EXPOSE 2111
CMD ["poetry", "run", "uvicorn", "service_unit.main:app", "--host", "0.0.0.0", "--port", "2111"]
