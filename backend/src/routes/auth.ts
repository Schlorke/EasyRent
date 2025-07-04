import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../services/prisma';

const router = Router();

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      res.status(400).json({ message: 'Email e senha são obrigatórios' });
      return;
    }

    // Buscar usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      res.status(401).json({ message: 'Credenciais inválidas' });
      return;
    }

    // Gerar JWT
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      res.status(500).json({ message: 'Configuração JWT inválida' });
      return;
    }

    const token = jwt.sign(
      { userId: usuario.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar dados sem a senha
    const { senha: _, ...usuarioSemSenha } = usuario;

    res.json({
      token,
      usuario: usuarioSemSenha
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router; 