# EasyRent Backend

API RESTful para o sistema de aluguel de carros EasyRent.

## Tecnologias

- Node.js + TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- Docker

## Configuração Local

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- npm ou yarn

### Instalação

1. Clone o projeto e navegue até o diretório do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações de banco de dados.

5. Execute as migrações do Prisma:
```bash
npm run db:generate
npm run db:push
```

6. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:4000`.

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o código TypeScript
- `npm start` - Inicia o servidor em modo produção
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:push` - Sincroniza o schema com o banco
- `npm run db:studio` - Abre o Prisma Studio

## Endpoints da API

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de usuário

### Usuários
- `GET /usuarios` - Lista usuários (protegido)
- `POST /usuarios` - Criar usuário
- `GET /usuarios/profile` - Perfil do usuário (protegido)

### Marcas
- `GET /marcas` - Lista marcas
- `POST /marcas` - Criar marca (protegido)
- `GET /marcas/:id` - Buscar marca por ID
- `PUT /marcas/:id` - Atualizar marca (protegido)
- `DELETE /marcas/:id` - Deletar marca (protegido)

### Modelos
- `GET /modelos` - Lista modelos
- `POST /modelos` - Criar modelo (protegido)
- `GET /modelos/:id` - Buscar modelo por ID
- `GET /modelos/marca/:marcaId` - Listar modelos por marca
- `PUT /modelos/:id` - Atualizar modelo (protegido)
- `DELETE /modelos/:id` - Deletar modelo (protegido)

### Carros
- `GET /carros` - Lista carros
- `POST /carros` - Criar carro (protegido)
- `GET /carros/:id` - Buscar carro por ID
- `GET /carros/disponiveis` - Buscar carros disponíveis
- `PUT /carros/:id` - Atualizar carro (protegido)
- `DELETE /carros/:id` - Deletar carro (protegido)

### Health Check
- `GET /health` - Verifica se a API está funcionando

## Deploy

### Railway

O projeto está configurado para deploy no Railway. As variáveis de ambiente já estão definidas no arquivo `.env`.

### Docker

Para rodar com Docker:

```bash
# Construir a imagem
docker build -t easyrent-backend .

# Executar o container
docker run -p 4000:4000 easyrent-backend
```

### Docker Compose

Para rodar toda a aplicação (frontend + backend):

```bash
# No diretório raiz do projeto
docker-compose up -d
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/     # Controladores (futuro)
│   ├── middleware/      # Middlewares
│   ├── routes/         # Rotas da API
│   ├── services/       # Serviços (Prisma)
│   ├── types/          # Tipos TypeScript
│   └── index.ts        # Arquivo principal
├── prisma/
│   └── schema.prisma   # Schema do banco
├── Dockerfile          # Configuração Docker
├── start.sh           # Script de inicialização
└── package.json       # Dependências
```

## Desenvolvimento

- O código usa TypeScript para tipagem estática
- As rotas são organizadas por entidade
- Middleware de autenticação JWT
- Validações de dados básicas
- Tratamento de erros centralizados