#!/bin/bash

echo "🚀 EasyRent - Ambiente de Desenvolvimento"
echo "========================================="

# Função para mostrar ajuda
show_help() {
    echo "Uso: ./dev.sh [comando]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start     - Iniciar backend em desenvolvimento"
    echo "  test      - Testar endpoints do backend"
    echo "  frontend  - Iniciar frontend em desenvolvimento"
    echo "  full      - Iniciar backend + frontend"
    echo "  stop      - Parar todos os serviços"
    echo "  deploy    - Fazer commit e push para Railway"
    echo "  help      - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  ./dev.sh start     # Iniciar apenas backend"
    echo "  ./dev.sh full      # Iniciar backend + frontend"
    echo "  ./dev.sh deploy    # Deploy para Railway"
}

# Função para iniciar backend
start_backend() {
    echo "🔧 Iniciando backend..."
    cd backend && ./start.dev.sh
}

# Função para testar backend
test_backend() {
    echo "🧪 Testando backend..."
    cd backend && ./test.dev.sh
}

# Função para iniciar frontend
start_frontend() {
    echo "🎨 Iniciando frontend..."
    cd frontend && npm run dev
}

# Função para iniciar tudo
start_full() {
    echo "🚀 Iniciando ambiente completo..."
    echo "   Backend: http://localhost:4000"
    echo "   Frontend: http://localhost:5173"
    echo ""
    
    # Iniciar backend em background
    cd backend && ./start.dev.sh &
    BACKEND_PID=$!
    
    # Aguardar um pouco
    sleep 5
    
    # Iniciar frontend
    cd ../frontend && npm run dev &
    FRONTEND_PID=$!
    
    echo "✅ Serviços iniciados!"
    echo "   Backend PID: $BACKEND_PID"
    echo "   Frontend PID: $FRONTEND_PID"
    echo ""
    echo "💡 Para parar: ./dev.sh stop"
    
    # Aguardar
    wait
}

# Função para parar serviços
stop_services() {
    echo "🛑 Parando serviços..."
    
    # Matar processos nas portas
    if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null ; then
        echo "   Parando backend (porta 4000)..."
        kill -9 $(lsof -ti:4000) 2>/dev/null || true
    fi
    
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
        echo "   Parando frontend (porta 5173)..."
        kill -9 $(lsof -ti:5173) 2>/dev/null || true
    fi
    
    echo "✅ Serviços parados!"
}

# Função para deploy
deploy() {
    echo "🚀 Fazendo deploy para Railway..."
    
    # Verificar se há mudanças
    if git diff --quiet && git diff --staged --quiet; then
        echo "ℹ️  Nenhuma mudança para fazer commit"
    else
        echo "📝 Fazendo commit das mudanças..."
        git add .
        echo -n "💬 Digite a mensagem do commit: "
        read commit_message
        git commit -m "$commit_message"
    fi
    
    # Push para o fork
    echo "📤 Fazendo push para o repositório..."
    git push myfork main
    
    echo "✅ Deploy enviado para Railway!"
    echo "🔗 Verifique o deploy em: https://railway.app"
}

# Processar comando
case "$1" in
    "start")
        start_backend
        ;;
    "test")
        test_backend
        ;;
    "frontend")
        start_frontend
        ;;
    "full")
        start_full
        ;;
    "stop")
        stop_services
        ;;
    "deploy")
        deploy
        ;;
    "help"|"")
        show_help
        ;;
    *)
        echo "❌ Comando inválido: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 