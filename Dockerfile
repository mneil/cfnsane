FROM node:14 AS build-env
ADD . /cfnsane
WORKDIR /cfnsane

RUN npm ci --only=production

WORKDIR /app
ENTRYPOINT ["node", "/cfnsane/bin/cli.js"]
