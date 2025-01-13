# Product Documentation

## Overview

This document provides a comprehensive guide to the product, including features, architecture, deployment, and recommended tools.

## Features

- **Domain and SSL Management:** Automatic tracking and notification for domain and SSL certificate expirations.
- **Real-Time Notifications:** WebSocket-based notifications with fallback to persistent storage.
- **Containerized Deployment:** Fully containerized backend and frontend for Kubernetes or standalone deployment.
- **Dynamic Testing Environments:** Automated creation of ephemeral environments for pull requests.
- **Trunk-Based Development:** Uses `master` for development, feature branches for changes, and tags for staging/production.
- **CI/CD Pipeline:** GitHub Actions build Docker images and push to GHCR.
- **Helm Chart Integration:** Includes pre-configured Helm charts for deployment with hooks for database migrations.
- **Automated Testing:** Integrated with CI for automated tests in multiple environments.

## Architecture

### Backend

- **Runtime:** Node.js (version 20+ recommended).
- **ORM:** Prisma for database management.
- **Cache/Session Store:** Redis.

### Frontend

- **Delivery Options:**
  1. Prebuilt Docker image with Nginx.
  2. Static files (HTML/JS/CSS) for CDN deployment.

### Database

- **Type:** PostgreSQL (RDS recommended, version 14+).

## Deployment Strategies

### Using ArgoCD

1. **Add Repository to ArgoCD:**
   - Connect the GitHub repository containing Helm charts:

     ```bash
     argocd repo add https://github.com/kuskoman/DomainGuard.git --username <user> --password <password>
     ```

2. **Create ArgoCD Application:**
   - Sync Helm values for different environments:

     ```bash
     argocd app create my-app \
       --repo https://github.com/kuskoman/DomainGuard.git \
       --path charts \
       --dest-namespace <namespace> \
       --dest-server https://kubernetes.default.svc \
       --sync-policy automated
     ```

3. **Enable Sync:**
   - Auto-sync ArgoCD with the `master` branch:

     ```bash
     argocd app set my-app --sync-policy automated
     ```

### Using Helm (Pure)

1. **Prepare Secrets:**
   - Create Kubernetes secrets for `DATABASE_URL` and `REDIS_URL`:

     ```bash
     kubectl create secret generic your-secret-name \
       --from-literal=DATABASE_URL=<your-database-url> \
       --from-literal=REDIS_URL=<your-redis-url>
     ```

2. **Install Helm Chart:**
   - Deploy the application:

     ```bash
     helm install my-app ./charts --namespace <namespace>
     ```

3. **Automate Deployment:**
   - Use a CI pipeline (GitHub Actions example):

     ```yaml
     - name: Deploy to Kubernetes
       run: helm upgrade --install my-app ./charts --namespace <namespace> --set image.tag=${{ github.sha }}
     ```

## Recommended Tools

1. **CI/CD Pipeline:** GitHub Actions.
2. **Deployment Automation:** ArgoCD or Helm.
3. **Testing Framework:** Jest (backend), Playwright or Cypress (frontend).
4. **Monitoring and Logging:**
   - Prometheus for metrics.
   - Loki or Elasticsearch for logs.
5. **Backup Tools:**
   - PostgreSQL: `pg_dump`, AWS Backup.
   - Redis: Native `SAVE` or `BGSAVE`.

## Local Development

### Backend development

1. Install dependencies:

   ```bash
   yarn
   ```

2. Start Redis and PostgreSQL using Docker Compose:

   ```bash
   docker-compose up
   ```

3. Run the backend:

   ```bash
   yarn start:dev
   ```

### Frontend development

1. Ensure the backend is running.

2. Install dependencies:

   ```bash
   yarn
   ```

3. Start the frontend development server:

   ```bash
   yarn dev
   ```

## Testing Strategy

- **Environment Flow:**
  1. **Dev:** For `master` branch changes.
  2. **Staging:** Tag-based pre-production testing.
  3. **Production:** Deploy approved staging tags.

- **Dynamic Testing Environments:**
  - Each PR creates a new Kubernetes namespace:

    ```bash
    helm upgrade --install pr-<id> ./charts --namespace pr-<id>
    ```

## Backup Strategy

### PostgreSQL

- Schedule daily RDS snapshots or use `pg_dump`.

### Redis

- Export session keys for backup:

  ```bash
  redis-cli save
  ```

### Restore

- Use native restore tools (`pg_restore`, Redis dump files).
