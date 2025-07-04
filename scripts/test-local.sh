#!/bin/bash

# Script para testar a aplicação localmente com Docker
# Execute este script antes de fazer merge para main

set -e

echo "🧪 Iniciando testes locais da aplicação EasyRent"
echo "============================================="

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Inicie o Docker primeiro."
    exit 1
fi

# Limpar containers antigos
echo "🧹 Limpando containers antigos..."
docker-compose -f docker-compose.local.yml down -v

# Construir e iniciar os serviços
echo "🏗️ Construindo e iniciando serviços..."
docker-compose -f docker-compose.local.yml up -d --build

# Aguardar os serviços iniciarem
echo "⏳ Aguardando serviços iniciarem..."
sleep 30

# Verificar se os serviços estão funcionando
echo "🔍 Verificando serviços..."

# Verificar banco de dados
echo "📊 Verificando banco de dados..."
if docker-compose -f docker-compose.local.yml exec postgres pg_isready -U postgres; then
    echo "✅ Banco de dados funcionando"
else
    echo "❌ Banco de dados não está funcionando"
    exit 1
fi

# Verificar backend
echo "🚀 Verificando backend..."
if curl -s -f http://localhost:4000/health > /dev/null; then
    echo "✅ Backend funcionando"
else
    echo "❌ Backend não está funcionando"
    exit 1
fi

# Verificar frontend
echo "🎨 Verificando frontend..."
if curl -s -f http://localhost:5173 > /dev/null; then
    echo "✅ Frontend funcionando"
else
    echo "❌ Frontend não está funcionando"
    exit 1
fi

# Testes da API
echo "🔧 Testando endpoints da API..."

# Teste de health check
echo "  • Health check..."
if curl -s http://localhost:4000/health | grep -q "OK"; then
    echo "    ✅ Health check passou"
else
    echo "    ❌ Health check falhou"
    exit 1
fi

# Teste de listagem de marcas
echo "  • Listagem de marcas..."
if curl -s -f http://localhost:4000/marcas > /dev/null; then
    echo "    ✅ Listagem de marcas funcionando"
else
    echo "    ❌ Listagem de marcas falhou"
    exit 1
fi

# Teste de listagem de carros
echo "  • Listagem de carros..."
if curl -s -f http://localhost:4000/carros > /dev/null; then
    echo "    ✅ Listagem de carros funcionando"
else
    echo "    ❌ Listagem de carros falhou"
    exit 1
fi

echo ""
echo "🎉 Todos os testes passaram!"
echo "✨ A aplicação está funcionando corretamente"
echo ""
echo "🌐 URLs para teste:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:4000"
echo "   Health:   http://localhost:4000/health"
echo ""
echo "🛑 Para parar os serviços:"
echo "   docker-compose -f docker-compose.local.yml down"
echo ""
echo "📱 Agora você pode testar a aplicação manualmente nos navegadores"
echo "   e fazer merge para main com confiança!"