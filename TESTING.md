# Guia de Testes Locais - EasyRent

Este guia explica como testar a aplicação EasyRent localmente com Docker antes de fazer merge para a branch principal.

## Pré-requisitos

- [Docker](https://www.docker.com/get-started) instalado e rodando
- [Docker Compose](https://docs.docker.com/compose/install/) instalado
- Git configurado
- Porta 4000 (backend), 5173 (frontend) e 5432 (postgres) livres

## Métodos de Teste

### 1. Teste Automatizado (Recomendado)

O script automatizado testa todos os componentes da aplicação:

#### No Linux/macOS:
```bash
# Tornar script executável (primeira vez)
chmod +x scripts/test-local.sh

# Executar teste
./scripts/test-local.sh
```

#### No Windows (PowerShell):
```powershell
# Executar teste
./scripts/test-local.ps1
```

#### Com Make (se disponível):
```bash
make test-local
```

### 2. Teste Manual

#### Passo 1: Iniciar os serviços
```bash
# Iniciar todos os serviços
docker-compose -f docker-compose.local.yml up -d --build

# Ou com Make
make start-local
```

#### Passo 2: Verificar logs
```bash
# Ver logs de todos os serviços
docker-compose -f docker-compose.local.yml logs -f

# Ver logs específicos
docker-compose -f docker-compose.local.yml logs -f backend
docker-compose -f docker-compose.local.yml logs -f frontend
docker-compose -f docker-compose.local.yml logs -f postgres
```

#### Passo 3: Testar endpoints
```bash
# Health check
curl http://localhost:4000/health

# Listar marcas
curl http://localhost:4000/marcas

# Listar carros
curl http://localhost:4000/carros

# Listar modelos
curl http://localhost:4000/modelos
```

#### Passo 4: Testar frontend
Acesse http://localhost:5173 no navegador e teste:
- Navegação entre páginas
- Formulários de login/cadastro
- Listagem de carros
- Funcionalidades da interface

### 3. Comandos Úteis

```bash
# Parar todos os serviços
docker-compose -f docker-compose.local.yml down

# Parar e remover volumes (limpa banco)
docker-compose -f docker-compose.local.yml down -v

# Rebuild containers
docker-compose -f docker-compose.local.yml build --no-cache

# Ver status dos containers
docker-compose -f docker-compose.local.yml ps

# Acessar container do backend
docker-compose -f docker-compose.local.yml exec backend sh

# Acessar banco de dados
docker-compose -f docker-compose.local.yml exec postgres psql -U postgres -d easyrent_local
```

## Estrutura de Teste

### Serviços Testados

1. **PostgreSQL Local** (porta 5432)
   - Banco: `easyrent_local`
   - Usuário: `postgres`
   - Senha: `postgres123`

2. **Backend** (porta 4000)
   - API REST
   - Conexão com banco local
   - Autenticação JWT

3. **Frontend** (porta 5173)
   - Interface React
   - Comunicação com API local

### Endpoints Testados

- `GET /health` - Status da API
- `GET /marcas` - Lista marcas
- `GET /carros` - Lista carros
- `GET /modelos` - Lista modelos
- `POST /auth/login` - Login
- `POST /auth/register` - Cadastro

## Checklist de Teste

### ✅ Antes do Merge

- [ ] Todos os containers sobem sem erro
- [ ] Backend responde no health check
- [ ] Frontend carrega corretamente
- [ ] Banco de dados está funcionando
- [ ] Endpoints da API respondem
- [ ] Interface do usuário funcional
- [ ] Formulários funcionam
- [ ] Autenticação funciona

### ✅ Teste Manual da Interface

- [ ] Página inicial carrega
- [ ] Login/cadastro funciona
- [ ] Listagem de carros aparece
- [ ] Navegação entre páginas
- [ ] Formulários validam dados
- [ ] Responsividade funciona

## Solução de Problemas

### Container não sobe
```bash
# Ver logs detalhados
docker-compose -f docker-compose.local.yml logs [serviço]

# Rebuild containers
docker-compose -f docker-compose.local.yml build --no-cache
```

### Porta já está em uso
```bash
# Verificar processos usando as portas
lsof -i :4000  # Backend
lsof -i :5173  # Frontend
lsof -i :5432  # PostgreSQL

# Parar processo específico
kill -9 [PID]
```

### Problemas de banco
```bash
# Resetar banco de dados
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up -d
```

### Limpar tudo
```bash
# Limpar containers, volumes e imagens
docker-compose -f docker-compose.local.yml down -v
docker system prune -a
```

## Workflow Recomendado

1. **Desenvolver** na branch de feature
2. **Testar localmente** com Docker
3. **Corrigir** problemas encontrados
4. **Testar novamente** até tudo funcionar
5. **Fazer merge** para main com confiança

## URLs de Teste

Após iniciar os serviços:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000
- **API Health**: http://localhost:4000/health
- **API Docs**: http://localhost:4000 (endpoints listados no README)

## Configuração do Ambiente

### Variáveis de Ambiente (Local)

O arquivo `.env.local` contém:
- `DATABASE_URL`: Conexão com PostgreSQL local
- `JWT_SECRET`: Chave de autenticação
- `PORT`: Porta do backend (4000)
- `FRONTEND_URL`: URL do frontend para CORS

### Diferenças entre Local e Produção

| Aspecto | Local | Produção |
|---------|-------|----------|
| Banco | PostgreSQL local | Railway PostgreSQL |
| URL Backend | localhost:4000 | railway.app |
| URL Frontend | localhost:5173 | railway.app |
| Environment | development | production |

## Automatização

### GitHub Actions (Futuro)

Para automatizar testes em CI/CD:

```yaml
# .github/workflows/test.yml
name: Test Application
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Test with Docker
        run: ./scripts/test-local.sh
```

## Conclusão

Este setup permite testar a aplicação completa localmente antes de fazer deploy, garantindo que:

- ✅ Todos os serviços funcionam juntos
- ✅ API e frontend se comunicam
- ✅ Banco de dados persiste dados
- ✅ Interface do usuário funciona
- ✅ Deploy será bem-sucedido

**Sempre teste localmente antes de fazer merge para main!**