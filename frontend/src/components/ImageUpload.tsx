import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Check, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import api from '../services/api';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onUploadComplete?: (filename: string, base64: string) => void;
}

export function ImageUpload({ value, onChange, onUploadComplete }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [uploadedFilename, setUploadedFilename] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Se value é uma URL de imagem existente
    if (value && !value.startsWith('data:')) {
      setPreview(value);
      setUploadedFilename('');
    } 
    // Se value é Base64
    else if (value && value.startsWith('data:')) {
      setPreview(value);
      setUploadedFilename('uploaded');
    } 
    // Se não há valor
    else {
      setPreview('');
      setUploadedFilename('');
    }
  }, [value]);

  const validateFile = (file: File): boolean => {
    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Por favor, selecione uma imagem JPEG, JPG, PNG ou WEBP');
      return false;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB');
      return false;
    }

    return true;
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload/carro-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const { filename, base64 } = response.data;
        
        // Atualizar preview e estado
        setPreview(base64);
        setUploadedFilename(filename);
        onChange(base64); // Salvar Base64 diretamente
        
        if (onUploadComplete) {
          onUploadComplete(filename, base64);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      alert('Erro ao enviar imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await processFile(file);
    
    // Limpar o input para permitir selecionar o mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleRemove = () => {
    setPreview('');
    setUploadedFilename('');
    onChange('');
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDropZoneClick = () => {
    if (!preview) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-gray-200">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Remover imagem"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {uploadedFilename && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              <span>Imagem carregada com sucesso</span>
            </div>
          )}
        </div>
      ) : (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleDropZoneClick}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Clique para selecionar ou arraste uma imagem aqui
          </p>
          <p className="text-xs text-gray-500">
            JPEG, JPG, PNG ou WEBP (máx. 5MB)
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          type="button"
          variant={preview ? 'outline' : 'default'}
          disabled={isUploading}
          onClick={handleButtonClick}
          className="relative"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {preview ? 'Trocar Imagem' : 'Selecionar Imagem'}
            </>
          )}
        </Button>
      </div>

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        className="sr-only"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
    </div>
  );
} 