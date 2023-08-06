FROM node:lts-alpine as builder

RUN apk add --no-cache bash

ENV NODE_ENV build

WORKDIR /home/node

COPY . /home/node/

RUN npm ci \
    && npm run build \
    && npm prune --production

FROM node:lts-alpine

ENV NODE_ENV production

WORKDIR /home/node

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD node healthcheck.js

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

EXPOSE 8080

CMD [ "npm", "start" ]