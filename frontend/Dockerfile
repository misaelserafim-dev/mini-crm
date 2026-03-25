# Estágio 1: Construção (Build)
FROM node:20-alpine AS build

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos de dependências primeiro (otimiza o cache do Docker)
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Captura a variável de ambiente do docker-compose para o Vite
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Gera a pasta 'dist' com os arquivos estáticos otimizados
RUN npm run build

# Estágio 2: Servidor de Produção (Nginx)
FROM nginx:alpine

# Copia os arquivos gerados no estágio anterior para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração simples para garantir que rotas do React (SPA) funcionem sem 404
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]