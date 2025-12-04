# Étape 1 : build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : serveur Nginx
FROM nginx:1.25-alpine

# Copier le build
COPY --from=build /app/dist /usr/share/nginx/html/dashboard

# Copier la config Nginx depuis la racine du projet
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
