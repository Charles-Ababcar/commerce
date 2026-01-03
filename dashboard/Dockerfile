# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copier package.json pour npm install
COPY package*.json ./
RUN npm install

# Copier tout le reste
ARG ENV_FILE=.env
COPY . .

# Copier le bon .env et build
RUN cp $ENV_FILE .env && npm run build

# Stage 2: Nginx
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Supprimer config par défaut et mettre la nôtre
RUN rm /etc/nginx/conf.d/default.conf
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf
