FROM node:23.6.0-alpine3.20 AS base

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock


FROM base AS modules

RUN yarn install --production=true --frozen-lockfile


FROM base AS build

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build
RUN rm dist/tsconfig.build.tsbuildinfo


FROM base AS release

COPY --from=build /app/dist /app/dist
COPY --from=modules /app/node_modules /app/node_modules

USER node

EXPOSE 3000
CMD [ "yarn", "start:prod" ]
