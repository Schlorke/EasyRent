import { Router, Request, Response } from 'express';
import prisma from '../services/prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Listar todas as locações
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const locacoes = await prisma.locacao.findMany({
      include: {
        carro: {
          include: {
            modelo: {
              include: {
                marca: true
              }
            }
          }
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(locacoes);
  } catch (error) {
    console.error('Erro ao listar locações:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar locações do usuário autenticado
router.get('/minhas', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const locacoes = await prisma.locacao.findMany({
      where: {
        usuarioId: req.userId
      },
      include: {
        carro: {
          include: {
            modelo: {
              include: {
                marca: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(locacoes);
  } catch (error) {
    console.error('Erro ao listar locações do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar nova locação
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { carroId, dataRetirada, dataDevolucao, observacoes } = req.body;

    if (!carroId || !dataRetirada || !dataDevolucao) {
      res.status(400).json({ 
        message: 'Carro, data de retirada e data de devolução são obrigatórios' 
      });
      return;
    }

    // Verificar se o carro existe
    const carro = await prisma.carro.findUnique({
      where: { id: carroId },
      include: {
        modelo: {
          include: {
            marca: true
          }
        }
      }
    });

    if (!carro) {
      res.status(404).json({ message: 'Carro não encontrado' });
      return;
    }

    // Verificar se as datas são válidas
    const dataRetiradaDate = new Date(dataRetirada);
    const dataDevolucaoDate = new Date(dataDevolucao);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataRetiradaDate < hoje) {
      res.status(400).json({ message: 'Data de retirada não pode ser anterior a hoje' });
      return;
    }

    if (dataDevolucaoDate <= dataRetiradaDate) {
      res.status(400).json({ message: 'Data de devolução deve ser posterior à data de retirada' });
      return;
    }

    // Verificação de conflito removida para fins acadêmicos
    // Permite múltiplas locações do mesmo carro na mesma data

    // Calcular valor baseado no valor do carro
    const dias = Math.ceil((dataDevolucaoDate.getTime() - dataRetiradaDate.getTime()) / (1000 * 60 * 60 * 24));
    const valorDiario = carro.valor; // Valor da diária do carro
    const valor = dias * valorDiario;

    // Gerar código único para a locação
    const ultimaLocacao = await prisma.locacao.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    const proximoNumero = ultimaLocacao ? 
      parseInt(ultimaLocacao.codigo.replace('LOC', '')) + 1 : 1;
    const codigo = `LOC${proximoNumero.toString().padStart(4, '0')}`;

    // Criar locação
    const locacao = await prisma.locacao.create({
      data: {
        codigo,
        carroId,
        usuarioId: req.userId!,
        dataRetirada: dataRetiradaDate,
        dataDevolucao: dataDevolucaoDate,
        valor,
        observacoes
      },
      include: {
        carro: {
          include: {
            modelo: {
              include: {
                marca: true
              }
            }
          }
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(locacao);
  } catch (error) {
    console.error('Erro ao criar locação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Cancelar locação
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Verificar se a locação existe e pertence ao usuário
    const locacao = await prisma.locacao.findUnique({
      where: { id }
    });

    if (!locacao) {
      res.status(404).json({ message: 'Locação não encontrada' });
      return;
    }

    if (locacao.usuarioId !== req.userId) {
      res.status(403).json({ message: 'Você não tem permissão para cancelar esta locação' });
      return;
    }

    // Verificar se a locação ainda não começou
    const hoje = new Date();
    if (locacao.dataRetirada <= hoje) {
      res.status(400).json({ 
        message: 'Não é possível cancelar uma locação que já começou' 
      });
      return;
    }

    await prisma.locacao.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao cancelar locação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router; 