import { Router } from 'express';
import multer from 'multer';
import { imageService } from '../services/imageService';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Configurar multer para armazenar em memória
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use JPEG, JPG, PNG ou WEBP.'));
    }
  }
});

// Upload de imagem de carro
router.post('/carro-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    // Converter para Base64
    const base64Image = await imageService.fileToBase64(req.file);
    
    // Gerar um ID único para a imagem
    const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    res.json({
      success: true,
      filename: imageId,
      base64: base64Image,
      message: 'Imagem processada com sucesso'
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ 
      error: 'Erro ao processar imagem',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Listar imagens disponíveis (apenas pré-existentes em produção)
router.get('/carro-images', async (req, res) => {
  try {
    // Em produção, retornar apenas as imagens pré-existentes
    const preExistingImages = [
      { filename: 'civic.jpg', path: '/assets/civic.jpg' },
      { filename: 'corolla.jpg', path: '/assets/corolla.jpg' },
      { filename: 'golf.jpg', path: '/assets/golf.jpg' },
      { filename: 'hrv.jpg', path: '/assets/hrv.jpg' },
      { filename: 'jeep_compass.jpg', path: '/assets/jeep_compass.jpg' },
      { filename: 'mustang.jpg', path: '/assets/mustang.jpg' },
      { filename: 'ranger.jpg', path: '/assets/ranger.jpg' },
      { filename: 'sw4.jpg', path: '/assets/sw4.jpg' }
    ];

    res.json({ images: preExistingImages });
  } catch (error) {
    console.error('Erro ao listar imagens:', error);
    res.status(500).json({ error: 'Erro ao listar imagens' });
  }
});

// Deletar imagem (não aplicável em produção com Base64)
router.delete('/carro-image/:filename', async (req, res) => {
  try {
    // Em produção com Base64, não há arquivo para deletar
    res.json({ 
      success: true, 
      message: 'Imagem removida da referência' 
    });
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    res.status(500).json({ error: 'Erro ao deletar imagem' });
  }
});

export default router; 