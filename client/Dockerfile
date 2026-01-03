# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copier seulement les fichiers nécessaires pour npm install
COPY package*.json ./
RUN npm install

# Copier tout le reste du projet
ARG ENV_FILE=.env
COPY . .
RUN cp $ENV_FILE .env && npm run build

# Stage 2: Serve via Nginx
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx config (SPA fallback)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
