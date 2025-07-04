# Makefile para facilitar comandos do EasyRent

.PHONY: help test-local start-local stop-local clean-local logs-local build-local

help: ## Mostrar ajuda
	@echo "Comandos disponíveis:"
	@echo "  make test-local     - Testar aplicação localmente"
	@echo "  make start-local    - Iniciar aplicação local"
	@echo "  make stop-local     - Parar aplicação local"
	@echo "  make clean-local    - Limpar containers e volumes"
	@echo "  make logs-local     - Mostrar logs dos containers"
	@echo "  make build-local    - Rebuild containers"

test-local: ## Testar aplicação localmente
	@echo "🧪 Executando testes locais..."
	@./scripts/test-local.sh

start-local: ## Iniciar aplicação local
	@echo "🚀 Iniciando aplicação local..."
	@docker-compose -f docker-compose.local.yml up -d

stop-local: ## Parar aplicação local
	@echo "🛑 Parando aplicação local..."
	@docker-compose -f docker-compose.local.yml down

clean-local: ## Limpar containers e volumes
	@echo "🧹 Limpando containers e volumes..."
	@docker-compose -f docker-compose.local.yml down -v
	@docker system prune -f

logs-local: ## Mostrar logs dos containers
	@echo "📋 Mostrando logs..."
	@docker-compose -f docker-compose.local.yml logs -f

build-local: ## Rebuild containers
	@echo "🏗️ Rebuilding containers..."
	@docker-compose -f docker-compose.local.yml build --no-cache

# Comandos para produção (Railway)
start-prod: ## Iniciar aplicação produção
	@echo "🚀 Iniciando aplicação produção..."
	@docker-compose up -d

stop-prod: ## Parar aplicação produção
	@echo "🛑 Parando aplicação produção..."
	@docker-compose down