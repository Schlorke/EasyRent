// ==========================================
// BACKEND - API REST - EasyRent
// ==========================================
// Autor: Guilherme Amaral Cardoso
// Data: 05/07/2025
// Versão: 1.0.0
// ==========================================

// ==========================================
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Importar rotas
import usuarioRoutes from './routes/usuario';
import marcaRoutes from './routes/marca';
import modeloRoutes from './routes/modelo';
import carroRoutes from './routes/carro';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import locacaoRoutes from './routes/locacao';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://easyrent-production.up.railway.app',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
  ],
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir imagens estáticas
if (process.env.NODE_ENV === 'production') {
  // Em produção, servir do volume persistente
  app.use('/uploads', express.static('/app/uploads'));
} else {
  // Em desenvolvimento, servir do frontend
  app.use('/images', express.static(path.join(__dirname, '../../frontend/public/images')));
}

// Rotas
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/marcas', marcaRoutes);
app.use('/modelos', modeloRoutes);
app.use('/carros', carroRoutes);
app.use('/upload', uploadRoutes);
app.use('/locacoes', locacaoRoutes);

// Rota de healthcheck
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware de erro global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 API disponível em: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔴 Finalizando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app; 