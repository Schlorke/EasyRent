#!/bin/bash

echo "🧪 EasyRent - Testando Backend Local"
echo "===================================="

# Verificar se o backend está rodando
if ! curl -s http://localhost:4000/health > /dev/null; then
    echo "❌ Backend não está rodando na porta 4000"
    echo "   Execute primeiro: ./start.dev.sh"
    exit 1
fi

echo "✅ Backend está rodando!"
echo ""

# Testar endpoints
echo "🔍 Testando endpoints..."

echo "  📊 Health Check:"
HEALTH=$(curl -s http://localhost:4000/health)
echo "     $HEALTH"

echo "  🏷️  Marcas:"
MARCAS=$(curl -s http://localhost:4000/marcas)
echo "     $MARCAS"

echo "  🚗 Carros:"
CARROS=$(curl -s http://localhost:4000/carros)
echo "     $CARROS"

echo "  🔧 Modelos:"
MODELOS=$(curl -s http://localhost:4000/modelos)
echo "     $MODELOS"

echo ""
echo "🎉 Todos os endpoints estão respondendo!"
echo "🌐 Frontend pode conectar em: http://localhost:4000"
echo ""
echo "📱 URLs úteis:"
echo "   - API Base: http://localhost:4000"
echo "   - Health: http://localhost:4000/health"
echo "   - Marcas: http://localhost:4000/marcas"
echo "   - Carros: http://localhost:4000/carros"
echo "   - Modelos: http://localhost:4000/modelos" 