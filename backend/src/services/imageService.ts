import fs from 'fs';
import path from 'path';

// Imagens pré-existentes que sempre estarão disponíveis
const preExistingImages = [
  'civic.jpg',
  'corolla.jpg',
  'golf.jpg',
  'hrv.jpg',
  'jeep_compass.jpg',
  'mustang.jpg',
  'ranger.jpg',
  'sw4.jpg'
];

export const imageService = {
  // Obter todas as imagens disponíveis (pré-existentes + uploads)
  getAllImages: () => {
    const images: Array<{ filename: string; path: string; isPreExisting: boolean }> = [];
    
    // Adicionar imagens pré-existentes
    preExistingImages.forEach(filename => {
      images.push({
        filename,
        path: `/images/carros/${filename}`,
        isPreExisting: true
      });
    });
    
    // Adicionar imagens enviadas (se em produção)
    if (process.env.NODE_ENV === 'production') {
      try {
        const uploadDir = '/app/uploads/carros';
        if (fs.existsSync(uploadDir)) {
          const files = fs.readdirSync(uploadDir);
          const uploadedImages = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
          });
          
          uploadedImages.forEach(filename => {
            images.push({
              filename,
              path: `/uploads/carros/${filename}`,
              isPreExisting: false
            });
          });
        }
      } catch (error) {
        console.error('Erro ao listar uploads:', error);
      }
    }
    
    return images;
  },
  
  // Verificar se uma imagem existe
  imageExists: (filename: string): boolean => {
    // Verificar se é uma imagem pré-existente
    if (preExistingImages.includes(filename)) {
      return true;
    }
    
    // Verificar se é um upload
    if (process.env.NODE_ENV === 'production') {
      const uploadPath = path.join('/app/uploads/carros', filename);
      return fs.existsSync(uploadPath);
    }
    
    return false;
  },
  
  // Obter o caminho correto para uma imagem
  getImagePath: (filename: string): string => {
    // Se for uma imagem pré-existente
    if (preExistingImages.includes(filename)) {
      return `/images/carros/${filename}`;
    }
    
    // Se for um upload em produção
    if (process.env.NODE_ENV === 'production') {
      return `/uploads/carros/${filename}`;
    }
    
    // Em desenvolvimento, todas as imagens estão no mesmo lugar
    return `/images/carros/${filename}`;
  }
}; 