import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth';
import { imageService } from '../services/imageService';

const router = Router();

// Configurar o diretório de destino
// Em produção, usamos o volume persistente montado em /app/uploads
const uploadDir = process.env.NODE_ENV === 'production' 
  ? '/app/uploads/carros'
  : path.join(__dirname, '../../..', 'frontend/public/images/carros');

// Criar diretório se não existir
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para evitar conflitos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.originalname.replace(ext, '').toLowerCase().replace(/[^a-z0-9]/g, '-');
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos de imagem são permitidos (JPEG, JPG, PNG, WEBP)'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Rota para upload de imagem
router.post('/carro-image', authenticateToken, upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Nenhuma imagem foi enviada' });
      return;
    }

    // Retornar apenas o nome do arquivo
    const filename = req.file.filename;
    const imagePath = imageService.getImagePath(filename);
    
    res.json({
      message: 'Imagem enviada com sucesso',
      filename: filename,
      path: imagePath
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para deletar imagem
router.delete('/carro-image/:filename', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadDir, filename);
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: 'Imagem não encontrada' });
      return;
    }
    
    // Deletar o arquivo
    fs.unlinkSync(filePath);
    
    res.json({ message: 'Imagem deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para listar imagens disponíveis
router.get('/carro-images', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const images = imageService.getAllImages();
    res.json(images);
  } catch (error) {
    console.error('Erro ao listar imagens:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

export default router; 