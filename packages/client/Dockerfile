FROM base as build
COPY --slim package.json ./
RUN npm i
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY angular.json ./
COPY ./src/ ./src/
RUN cp ./node_modules/smartphone-remote-desktop-client/smartphone-remote-desktop-client-installer/Setup.exe ./src/assets
RUN npm run build:prod

FROM nginx:alpine as prod
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/packages/client/dist/smartphone-remote-client/ /usr/share/nginx/html