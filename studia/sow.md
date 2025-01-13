# Statement of Work (SoW)

## Project Overview

This document outlines the full scope of work completed for the product. It provides detailed descriptions of implemented features, functionalities, and application architecture.

## Authentication

- **Overview**: Secure user authentication system using session-based management.
- **Details**:
  - Sessions are managed using Redis.
  - Tokens are generated upon login and validated during requests.
  - Integrated guards ensure only authenticated users access protected endpoints.
  - Passwords are hashed using bcrypt before storage.

## Notifications

- **Overview**: Real-time notification system with fallback to database.
- **Details**:
  - WebSocket-based notifications for live updates.
  - Notifications stored in the database when users are offline.
  - CRUD functionality for notifications:
    - **Get unread notifications**: Retrieves all unread notifications for a user.
    - **Mark notification as read**: Marks a specific notification as read.
    - **Mark all as read**: Marks all notifications as read for a user.

## Domain Management

- **Overview**: Automated domain management with expiration tracking.
- **Endpoints**:
  - **Create Domain**:
    - **Method**: POST
    - **Path**: `/domains`
    - **Description**: Creates a new domain for the authenticated user.
  - **Get All Domains**:
    - **Method**: GET
    - **Path**: `/domains`
    - **Description**: Retrieves all domains associated with the authenticated user.
  - **Get Domain by ID**:
    - **Method**: GET
    - **Path**: `/domains/:id`
    - **Description**: Retrieves details of a specific domain, including SSL certificates.
  - **Refresh Domain Expirations**:
    - **Method**: POST
    - **Path**: `/domains/:id/refresh`
    - **Description**: Refreshes the expiration date for a specific domain.

## SSL Certificate Management

- **Overview**: Tracks SSL certificates for domains.
- **Details**:
  - Retrieves certificate expiration dates using crt.sh.
  - Notifies users of upcoming certificate expirations.
- **Integration**:
  - Certificates are associated with domains and returned with domain details.

## Helm Charts

- **Overview**: Pre-configured Helm charts for Kubernetes deployment.
- **Details**:
  - Supports configuration for database and Redis secrets.
  - Includes hooks for Prisma migrations using the same Docker image as the backend.
  - Redis installed via Bitnami's chart.
  - Compatible with dynamic namespace creation for ephemeral environments.

## CI/CD Pipeline

- **Overview**: Automated CI/CD using GitHub Actions.
- **Details**:
  - Builds and pushes Docker images to GHCR.
  - Automatically generates changelog using Conventional Commits and SemVer.
  - Includes pipelines for backend and frontend image builds.
  - Helm deployment automation supported via GitHub Actions.

## Frontend

- **Overview**: User-facing application with two deployment options.
- **Details**:
  - Prebuilt Docker image with Nginx for production.
  - Static files (HTML, JS, CSS) for CDN deployment.
- **Deployment**:
  - Available via GitHub Releases or Docker images.

## Dynamic Testing Environments

- **Overview**: Ephemeral environments for pull requests.
- **Details**:
  - Kubernetes namespaces created per PR.
  - Helm charts deployed dynamically for testing changes in isolation.

## Database and Cache

- **Overview**: PostgreSQL for persistent storage and Redis for caching/sessions.
- **Details**:
  - PostgreSQL RDS (version 14+ recommended).
  - Redis used for:
    - User sessions.
    - Caching non-critical data.
- **Backup Strategy**:
  - PostgreSQL: Regular backups using `pg_dump` or RDS snapshots.
  - Redis: Backups for session keys to prevent user logouts.

## Local Development

- **Backend**:
  - Requires Node.js 20+ (managed via `nvm`).
  - Local Redis and PostgreSQL provided via Docker Compose.
- **Frontend**:
  - Requires only the backend URL and Node.js for local builds.

## Testing Strategy

- **Overview**: Automated testing across three environments.
- **Details**:
  - **Dev**: Runs on the `master` branch.
  - **Staging**: Deploys tags for pre-production testing.
  - **Production**: Deploys approved tags from staging.
- **Dynamic Testing**:
  - Each PR creates a new Kubernetes namespace for isolated testing.

## Monitoring and Logging

- **Overview**: Recommended tools for application monitoring and log management.
- **Details**:
  - Metrics: Prometheus.
  - Logging: Loki or Elasticsearch.

## Release Workflow

- **Versioning**: Follows Semantic Versioning (`semver`).
- **Changelog**: Automatically generated from Conventional Commits.
- **Branching Model**:
  - `master`: Development branch.
  - `staging`: Tag-based testing.
  - `production`: Stable tags for deployment.
