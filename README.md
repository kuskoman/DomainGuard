# DomainGuard

DomainGuard is an app designed to monitor domain expiration times.

## Running the application

The app requires installed docker-compose.
Head to the `backend/` directory and run:

```sh
docker-compose up -d
```

Then, copy `.env.example` file to `.env`:

```sh
cp .env.example .env
```

Now you can run backend:

```sh
yarn start:dev
```

After starting backend you can start frontend application:

```sh
cd frontend && yarn dev
```
