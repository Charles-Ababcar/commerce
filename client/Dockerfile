# Stage 1: build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
ARG ENV_FILE=.env
COPY . .
RUN cp $ENV_FILE .env && npm run build

# Stage 2: Nginx
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
