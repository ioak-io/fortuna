FROM node:18-slim

WORKDIR /app

# Install dependencies required for Flyway + Postgres
RUN apt-get update && apt-get install -y \
    bash curl postgresql-client openjdk-17-jre-headless \
    && rm -rf /var/lib/apt/lists/*

# Install Flyway CLI
ENV FLYWAY_VERSION=10.11.0
RUN curl -L "https://repo1.maven.org/maven2/org/flywaydb/flyway-commandline/${FLYWAY_VERSION}/flyway-commandline-${FLYWAY_VERSION}-linux-x64.tar.gz" \
    | tar xz && \
    mv flyway-${FLYWAY_VERSION} /flyway && \
    ln -s /flyway/flyway /usr/local/bin/flyway

# Copy workspace manifests first (better cache)
COPY package.json pnpm-workspace.yaml ./
COPY tsconfig.base.json tsconfig.base.json

# Install pnpm
RUN npm install -g pnpm

# Copy only what's needed for migration-service
COPY packages/ packages/
COPY services/migration/package.json services/migration/
COPY services/migration/tsconfig.json services/migration/
COPY services/migration/src services/migration/src/

# Set non-interactive mode
ENV CI=true

# Install workspace and migration-service deps (no --prod for dev compatibility)
RUN pnpm install --filter migration-service --no-frozen-lockfile

# Copy migrations
COPY sql/migrations /app/sql/migrations

EXPOSE 2110

CMD ["pnpm", "--filter", "migration-service", "start"]
