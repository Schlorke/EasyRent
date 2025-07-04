# �� EasyRent - Sistema Completo para Locadora de Carros

**Universidade:** Universidade do Vale do Itajaí (UNIVALI)  
**Curso:** Análise e Desenvolvimento de Sistemas  
**Disciplina:** Software Design  
**Professor:** Maurício Pasetto de Freitas, MSc.

---

## 📌 Visão Geral

O **EasyRent** é um sistema completo de gestão para locadora de veículos, desenvolvido como projeto acadêmico da disciplina **Software Design**. O sistema foi migrado de HTML/CSS/JS para uma arquitetura moderna com **React + TypeScript** no frontend e **Node.js + Express + Prisma** no backend.

---

## 🏗️ Arquitetura

### **Frontend**
- **Vite + React + TypeScript**
- **TailwindCSS** para estilização
- **Shadcn UI** para componentes
- **Axios** para requisições HTTP
- **React Router** para roteamento

### **Backend**
- **Node.js + Express + TypeScript**
- **Prisma ORM** para gerenciamento do banco
- **PostgreSQL** (Railway) como banco de dados
- **JWT** para autenticação
- **bcryptjs** para criptografia de senhas

---

## 🛠️ Funcionalidades Implementadas

### **Frontend React**
- ✅ **Página Inicial** com design moderno
- ✅ **Sistema de Login/Cadastro** com validação
- ✅ **Catálogo de Veículos** com busca e filtros
- ✅ **Painel Administrativo** para gestão completa
- ✅ **Componentes Reutilizáveis** (Button, Input, Card, etc.)
- ✅ **Design Responsivo** para mobile e desktop
- ✅ **Navegação com Header** dinâmico

### **Backend API**
- ✅ **Autenticação JWT** completa
- ✅ **CRUD de Usuários** com senhas criptografadas
- ✅ **CRUD de Marcas** com validações
- ✅ **CRUD de Modelos** relacionados às marcas
- ✅ **CRUD de Carros** com dados completos
- ✅ **Middleware de Autenticação** para rotas protegidas
- ✅ **Validações e Tratamento de Erros**
- ✅ **Relacionamentos** entre entidades

### **Banco de Dados**
- ✅ **Modelo Relacional** implementado com Prisma
- ✅ **Entidades:** Usuario, Marca, Modelo, Carro, Locacao
- ✅ **Relacionamentos** 1:N entre as entidades
- ✅ **Constraints** e validações de integridade

---

## 📁 Estrutura do Projeto

```
EasyRent/
├── frontend/                    # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── ui/            # Componentes base (Button, Input, Card)
│   │   │   └── Header.tsx     # Header da aplicação
│   │   ├── pages/             # Páginas da aplicação
│   │   │   ├── Home.tsx       # Página inicial
│   │   │   ├── Login.tsx      # Página de login
│   │   │   ├── Cadastro.tsx   # Página de cadastro
│   │   │   ├── Locacao.tsx    # Catálogo de veículos
│   │   │   └── Admin.tsx      # Painel administrativo
│   │   ├── services/          # Serviços de API
│   │   ├── types/             # Tipos TypeScript
│   │   └── utils/             # Utilitários
│   ├── public/assets/         # Assets estáticos
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                     # Backend Node.js + Express
│   ├── src/
│   │   ├── routes/            # Rotas da API
│   │   │   ├── auth.ts        # Autenticação
│   │   │   ├── usuario.ts     # CRUD Usuários
│   │   │   ├── marca.ts       # CRUD Marcas
│   │   │   ├── modelo.ts      # CRUD Modelos
│   │   │   └── carro.ts       # CRUD Carros
│   │   ├── middleware/        # Middlewares
│   │   │   └── auth.ts        # Middleware JWT
│   │   ├── services/          # Serviços
│   │   │   └── prisma.ts      # Cliente Prisma
│   │   └── index.ts           # Servidor principal
│   ├── prisma/
│   │   └── schema.prisma      # Esquema do banco
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml           # Orquestração dos serviços
├── .env.example                # Variáveis de ambiente
└── README.md                   # Documentação
```

---

## 🚀 Como Executar

### **Pré-requisitos**
- Node.js 18+
- Docker e Docker Compose
- Git

### **1. Clonar o Repositório**
```bash
git clone <url-do-repositorio>
cd EasyRent
```

### **2. Configurar Variáveis de Ambiente**
```bash
# Copiar arquivos de exemplo
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Editar as variáveis conforme necessário
```

### **3. Executar com Docker Compose**
```bash
# Construir e executar todos os serviços
docker-compose up --build

# Em background
docker-compose up -d --build
```

### **4. Executar em Desenvolvimento**

**Backend:**
```bash
cd backend
npm install
npm run db:generate
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Endpoints da API

### **Autenticação**
- `POST /auth/login` - Login de usuário

### **Usuários**
- `POST /usuarios` - Criar usuário
- `GET /usuarios/profile` - Perfil do usuário autenticado
- `GET /usuarios` - Listar usuários (protegido)

### **Marcas**
- `GET /marcas` - Listar marcas
- `POST /marcas` - Criar marca (protegido)
- `PUT /marcas/:id` - Atualizar marca (protegido)
- `DELETE /marcas/:id` - Deletar marca (protegido)

### **Modelos**
- `GET /modelos` - Listar modelos
- `GET /modelos/marca/:marcaId` - Modelos por marca
- `POST /modelos` - Criar modelo (protegido)
- `PUT /modelos/:id` - Atualizar modelo (protegido)
- `DELETE /modelos/:id` - Deletar modelo (protegido)

### **Carros**
- `GET /carros` - Listar carros
- `GET /carros/:id` - Buscar carro por ID
- `POST /carros` - Criar carro (protegido)
- `PUT /carros/:id` - Atualizar carro (protegido)
- `DELETE /carros/:id` - Deletar carro (protegido)

---

## 🎨 Design System

### **Cores Principais**
- **Azul:** `#2563eb` (Primary)
- **Verde:** `#16a34a` (Success)
- **Vermelho:** `#dc2626` (Danger)
- **Cinza:** `#6b7280` (Neutral)

### **Componentes**
- **Button:** Variantes (default, outline, destructive, ghost)
- **Input:** Com validação e estados
- **Card:** Container padrão para conteúdo
- **Header:** Navegação responsiva

---

## 🔒 Segurança

- **JWT** para autenticação de sessões
- **bcryptjs** para hash de senhas
- **Helmet.js** para headers de segurança
- **CORS** configurado adequadamente
- **Validação** de entrada em todas as rotas

---

## 📊 Banco de Dados

### **Entidades Principais**
1. **Usuario** - Dados dos usuários do sistema
2. **Marca** - Marcas dos veículos (Toyota, Honda, etc.)
3. **Modelo** - Modelos específicos (Corolla, Civic, etc.)
4. **Carro** - Veículos individuais para locação
5. **Locacao** - Registros de locações realizadas

### **Relacionamentos**
- `Marca` 1:N `Modelo`
- `Modelo` 1:N `Carro`
- `Usuario` 1:N `Locacao`
- `Carro` 1:N `Locacao`

---

## 🚀 Deploy

O sistema está preparado para deploy no **Railway** com:
- **Frontend:** Servido via Nginx em container
- **Backend:** API Node.js em container
- **Banco:** PostgreSQL gerenciado pelo Railway

---

## 🤝 Contribuição

Este é um projeto acadêmico, mas sugestões e melhorias são bem-vindas através de issues e pull requests.

---

## 📄 Licença

Projeto desenvolvido para fins acadêmicos - UNIVALI 2025
