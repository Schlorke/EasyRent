# 🚀 Deploy EasyRent no Railway

## 📋 Pré-requisitos

- Conta no [Railway](https://railway.app)
- Repositório Git configurado
- Variáveis de ambiente configuradas

## 🔧 Configuração do Backend

### 1. Variáveis de Ambiente Necessárias

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT
JWT_SECRET="seu_jwt_secret_super_seguro_aqui"

# Node Environment
NODE_ENV="production"

# Port (Railway define automaticamente)
PORT="4000"

# Frontend URL (para CORS)
FRONTEND_URL="https://seu-frontend.railway.app"
```

### 2. Configuração do Railway

1. **Conectar Repositório**:
   - Acesse Railway Dashboard
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório EasyRent

2. **Configurar Backend**:
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Start Command: `npm start`

3. **Configurar Banco PostgreSQL**:
   - Adicione PostgreSQL service
   - Copie a DATABASE_URL gerada
   - Cole nas variáveis de ambiente

### 3. Scripts de Build (package.json)

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate deploy"
  }
}
```

## 🎨 Configuração do Frontend

### 1. Variáveis de Ambiente

```bash
# API URL (URL do backend no Railway)
VITE_API_URL="https://seu-backend.railway.app"

# Node Environment
NODE_ENV="production"
```

### 2. Configuração do Railway

1. **Novo Service**:
   - Adicione novo service no mesmo projeto
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Start Command: `npm run preview`

### 3. Scripts de Build (package.json)

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview --host 0.0.0.0 --port $PORT"
  }
}
```

## 📦 Estrutura de Deploy

```
EasyRent/
├── backend/          # Service 1 (API)
│   ├── src/
│   ├── prisma/
│   ├── package.json
│   └── Dockerfile    # Opcional
├── frontend/         # Service 2 (Web)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile    # Opcional
└── .gitignore        # Configurado para Railway
```

## 🔄 Processo de Deploy

### 1. Preparação

```bash
# Limpar arquivos desnecessários
git clean -fd

# Verificar .gitignore
git status

# Commit final
git add .
git commit -m "feat: ready for Railway deploy"
git push origin main
```

### 2. Deploy Automático

O Railway fará deploy automático quando:
- Código for pushed para branch main
- Variáveis de ambiente estiverem configuradas
- Build commands estiverem corretos

### 3. Verificação Pós-Deploy

```bash
# Verificar logs do backend
railway logs --service backend

# Verificar logs do frontend  
railway logs --service frontend

# Testar endpoints
curl https://seu-backend.railway.app/health
```

## 🗄️ Configuração do Banco

### 1. Migrations

```bash
# Executar migrations automaticamente no deploy
npm run prisma:migrate

# Gerar client Prisma
npm run prisma:generate
```

### 2. Seeds (Opcional)

```bash
# Adicionar dados iniciais
npx prisma db seed
```

## 🔒 Segurança

### 1. Variáveis Sensíveis

- ✅ JWT_SECRET: Gerado aleatoriamente
- ✅ DATABASE_URL: Fornecido pelo Railway
- ✅ Todas as .env no .gitignore

### 2. CORS Configurado

```typescript
// backend/src/index.ts
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
  ],
  credentials: true,
}));
```

## 📊 Monitoramento

### 1. Health Check

```typescript
// backend/src/index.ts
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version 
  });
});
```

### 2. Logs

```bash
# Backend logs
railway logs --service easyrent-backend

# Frontend logs
railway logs --service easyrent-frontend
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Build Failure**:
   - Verificar Node.js version
   - Verificar dependências no package.json
   - Verificar scripts de build

2. **Database Connection**:
   - Verificar DATABASE_URL
   - Verificar migrations
   - Verificar Prisma client

3. **CORS Errors**:
   - Verificar FRONTEND_URL
   - Verificar configuração CORS
   - Verificar domínios

### Comandos Úteis

```bash
# Reiniciar services
railway restart

# Ver variáveis de ambiente
railway variables

# Executar comando no service
railway run <command>

# Conectar ao banco
railway connect postgres
```

## 📈 Otimizações

### 1. Performance

- Build otimizado para produção
- Compressão gzip habilitada
- Assets minificados
- Lazy loading implementado

### 2. Cache

```typescript
// Headers de cache para assets
app.use('/assets', express.static('public/assets', {
  maxAge: '1y',
  etag: false
}));
```

## ✅ Checklist Final

- [ ] .gitignore configurado
- [ ] Variáveis de ambiente definidas
- [ ] Scripts de build funcionando
- [ ] Database migrations aplicadas
- [ ] CORS configurado
- [ ] Health check implementado
- [ ] Logs funcionando
- [ ] Frontend conectando com backend
- [ ] Uploads funcionando (se aplicável)

## 🔗 Links Úteis

- [Railway Docs](https://docs.railway.app)
- [Prisma Deploy](https://www.prisma.io/docs/guides/deployment)
- [Vite Deploy](https://vitejs.dev/guide/static-deploy.html)
- [Express Production](https://expressjs.com/en/advanced/best-practice-performance.html)

---

🎓 **Projeto Acadêmico - UNIVALI**  
📚 **Disciplina**: Software Design  
🚗 **Sistema**: EasyRent - Locadora de Veículos 