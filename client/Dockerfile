# Étape 1 : Build
FROM node:20-alpine AS build
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./
RUN npm install

# Copier le reste du code et build
COPY . .
RUN npm run build

# Étape 2 : Serveur Nginx
FROM nginx:1.25-alpine
# Copier le build dans le dossier prévu pour Nginx
COPY --from=build /app/dist /usr/share/nginx/html/client
# Nginx utilisera le default.conf monté depuis docker-compose
