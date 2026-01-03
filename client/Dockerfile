# Étape 1 : Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Choisir l'env à build selon le contexte
ARG ENV_FILE=.env
RUN cp $ENV_FILE .env && npm run build

# Étape 2 : Serveur Nginx
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
