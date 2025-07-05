import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { uploadService } from '../services/api';
import { X, Check, Image as ImageIcon } from 'lucide-react';

interface ImageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (filename: string) => void;
  currentImage?: string;
}

interface ImageFile {
  filename: string;
  path: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  currentImage 
}) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadImages();
      setSelectedImage(currentImage || '');
    }
  }, [isOpen, currentImage]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const imageList = await uploadService.getCarImages();
      setImages(imageList);
    } catch (error) {
      console.error('Erro ao carregar imagens:', error);
      alert('❌ Erro ao carregar imagens. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = () => {
    onSelect(selectedImage);
    onClose();
  };

  const handleImageClick = (filename: string) => {
    setSelectedImage(filename);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Selecionar Imagem Existente
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Carregando imagens...</span>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma imagem encontrada
              </h3>
              <p className="text-gray-500">
                Faça upload de algumas imagens primeiro para poder selecioná-las aqui.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 mb-4">
                Clique em uma imagem para selecioná-la. Total: {images.length} imagem(ns) disponível(is).
              </p>
              
              {/* Grid de imagens */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                {images.map((image) => (
                  <div
                    key={image.filename}
                    onClick={() => handleImageClick(image.filename)}
                    className={`relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-md ${
                      selectedImage === image.filename
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Imagem */}
                    <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                      <img
                        src={image.path || `/images/carros/${image.filename}`}
                        alt={image.filename}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/car-placeholder.svg';
                        }}
                      />
                    </div>
                    
                    {/* Nome do arquivo */}
                    <div className="p-2">
                      <p className="text-xs text-gray-600 truncate" title={image.filename}>
                        {image.filename}
                      </p>
                    </div>
                    
                    {/* Indicador de seleção */}
                    {selectedImage === image.filename && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                    
                    {/* Indicador de imagem atual */}
                    {currentImage === image.filename && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Atual
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && images.length > 0 && (
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              {selectedImage ? (
                <span>Imagem selecionada: <strong>{selectedImage}</strong></span>
              ) : (
                <span>Nenhuma imagem selecionada</span>
              )}
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSelect} 
                disabled={!selectedImage}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Selecionar Imagem
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSelector; 