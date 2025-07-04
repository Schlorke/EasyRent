import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { carroService } from '../services/api';
import type { Carro } from '../types';
import { Search, Car, Calendar, MapPin } from 'lucide-react';

const Locacao: React.FC = () => {
  const [carros, setCarros] = useState<Carro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadCarros();
  }, []);

  const loadCarros = async () => {
    try {
      const data = await carroService.getAll();
      setCarros(data);
    } catch (err) {
      setError('Erro ao carregar veículos');
    } finally {
      setLoading(false);
    }
  };

  const filteredCarros = carros.filter(carro =>
    carro.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carro.modelo?.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carro.modelo?.marca?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carro.cor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock de preços (seria vindo do backend)
  const getPrecoMock = (carroId: string) => {
    const precos = {
      '1': 150,
      '2': 160,
      '3': 140,
      '4': 300,
      '5': 200,
      '6': 180,
      '7': 250,
      '8': 190,
    };
    return precos[carroId as keyof typeof precos] || 180;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 text-blue-600 mx-auto animate-spin" />
          <p className="mt-4 text-gray-600">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadCarros} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Locação de Veículos
          </h1>
          <p className="text-lg text-gray-600">
            Encontre o veículo perfeito para sua necessidade
          </p>
        </div>

        {/* Barra de pesquisa */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar veículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Grid de veículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCarros.map((carro) => (
            <Card key={carro.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img
                  src={`/assets/img/car-placeholder.jpg`}
                  alt={`${carro.modelo?.marca?.nome} ${carro.modelo?.descricao}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Carro';
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">
                  {carro.modelo?.marca?.nome} {carro.modelo?.descricao}
                </CardTitle>
                <CardDescription>
                  {carro.descricao}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Ano: {carro.ano}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Cor: {carro.cor}</span>
                  </div>
                  {carro.observacoes && (
                    <p className="text-xs text-gray-500 mt-2">
                      {carro.observacoes}
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-green-600">
                        R$ {getPrecoMock(carro.id)}
                      </span>
                      <span className="text-sm text-gray-500">/dia</span>
                    </div>
                    <Button size="sm">
                      Alugar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCarros.length === 0 && (
          <div className="text-center py-12">
            <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Nenhum veículo encontrado para sua busca' : 'Nenhum veículo disponível'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Locacao; 