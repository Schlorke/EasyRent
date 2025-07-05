import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { carroService, locacaoService } from '../services/api';
import type { Carro } from '../types';
import { Search, Car, Calendar, MapPin, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Locacao: React.FC = () => {
  const navigate = useNavigate();
  const [carros, setCarros] = useState<Carro[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCarro, setSelectedCarro] = useState<Carro | null>(null);
  const [locacaoForm, setLocacaoForm] = useState({
    dataRetirada: '',
    dataDevolucao: '',
    observacoes: ''
  });
  const [locacaoLoading, setLocacaoLoading] = useState(false);
  
  const isAuthenticated = localStorage.getItem('token');

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

  // Função para obter o preço do carro
  const getPreco = (carro: Carro) => {
    return carro.valor || 150; // Fallback para 150 se não tiver valor
  };

  const handleAlugar = (carro: Carro) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para alugar um veículo!');
      navigate('/login');
      return;
    }
    
    setSelectedCarro(carro);
    setShowModal(true);
    
    // Definir data mínima como amanhã
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    const dataMinima = amanha.toISOString().split('T')[0];
    
    setLocacaoForm({
      dataRetirada: dataMinima,
      dataDevolucao: '',
      observacoes: ''
    });
  };

  const handleConfirmarLocacao = async () => {
    if (!selectedCarro) return;
    
    setLocacaoLoading(true);
    
    try {
      await locacaoService.create({
        carroId: selectedCarro.id,
        dataRetirada: locacaoForm.dataRetirada,
        dataDevolucao: locacaoForm.dataDevolucao,
        observacoes: locacaoForm.observacoes
      });
      
      alert('🎉 Locação realizada com sucesso!\n\nVocê receberá um e-mail com os detalhes da locação.');
      setShowModal(false);
      setSelectedCarro(null);
      setLocacaoForm({
        dataRetirada: '',
        dataDevolucao: '',
        observacoes: ''
      });
    } catch (error: any) {
      console.error('Erro ao criar locação:', error);
      alert('❌ Erro ao realizar locação: ' + (error.response?.data?.message || 'Tente novamente.'));
    } finally {
      setLocacaoLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCarro(null);
    setLocacaoForm({
      dataRetirada: '',
      dataDevolucao: '',
      observacoes: ''
    });
  };

  const calcularDias = () => {
    if (!locacaoForm.dataRetirada || !locacaoForm.dataDevolucao) return 0;
    
    const dataRetirada = new Date(locacaoForm.dataRetirada);
    const dataDevolucao = new Date(locacaoForm.dataDevolucao);
    
    const diffTime = dataDevolucao.getTime() - dataRetirada.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  const calcularTotal = () => {
    if (!selectedCarro) return 0;
    const dias = calcularDias();
    return dias * getPreco(selectedCarro);
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
                  src={carro.imagem ? `/images/carros/${carro.imagem}` : '/images/car-placeholder.svg'}
                  alt={`${carro.modelo?.marca?.nome} ${carro.modelo?.descricao}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/car-placeholder.svg';
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
                        R$ {getPreco(carro).toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">/dia</span>
                    </div>
                    <Button size="sm" onClick={() => handleAlugar(carro)}>
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

      {/* Modal de Locação */}
      {showModal && selectedCarro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Alugar Veículo
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Informações do Carro */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-12 bg-gray-200 rounded-md overflow-hidden">
                    <img
                      src={selectedCarro.imagem ? `/images/carros/${selectedCarro.imagem}` : '/images/car-placeholder.svg'}
                      alt={`${selectedCarro.modelo?.marca?.nome} ${selectedCarro.modelo?.descricao}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/car-placeholder.svg';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedCarro.modelo?.marca?.nome} {selectedCarro.modelo?.descricao}
                    </h3>
                    <p className="text-gray-600">
                      {selectedCarro.ano} - {selectedCarro.cor}
                    </p>
                  </div>
                </div>
              </div>

              {/* Formulário de Locação */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Retirada
                  </label>
                  <Input
                    type="date"
                    value={locacaoForm.dataRetirada}
                    onChange={(e) => setLocacaoForm({ ...locacaoForm, dataRetirada: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data de Devolução
                  </label>
                  <Input
                    type="date"
                    value={locacaoForm.dataDevolucao}
                    onChange={(e) => setLocacaoForm({ ...locacaoForm, dataDevolucao: e.target.value })}
                    min={locacaoForm.dataRetirada || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    value={locacaoForm.observacoes}
                    onChange={(e) => setLocacaoForm({ ...locacaoForm, observacoes: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Observações sobre a locação..."
                  />
                </div>

                {/* Resumo do Valor */}
                {calcularDias() > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                                         <div className="flex justify-between items-center">
                       <span className="text-sm text-gray-600">
                         {calcularDias()} dia(s) × R$ {getPreco(selectedCarro).toFixed(2)}
                       </span>
                       <span className="text-lg font-bold text-blue-600">
                         R$ {calcularTotal().toFixed(2)}
                       </span>
                     </div>
                  </div>
                )}

                {/* Botões */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal}
                    className="flex-1"
                    disabled={locacaoLoading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleConfirmarLocacao}
                    className="flex-1"
                    disabled={locacaoLoading || !locacaoForm.dataRetirada || !locacaoForm.dataDevolucao || calcularDias() <= 0}
                  >
                    {locacaoLoading ? 'Processando...' : 'Confirmar Locação'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locacao; 