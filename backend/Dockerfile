FROM node:23.6.0-alpine3.20 AS base

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
COPY prisma /app/prisma


FROM base AS modules

RUN yarn install --production=true --frozen-lockfile && yarn prisma generate


FROM base AS build

RUN yarn install --frozen-lockfile && yarn prisma generate

COPY . .

RUN yarn build


FROM base AS release


COPY --from=build /app/dist /app/dist
COPY --from=modules /app/node_modules /app/node_modules

USER node

EXPOSE 3000
CMD [ "yarn", "start:prod" ]
