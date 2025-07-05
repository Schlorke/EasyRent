import { Router, Request, Response } from 'express';
import prisma from '../services/prisma';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Listar todos os carros
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const carros = await prisma.carro.findMany({
      include: {
        modelo: {
          include: {
            marca: true
          }
        }
      },
      orderBy: [
        { modelo: { marca: { nome: 'asc' } } },
        { modelo: { descricao: 'asc' } },
        { ano: 'desc' }
      ]
    });

    res.json(carros);
  } catch (error) {
    console.error('Erro ao listar carros:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar carros disponíveis para locação
router.get('/disponiveis', async (req: Request, res: Response): Promise<void> => {
  try {
    const { dataInicio, dataFim } = req.query;

    if (!dataInicio || !dataFim) {
      res.status(400).json({ 
        message: 'Data de início e fim são obrigatórias' 
      });
      return;
    }

    // Buscar todos os carros (sem filtro de disponibilidade para fins acadêmicos)
    const carros = await prisma.carro.findMany({
      include: {
        modelo: {
          include: {
            marca: true
          }
        }
      },
      orderBy: [
        { modelo: { marca: { nome: 'asc' } } },
        { modelo: { descricao: 'asc' } }
      ]
    });

    res.json(carros);
  } catch (error) {
    console.error('Erro ao buscar carros disponíveis:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter carro por ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const carro = await prisma.carro.findUnique({
      where: { id },
      include: {
        modelo: {
          include: {
            marca: true
          }
        },
        locacoes: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!carro) {
      res.status(404).json({ message: 'Carro não encontrado' });
      return;
    }

    res.json(carro);
  } catch (error) {
    console.error('Erro ao buscar carro:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Criar novo carro
router.post('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { codigo, modeloId, ano, cor, descricao, observacoes, imagem, valor } = req.body;

    if (!codigo || !modeloId || !ano || !cor || !descricao || !valor) {
      res.status(400).json({ 
        message: 'Código, modelo, ano, cor, descrição e valor são obrigatórios' 
      });
      return;
    }

    // Validar ano
    const anoAtual = new Date().getFullYear();
    if (ano < 1900 || ano > anoAtual + 1) {
      res.status(400).json({ 
        message: 'Ano deve estar entre 1900 e ' + (anoAtual + 1) 
      });
      return;
    }

    // Verificar se o modelo existe
    const modelo = await prisma.modelo.findUnique({
      where: { id: modeloId },
      include: { marca: true }
    });

    if (!modelo) {
      res.status(404).json({ message: 'Modelo não encontrado' });
      return;
    }

    // Verificar se o código já existe
    const carroExistente = await prisma.carro.findUnique({
      where: { codigo }
    });

    if (carroExistente) {
      res.status(409).json({ message: 'Código do carro já cadastrado' });
      return;
    }

    const carro = await prisma.carro.create({
      data: {
        codigo,
        modeloId,
        ano: parseInt(ano),
        cor,
        descricao,
        observacoes,
        imagem,
        valor: parseFloat(valor)
      },
      include: {
        modelo: {
          include: {
            marca: true
          }
        }
      }
    });

    res.status(201).json(carro);
  } catch (error) {
    console.error('Erro ao criar carro:', error);
    
    // Verificar se é erro de payload muito grande
    if (error instanceof Error && error.message.includes('PayloadTooLargeError')) {
      res.status(413).json({ 
        message: 'Imagem muito grande. Tente uma imagem menor (máximo 50MB).' 
      });
      return;
    }
    
    // Verificar se é erro do Prisma
    if (error instanceof Error && error.message.includes('Prisma')) {
      console.error('❌ Erro específico do Prisma:', error.message);
      res.status(500).json({ 
        message: 'Erro de banco de dados: ' + error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Atualizar carro
router.put('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { codigo, modeloId, ano, cor, descricao, observacoes, imagem, valor } = req.body;

    console.log('🔄 Atualizando carro:', id);
    console.log('📊 Dados recebidos:', {
      codigo,
      modeloId,
      ano,
      cor,
      descricao,
      observacoes,
      imagemSize: imagem ? imagem.length : 0,
      valor
    });

    if (!codigo || !modeloId || !ano || !cor || !descricao || !valor) {
      res.status(400).json({ 
        message: 'Código, modelo, ano, cor, descrição e valor são obrigatórios' 
      });
      return;
    }

    // Validar ano
    const anoAtual = new Date().getFullYear();
    if (ano < 1900 || ano > anoAtual + 1) {
      res.status(400).json({ 
        message: 'Ano deve estar entre 1900 e ' + (anoAtual + 1) 
      });
      return;
    }

    // Verificar se o carro existe
    const carroExistente = await prisma.carro.findUnique({
      where: { id }
    });

    if (!carroExistente) {
      res.status(404).json({ message: 'Carro não encontrado' });
      return;
    }

    // Verificar se o modelo existe
    const modelo = await prisma.modelo.findUnique({
      where: { id: modeloId },
      include: { marca: true }
    });

    if (!modelo) {
      res.status(404).json({ message: 'Modelo não encontrado' });
      return;
    }

    // Verificar se o código já está em uso por outro carro
    const carroComMesmoCodigo = await prisma.carro.findFirst({
      where: {
        codigo,
        NOT: { id }
      }
    });

    if (carroComMesmoCodigo) {
      res.status(409).json({ message: 'Código do carro já está em uso' });
      return;
    }

    console.log('✅ Validações passaram, atualizando no banco...');

    const carro = await prisma.carro.update({
      where: { id },
      data: {
        codigo,
        modeloId,
        ano: parseInt(ano),
        cor,
        descricao,
        observacoes,
        imagem,
        valor: parseFloat(valor)
      },
      include: {
        modelo: {
          include: {
            marca: true
          }
        }
      }
    });

    console.log('✅ Carro atualizado com sucesso');
    res.json(carro);
  } catch (error) {
    console.error('❌ Erro ao atualizar carro:', error);
    
    // Verificar se é erro de payload muito grande
    if (error instanceof Error && error.message.includes('PayloadTooLargeError')) {
      res.status(413).json({ 
        message: 'Imagem muito grande. Tente uma imagem menor (máximo 50MB).' 
      });
      return;
    }
    
    // Verificar se é erro do Prisma
    if (error instanceof Error && error.message.includes('Prisma')) {
      console.error('❌ Erro específico do Prisma:', error.message);
      res.status(500).json({ 
        message: 'Erro de banco de dados: ' + error.message 
      });
      return;
    }
    
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Deletar carro
router.delete('/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    console.log('🗑️ Tentando deletar carro com ID:', id);

    // Verificar se o carro existe e se tem locações associadas
    const carro = await prisma.carro.findUnique({
      where: { id },
      include: {
        locacoes: true
      }
    });

    if (!carro) {
      console.log('❌ Carro não encontrado:', id);
      res.status(404).json({ message: 'Carro não encontrado' });
      return;
    }

    console.log('✅ Carro encontrado:', carro.codigo);
    console.log('📊 Número de locações associadas:', carro.locacoes.length);

    // Verificar se existem locações associadas
    if (carro.locacoes.length > 0) {
      console.log('❌ Carro possui locações associadas, não pode ser excluído');
      res.status(400).json({ 
        message: 'Não é possível excluir o carro pois existem locações associadas',
        locacoes: carro.locacoes.length
      });
      return;
    }

    console.log('✅ Carro pode ser excluído, procedendo...');
    
    await prisma.carro.delete({
      where: { id }
    });

    console.log('✅ Carro excluído com sucesso');
    res.status(204).send();
  } catch (error) {
    console.error('❌ Erro ao deletar carro:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

export default router; 