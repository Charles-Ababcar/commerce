# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copier uniquement package.json pour npm install
COPY package*.json ./
RUN npm install

# Copier tout le reste et prendre le .env correspondant
ARG ENV_FILE=.env
COPY . .
RUN cp $ENV_FILE .env && npm run build

# Stage 2: Nginx
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Supprimer default.conf et copier notre config SPA
RUN rm /etc/nginx/conf.d/default.conf
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf
