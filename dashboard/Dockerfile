# Étape build
FROM node:20-alpine AS build
WORKDIR /app

# Copier uniquement package.json et package-lock.json pour npm install
COPY package*.json ./
RUN npm install

# Copier le reste du code
COPY . .

# Choisir le .env à utiliser
ARG ENV_FILE=.env
RUN cp $ENV_FILE .env && npm run build

# Étape runtime avec nginx
FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
