# Estágio 1: Build
FROM node:20-alpine AS build

# Permite receber o argumento
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Produção com Nginx
FROM nginx:stable-alpine
# Copia sua config do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copia os arquivos estáticos do estágio de build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
