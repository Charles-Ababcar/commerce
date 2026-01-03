# ---------------------------
# Étape 1 : Build de l'application Angular/Vue/React
# ---------------------------
FROM node:20-alpine AS build

# Dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json (ou yarn.lock)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste de l'application
COPY . .

# Argument pour choisir le fichier .env (par défaut .env pour PROD)
ARG ENV_FILE=.env
# Copier le fichier .env choisi dans l'application
RUN cp $ENV_FILE .env

# Build de l'application
RUN npm run build

# ---------------------------
# Étape 2 : Serveur Nginx pour servir le build
# ---------------------------
FROM nginx:1.25-alpine

# Copier le build vers Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copier la configuration Nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Commande pour lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
