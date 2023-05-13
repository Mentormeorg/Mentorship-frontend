FROM node:16.14 as  build-stage

ARG BUILD_ENV

WORKDIR /usr/app/

COPY package*.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build-testing

FROM  nginx:1.24.0-alpine

COPY --from=build-stage /usr/app/dist/* /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT [ "nginx","-g","daemon off;" ]
