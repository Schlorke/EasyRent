import { Router } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../services/prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Criar usuário
router.post('/', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    // Verificar se o email já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

    // Criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash
      },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter perfil do usuário autenticado
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar todos os usuários (protegido)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router; 