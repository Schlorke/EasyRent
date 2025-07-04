#!/bin/sh

# Generate Prisma client
echo "🔄 Gerando cliente Prisma..."
npx prisma generate

# Push schema to database (for Railway)
echo "🔄 Sincronizando schema com banco de dados..."
npx prisma db push --accept-data-loss

# Start the application
echo "🚀 Iniciando aplicação..."
npm start 