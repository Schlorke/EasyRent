# Script PowerShell para testar a aplicação localmente com Docker
# Execute este script antes de fazer merge para main

Write-Host "🧪 Iniciando testes locais da aplicação EasyRent" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Verificar se Docker está rodando
try {
    docker info | Out-Null
    Write-Host "✅ Docker está rodando" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está rodando. Inicie o Docker primeiro." -ForegroundColor Red
    exit 1
}

# Limpar containers antigos
Write-Host "🧹 Limpando containers antigos..." -ForegroundColor Yellow
docker-compose -f docker-compose.local.yml down -v

# Construir e iniciar os serviços
Write-Host "🏗️ Construindo e iniciando serviços..." -ForegroundColor Yellow
docker-compose -f docker-compose.local.yml up -d --build

# Aguardar os serviços iniciarem
Write-Host "⏳ Aguardando serviços iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Verificar se os serviços estão funcionando
Write-Host "🔍 Verificando serviços..." -ForegroundColor Yellow

# Verificar backend
Write-Host "🚀 Verificando backend..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/health" -TimeoutSec 10
    Write-Host "✅ Backend funcionando" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend não está funcionando" -ForegroundColor Red
    exit 1
}

# Verificar frontend
Write-Host "🎨 Verificando frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 10
    Write-Host "✅ Frontend funcionando" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend não está funcionando" -ForegroundColor Red
    exit 1
}

# Testes da API
Write-Host "🔧 Testando endpoints da API..." -ForegroundColor Yellow

# Teste de listagem de marcas
Write-Host "  • Listagem de marcas..." -ForegroundColor White
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/marcas" -TimeoutSec 10
    Write-Host "    ✅ Listagem de marcas funcionando" -ForegroundColor Green
} catch {
    Write-Host "    ❌ Listagem de marcas falhou" -ForegroundColor Red
    exit 1
}

# Teste de listagem de carros
Write-Host "  • Listagem de carros..." -ForegroundColor White
try {
    $response = Invoke-RestMethod -Uri "http://localhost:4000/carros" -TimeoutSec 10
    Write-Host "    ✅ Listagem de carros funcionando" -ForegroundColor Green
} catch {
    Write-Host "    ❌ Listagem de carros falhou" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Todos os testes passaram!" -ForegroundColor Green
Write-Host "✨ A aplicação está funcionando corretamente" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 URLs para teste:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:4000" -ForegroundColor White
Write-Host "   Health:   http://localhost:4000/health" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Para parar os serviços:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.local.yml down" -ForegroundColor White
Write-Host ""
Write-Host "📱 Agora você pode testar a aplicação manualmente nos navegadores" -ForegroundColor Cyan
Write-Host "   e fazer merge para main com confiança!" -ForegroundColor Cyan