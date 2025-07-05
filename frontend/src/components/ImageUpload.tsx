import React, { useState, useRef } from 'react';
import { Button } from './ui/Button';
import { uploadService } from '../services/api';
import { Upload, X, FolderOpen } from 'lucide-react';
import ImageSelector from './ImageSelector';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (filename: string) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImage, 
  onImageChange, 
  disabled = false 
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [showSelector, setShowSelector] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('❌ Apenas arquivos de imagem são permitidos (JPEG, JPG, PNG, WEBP)');
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('❌ A imagem deve ter no máximo 5MB');
      return;
    }

    setUploading(true);
    
    try {
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Fazer upload
      const result = await uploadService.uploadCarImage(file);
      onImageChange(result.filename);
      
      alert('✅ Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('❌ Erro ao enviar imagem. Tente novamente.');
      setPreview(null);
    } finally {
      setUploading(false);
      // Limpar o input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageChange('');
  };

  const handleSelectExisting = (filename: string) => {
    setPreview(null); // Limpar preview para mostrar a imagem selecionada
    onImageChange(filename);
  };

  // Limpar preview quando a imagem atual mudar (para casos de reset do formulário)
  React.useEffect(() => {
    if (!currentImage) {
      setPreview(null);
    }
  }, [currentImage]);

  const getCurrentImageSrc = () => {
    if (preview) return preview;
    if (currentImage) {
      // Se a imagem já tem um caminho completo (de upload), use-o
      if (currentImage.startsWith('/')) return currentImage;
      // Senão, assume que é uma imagem na pasta padrão
      return `/images/carros/${currentImage}`;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Preview da imagem */}
      {getCurrentImageSrc() && (
        <div className="relative bg-gray-50 rounded-lg border overflow-hidden">
          <div className="aspect-[16/9] w-full">
            <img
              src={getCurrentImageSrc()!}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Botões de ação */}
      <div className="space-y-3">
        {/* Botões principais */}
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || disabled}
            className="flex-1"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {getCurrentImageSrc() ? 'Alterar Imagem' : 'Enviar Nova'}
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowSelector(true)}
            disabled={uploading || disabled}
            className="flex-1"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Escolher Existente
          </Button>

          {getCurrentImageSrc() && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRemoveImage}
              disabled={disabled}
              className="px-3"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Texto explicativo */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            📤 Envie uma nova imagem ou 📁 escolha uma já existente
          </p>
        </div>
      </div>

      {/* Input de arquivo (oculto) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Informações */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>📎 Formatos aceitos: JPEG, JPG, PNG, WEBP</p>
        <p>📏 Tamanho máximo: 5MB</p>
        <p>🖼️ Recomendado: 800x600px ou superior</p>
      </div>

      {/* Modal de seleção de imagens */}
      <ImageSelector
        isOpen={showSelector}
        onClose={() => setShowSelector(false)}
        onSelect={handleSelectExisting}
        currentImage={currentImage}
      />
    </div>
  );
};

export default ImageUpload; 