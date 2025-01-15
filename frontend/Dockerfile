FROM node:23.6.0-alpine3.20 AS build

WORKDIR /app

COPY package.json yarn.lock /app/
RUN yarn --frozen-lockfile
COPY . /app
# todo: fix typecheck and use yarn build
RUN yarn build-only


FROM nginx:1.17.8-alpine AS final

ENV CONTAINER_ENV_VAR_API_URL="http://localhost:3001"

RUN apk add jq bash --no-cache
COPY .docker /docker
# may consider just specifying additional nginx config, instead of replacing the whole file
COPY .docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www

ENTRYPOINT [ "/docker/docker-entrypoint.sh" ]
EXPOSE 80
