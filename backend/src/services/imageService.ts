import fs from 'fs/promises';
import path from 'path';

export class ImageService {
  private uploadsDir: string;

  constructor() {
    // Em produção, não vamos mais usar diretório físico
    this.uploadsDir = path.join(__dirname, '..', '..', 'uploads', 'carros');
  }

  async init() {
    // Em produção não precisamos criar diretórios
    if (process.env.NODE_ENV !== 'production') {
      try {
        await fs.access(this.uploadsDir);
      } catch {
        await fs.mkdir(this.uploadsDir, { recursive: true });
      }
    }
  }

  // Converte arquivo para Base64
  async fileToBase64(file: Express.Multer.File): Promise<string> {
    const base64 = file.buffer.toString('base64');
    const mimeType = file.mimetype;
    return `data:${mimeType};base64,${base64}`;
  }

  // Valida se é uma string Base64 válida
  isValidBase64Image(str: string): boolean {
    if (!str) return false;
    const regex = /^data:image\/(jpeg|jpg|png|webp);base64,/;
    return regex.test(str);
  }

  // Extrai informações de uma string Base64
  getImageInfo(base64String: string) {
    const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) return null;
    
    return {
      mimeType: `image/${matches[1]}`,
      extension: matches[1],
      data: matches[2]
    };
  }

  // Para manter compatibilidade com código existente
  async saveFile(file: Express.Multer.File, filename: string): Promise<string> {
    // Em produção, retornamos apenas o nome do arquivo
    // O Base64 será salvo diretamente no banco
    return filename;
  }

  async deleteFile(filename: string): Promise<void> {
    // Em produção, não há arquivo físico para deletar
    if (process.env.NODE_ENV !== 'production') {
      const filepath = path.join(this.uploadsDir, filename);
      try {
        await fs.unlink(filepath);
      } catch (error) {
        console.error(`Erro ao deletar arquivo ${filename}:`, error);
      }
    }
  }

  async listFiles(): Promise<string[]> {
    // Em produção, retornamos array vazio
    if (process.env.NODE_ENV === 'production') {
      return [];
    }

    try {
      const files = await fs.readdir(this.uploadsDir);
      return files.filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file));
    } catch {
      return [];
    }
  }

  getFileUrl(filename: string): string {
    return `/images/carros/${filename}`;
  }
}

export const imageService = new ImageService(); 