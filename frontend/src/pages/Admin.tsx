import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { marcaService, carroService, modeloService } from '../services/api';
import { Marca, Carro, Modelo } from '../types';
import { Plus, Edit, Trash2, Car, Tag } from 'lucide-react';

const Admin: React.FC = () => {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [carros, setCarros] = useState<Carro[]>([]);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'marcas' | 'modelos' | 'carros'>('marcas');

  // Estados para formulários
  const [marcaForm, setMarcaForm] = useState({ nome: '' });
  const [modeloForm, setModeloForm] = useState({ codigo: '', descricao: '', marcaId: '' });
  const [carroForm, setCarroForm] = useState({
    codigo: '',
    modeloId: '',
    ano: '',
    cor: '',
    descricao: '',
    observacoes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [marcasData, carrosData, modelosData] = await Promise.all([
        marcaService.getAll(),
        carroService.getAll(),
        modeloService.getAll()
      ]);
      setMarcas(marcasData);
      setCarros(carrosData);
      setModelos(modelosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMarca = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await marcaService.create(marcaForm);
      setMarcaForm({ nome: '' });
      loadData();
    } catch (error) {
      console.error('Erro ao criar marca:', error);
    }
  };

  const handleCreateModelo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await modeloService.create(modeloForm);
      setModeloForm({ codigo: '', descricao: '', marcaId: '' });
      loadData();
    } catch (error) {
      console.error('Erro ao criar modelo:', error);
    }
  };

  const handleCreateCarro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await carroService.create({
        ...carroForm,
        ano: parseInt(carroForm.ano)
      });
      setCarroForm({
        codigo: '',
        modeloId: '',
        ano: '',
        cor: '',
        descricao: '',
        observacoes: ''
      });
      loadData();
    } catch (error) {
      console.error('Erro ao criar carro:', error);
    }
  };

  const handleDeleteMarca = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta marca?')) {
      try {
        await marcaService.delete(id);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir marca:', error);
      }
    }
  };

  const handleDeleteCarro = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este carro?')) {
      try {
        await carroService.delete(id);
        loadData();
      } catch (error) {
        console.error('Erro ao excluir carro:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Car className="h-12 w-12 text-blue-600 mx-auto animate-spin" />
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Painel Administrativo
          </h1>
          <p className="text-lg text-gray-600">
            Gerencie marcas, modelos e carros
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 rounded-xl bg-blue-100 p-1">
            <button
              onClick={() => setActiveTab('marcas')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'marcas'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              Marcas
            </button>
            <button
              onClick={() => setActiveTab('modelos')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'modelos'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              Modelos
            </button>
            <button
              onClick={() => setActiveTab('carros')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'carros'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-blue-600 hover:bg-blue-50'
              }`}
            >
              Carros
            </button>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'marcas' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário de Marca */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Cadastrar Marca</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateMarca} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome da Marca
                    </label>
                    <Input
                      type="text"
                      placeholder="Digite o nome da marca"
                      value={marcaForm.nome}
                      onChange={(e) => setMarcaForm({ nome: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Salvar Marca
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de Marcas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="h-5 w-5" />
                  <span>Marcas Cadastradas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {marcas.map((marca) => (
                    <div key={marca.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{marca.nome}</span>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteMarca(marca.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'modelos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário de Modelo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Cadastrar Modelo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateModelo} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código
                    </label>
                    <Input
                      type="text"
                      placeholder="Digite o código do modelo"
                      value={modeloForm.codigo}
                      onChange={(e) => setModeloForm({ ...modeloForm, codigo: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <Input
                      type="text"
                      placeholder="Digite a descrição do modelo"
                      value={modeloForm.descricao}
                      onChange={(e) => setModeloForm({ ...modeloForm, descricao: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marca
                    </label>
                    <select
                      value={modeloForm.marcaId}
                      onChange={(e) => setModeloForm({ ...modeloForm, marcaId: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Selecione uma marca</option>
                      {marcas.map((marca) => (
                        <option key={marca.id} value={marca.id}>
                          {marca.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit" className="w-full">
                    Salvar Modelo
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Lista de Modelos */}
            <Card>
              <CardHeader>
                <CardTitle>Modelos Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {modelos.map((modelo) => (
                    <div key={modelo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{modelo.descricao}</span>
                        <p className="text-sm text-gray-600">{modelo.marca?.nome}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'carros' && (
          <div className="space-y-8">
            {/* Formulário de Carro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Cadastrar Carro</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateCarro} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código
                    </label>
                    <Input
                      type="text"
                      placeholder="Digite o código do carro"
                      value={carroForm.codigo}
                      onChange={(e) => setCarroForm({ ...carroForm, codigo: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modelo
                    </label>
                    <select
                      value={carroForm.modeloId}
                      onChange={(e) => setCarroForm({ ...carroForm, modeloId: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Selecione um modelo</option>
                      {modelos.map((modelo) => (
                        <option key={modelo.id} value={modelo.id}>
                          {modelo.marca?.nome} - {modelo.descricao}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ano
                    </label>
                    <Input
                      type="number"
                      placeholder="Digite o ano"
                      value={carroForm.ano}
                      onChange={(e) => setCarroForm({ ...carroForm, ano: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cor
                    </label>
                    <Input
                      type="text"
                      placeholder="Digite a cor"
                      value={carroForm.cor}
                      onChange={(e) => setCarroForm({ ...carroForm, cor: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição
                    </label>
                    <Input
                      type="text"
                      placeholder="Digite a descrição"
                      value={carroForm.descricao}
                      onChange={(e) => setCarroForm({ ...carroForm, descricao: e.target.value })}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observações
                    </label>
                    <textarea
                      placeholder="Digite as observações"
                      value={carroForm.observacoes}
                      onChange={(e) => setCarroForm({ ...carroForm, observacoes: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" className="w-full">
                      Salvar Carro
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Lista de Carros */}
            <Card>
              <CardHeader>
                <CardTitle>Carros Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {carros.map((carro) => (
                    <div key={carro.id} className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-lg">
                        {carro.modelo?.marca?.nome} {carro.modelo?.descricao}
                      </h3>
                      <p className="text-sm text-gray-600">{carro.descricao}</p>
                      <p className="text-sm text-gray-600">
                        {carro.ano} - {carro.cor}
                      </p>
                      <div className="mt-4 flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCarro(carro.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin; 