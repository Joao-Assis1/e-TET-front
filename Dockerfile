# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copiar a configuração do Nginx para suportar o history mode do Vue Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos compilados do Vue
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
