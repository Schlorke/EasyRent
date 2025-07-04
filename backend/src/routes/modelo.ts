import { Router, Request, Response } from 'express';
import prisma from '../services/prisma';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Listar todos os modelos
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const modelos = await prisma.modelo.findMany({
      include: {
        marca: true,
        carros: true
      },
      orderBy: {
        descricao: 'asc'
      }
    });

    res.json(modelos);
  } catch (error) {
    console.error('Erro ao listar modelos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar modelos por marca
router.get('/marca/:marcaId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { marcaId } = req.params;

    const modelos = await prisma.modelo.findMany({
      where: { marcaId },
      include: {
        marca: true,
        carros: true
      },
      orderBy: {
        descricao: 'asc'
      }
    });

    res.json(modelos);
  } catch (error) {
    console.error('Erro ao listar modelos por marca:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter modelo por ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const modelo = await prisma.modelo.findUnique({
      where: { id },
      include: {
        marca: true,
        carros: true
      }
    });

    if (!modelo) {
      res.status(404).json({ message: 'Modelo não encontrado' });
      return;
    }

    res.json(modelo);
  } catch (error) {
    console.error('Erro ao buscar modelo:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar novo modelo
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigo, descricao, marcaId } = req.body;

    if (!codigo || !descricao || !marcaId) {
      res.status(400).json({ 
        message: 'Código, descrição e marca são obrigatórios' 
      });
      return;
    }

    // Verificar se a marca existe
    const marca = await prisma.marca.findUnique({
      where: { id: marcaId }
    });

    if (!marca) {
      res.status(404).json({ message: 'Marca não encontrada' });
      return;
    }

    // Verificar se o código já existe
    const modeloExistente = await prisma.modelo.findUnique({
      where: { codigo }
    });

    if (modeloExistente) {
      res.status(409).json({ message: 'Código do modelo já cadastrado' });
      return;
    }

    const modelo = await prisma.modelo.create({
      data: {
        codigo,
        descricao,
        marcaId
      },
      include: {
        marca: true
      }
    });

    res.status(201).json(modelo);
  } catch (error) {
    console.error('Erro ao criar modelo:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar modelo
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { codigo, descricao, marcaId } = req.body;

    if (!codigo || !descricao || !marcaId) {
      res.status(400).json({ 
        message: 'Código, descrição e marca são obrigatórios' 
      });
      return;
    }

    // Verificar se o modelo existe
    const modeloExistente = await prisma.modelo.findUnique({
      where: { id }
    });

    if (!modeloExistente) {
      res.status(404).json({ message: 'Modelo não encontrado' });
      return;
    }

    // Verificar se a marca existe
    const marca = await prisma.marca.findUnique({
      where: { id: marcaId }
    });

    if (!marca) {
      res.status(404).json({ message: 'Marca não encontrada' });
      return;
    }

    // Verificar se o código já está em uso por outro modelo
    const modeloComMesmoCodigo = await prisma.modelo.findFirst({
      where: {
        codigo,
        NOT: { id }
      }
    });

    if (modeloComMesmoCodigo) {
      res.status(409).json({ message: 'Código do modelo já está em uso' });
      return;
    }

    const modelo = await prisma.modelo.update({
      where: { id },
      data: {
        codigo,
        descricao,
        marcaId
      },
      include: {
        marca: true
      }
    });

    res.json(modelo);
  } catch (error) {
    console.error('Erro ao atualizar modelo:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Deletar modelo
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar se o modelo existe e se tem carros associados
    const modelo = await prisma.modelo.findUnique({
      where: { id },
      include: {
        carros: true
      }
    });

    if (!modelo) {
      res.status(404).json({ message: 'Modelo não encontrado' });
      return;
    }

    // Verificar se existem carros associados
    if (modelo.carros.length > 0) {
      res.status(400).json({ 
        message: 'Não é possível excluir o modelo pois existem carros associados' 
      });
      return;
    }

    await prisma.modelo.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar modelo:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router; 