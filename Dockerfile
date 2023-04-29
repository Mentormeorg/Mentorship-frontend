FROM node:16.13 as  build-stage

ARG BUILD_ENV

WORKDIR /usr/app/

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build-${BUILD_ENV}


FROM nginx:1.12-alpine

RUN apk --no-cache add curl

COPY --from=build-stage /usr/app/dist/* /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT [ "nginx","-g","daemon off;" ]
