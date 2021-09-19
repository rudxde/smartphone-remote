FROM node:16-alpine as base
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY ./lerna.json ./
# Package smartphone-remote-shared
FROM base as smartphone-remote-shared-build_prepare
WORKDIR /app/packages/shared
COPY  packages/shared/package-slim.json package.json
WORKDIR /app/
RUN npx lerna bootstrap --scope=smartphone-remote-shared --includeDependencies
FROM smartphone-remote-shared-build_prepare as smartphone-remote-shared-build
WORKDIR /app/packages/shared
COPY  packages/shared/package.json ./
COPY  packages/shared/tsconfig.json ./
COPY  packages/shared/src/ ./src/
RUN npm run build
ENTRYPOINT ["npm", "start"]
# Package smartphone-remote-server
FROM base as smartphone-remote-server-build_prepare
WORKDIR /app/packages/server
COPY  packages/server/package-slim.json package.json
WORKDIR /app/
COPY --from=smartphone-remote-shared-build_prepare /app/packages/shared/package.json /app/packages/shared/
RUN npx lerna bootstrap --scope=smartphone-remote-server --includeDependencies
FROM smartphone-remote-server-build_prepare as smartphone-remote-server-build
COPY --from=smartphone-remote-shared-build /app/packages/shared/ /app/packages/shared/
WORKDIR /app/packages/server
COPY  packages/server/package.json ./
COPY  packages/server/tsconfig.json ./
COPY  packages/server/src/ ./src/
RUN npm run build
ENTRYPOINT ["npm", "start"]
# Package smartphone-remote-desktop-client
FROM base as smartphone-remote-desktop-client-build
WORKDIR /app/packages/desktop-client
COPY  packages/desktop-client/package.json ./
COPY  packages/desktop-client/smartphone-remote-desktop-client-installer ./smartphone-remote-desktop-client-installer
# Package smartphone-remote-client
FROM base as smartphone-remote-client-build_prepare
WORKDIR /app/packages/client
COPY  packages/client/package-slim.json package.json
WORKDIR /app/
COPY --from=smartphone-remote-shared-build_prepare /app/packages/shared/package.json /app/packages/shared/
COPY --from=smartphone-remote-desktop-client-build /app/packages/desktop-client/package.json /app/packages/desktop-client/
RUN npx lerna bootstrap --scope=smartphone-remote-client --includeDependencies
FROM smartphone-remote-client-build_prepare as smartphone-remote-client-build
COPY --from=smartphone-remote-shared-build /app/packages/shared/ /app/packages/shared/
COPY --from=smartphone-remote-desktop-client-build /app/packages/desktop-client/ /app/packages/desktop-client/
WORKDIR /app/packages/client
COPY  packages/client/package.json ./
COPY  packages/client/tsconfig.json ./
COPY  packages/client/tsconfig.app.json ./
COPY  packages/client/angular.json ./
COPY  packages/client/src/ ./src/
RUN npm run build:prod
RUN install -D ./node_modules/smartphone-remote-desktop-client/smartphone-remote-desktop-client-installer/* -t ./dist/smartphone-remote-client/assets/
FROM nginx:alpine as smartphone-remote-client-prod
WORKDIR /app/packages/client
COPY  packages/client/nginx.conf /etc/nginx/nginx.conf
COPY --from=smartphone-remote-client-build  /app/packages/client/dist/smartphone-remote-client/ /usr/share/nginx/html