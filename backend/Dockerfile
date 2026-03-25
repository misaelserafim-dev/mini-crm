# Usa a imagem oficial do Node (versão 20)
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência primeiro para aproveitar o cache
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN npm install

# Copia o restante do código do backend
COPY . .

# Gera o client do Prisma para o ambiente Linux do Docker
RUN npx prisma generate

# Expõe a porta que o seu Fastify está usando
EXPOSE 3333

# Comando para rodar as migrações e iniciar o servidor
# O 'npx prisma migrate deploy' garante que o banco receba as tabelas ao subir
CMD npx prisma migrate deploy && npm run dev