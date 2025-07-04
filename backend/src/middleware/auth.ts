import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../services/prisma';

interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: any;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Token de acesso requerido' });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      res.status(500).json({ message: 'Configuração JWT inválida' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Buscar o usuário no banco
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.userId },
      select: { id: true, nome: true, email: true }
    });

    if (!user) {
      res.status(401).json({ message: 'Usuário não encontrado' });
      return;
    }

    req.userId = decoded.userId;
    req.user = user;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(403).json({ message: 'Token inválido' });
  }
};

export { AuthenticatedRequest }; 