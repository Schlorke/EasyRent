#!/bin/bash

echo "🔧 EasyRent - Iniciando Backend em Modo Desenvolvimento"
echo "======================================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório backend/"
    echo "   Uso: cd backend && ./start.dev.sh"
    exit 1
fi

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    echo "❌ Erro: Arquivo .env não encontrado!"
    echo "   Copie o .env.example e configure as variáveis"
    exit 1
fi

# Instalar dependências se necessário
echo "📦 Verificando dependências..."
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Gerar cliente Prisma
echo "🔄 Gerando cliente Prisma..."
npx prisma generate

# Verificar conexão com banco (opcional, mas útil)
echo "🔍 Verificando conexão com banco de dados..."
npx prisma db push --accept-data-loss

# Compilar TypeScript
echo "🏗️ Compilando TypeScript..."
npm run build

# Verificar se a porta 4000 está livre
if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Porta 4000 já está em uso!"
    echo "   Matando processo anterior..."
    kill -9 $(lsof -ti:4000) 2>/dev/null || true
    sleep 2
fi

echo ""
echo "🚀 Iniciando servidor de desenvolvimento..."
echo "📍 Backend disponível em: http://localhost:4000"
echo "🔗 Health check: http://localhost:4000/health"
echo ""
echo "💡 Dicas:"
echo "   - Ctrl+C para parar o servidor"
echo "   - Logs aparecem abaixo"
echo "   - API conectada ao banco do Railway"
echo ""
echo "======================================================="

# Iniciar o servidor
npm run dev 