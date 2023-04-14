FROM node:16.13:alpine as  build-stage
# WORKDIR /usr/app/

# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build-dev
# FROM nginx:1.12-alpine

# COPY --from=build-stage /usr/app/dist/* /usr/share/nginx/html
# EXPOSE 80
# ENTRYPOINT [ "nginx","-g","daemon off;" ]