FROM node:18-alpine AS build
WORKDIR /app

ARG ENV_FILE

COPY package*.json ./
RUN npm install

COPY . .

# inject env
COPY ${ENV_FILE} .env

RUN npm run build

FROM nginx:alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# ⚠️ adapte si build ou dist
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
