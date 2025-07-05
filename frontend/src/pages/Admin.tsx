import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { marcaService, carroService, modeloService } from '../services/api';
import type { Marca, Carro, Modelo } from '../types';
import { Plus, Edit, Trash2, Car, Tag } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import NotificationModal from '../components/NotificationModal';

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
    observacoes: '',
    imagem: '',
    valor: ''
  });

  // Estados para edição
  const [editingCarro, setEditingCarro] = useState<string | null>(null);
  const [editingMarca, setEditingMarca] = useState<string | null>(null);
  const [editingModelo, setEditingModelo] = useState<string | null>(null);

  // Estado para notificações
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success' as 'success' | 'error' | 'warning',
    title: '',
    message: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
    setNotification({ isOpen: true, type, title, message });
  };

  const closeNotification = () => {
    setNotification({ ...notification, isOpen: false });
  };

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
      showNotification('error', 'Erro ao Carregar Dados', 'Ocorreu um erro ao carregar os dados do sistema.');
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
        ano: parseInt(carroForm.ano),
        valor: parseFloat(carroForm.valor)
      });
      
      // Limpar formulário
      setCarroForm({
        codigo: '',
        modeloId: '',
        ano: '',
        cor: '',
        descricao: '',
        observacoes: '',
        imagem: '',
        valor: ''
      });
      
      // Recarregar dados
      await loadData();
      
      showNotification('success', 'Sucesso!', 'Carro cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar carro:', error);
      showNotification('error', 'Erro ao Criar Carro', 'Ocorreu um erro ao criar o carro. Tente novamente.');
    }
  };

  const handleDeleteMarca = async (id: string) => {
    try {
      // Verificar se há modelos usando esta marca
      const modelosDaMarca = modelos.filter(modelo => modelo.marcaId === id);
      
      if (modelosDaMarca.length > 0) {
        const marca = marcas.find(m => m.id === id);
        const listaModelos = modelosDaMarca.map(m => `• ${m.descricao} (${m.codigo})`).join('\n');
        
        showNotification('warning', 'Não é Possível Excluir a Marca', 
          `A marca "${marca?.nome}" não pode ser excluída pois existem ${modelosDaMarca.length} modelo(s) cadastrado(s) com esta marca:\n\n${listaModelos}\n\nPara excluir esta marca, primeiro exclua todos os modelos listados acima.`);
        return;
      }

      if (window.confirm('Tem certeza que deseja excluir esta marca?')) {
        await marcaService.delete(id);
        loadData();
        showNotification('success', 'Sucesso!', 'Marca excluída com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao excluir marca:', error);
      showNotification('error', 'Erro ao Excluir Marca', 'Ocorreu um erro ao excluir a marca. Tente novamente.');
    }
  };

  const handleDeleteModelo = async (id: string) => {
    try {
      // Verificar se há carros usando este modelo
      const carrosDoModelo = carros.filter(carro => carro.modeloId === id);
      
      if (carrosDoModelo.length > 0) {
        const modelo = modelos.find(m => m.id === id);
        const listaCarros = carrosDoModelo.map(c => `• ${c.descricao} (${c.codigo})`).join('\n');
        
        showNotification('warning', 'Não é Possível Excluir o Modelo', 
          `O modelo "${modelo?.descricao}" não pode ser excluído pois existem ${carrosDoModelo.length} carro(s) cadastrado(s) com este modelo:\n\n${listaCarros}\n\nPara excluir este modelo, primeiro exclua todos os carros listados acima.`);
        return;
      }

      if (window.confirm('Tem certeza que deseja excluir este modelo?')) {
        await modeloService.delete(id);
        loadData();
        showNotification('success', 'Sucesso!', 'Modelo excluído com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao excluir modelo:', error);
      showNotification('error', 'Erro ao Excluir Modelo', 'Ocorreu um erro ao excluir o modelo. Tente novamente.');
    }
  };

  const handleEditCarro = (carro: Carro) => {
    setEditingCarro(carro.id);
    setCarroForm({
      codigo: carro.codigo,
      modeloId: carro.modeloId,
      ano: carro.ano.toString(),
      cor: carro.cor,
      descricao: carro.descricao,
      observacoes: carro.observacoes || '',
      imagem: carro.imagem || '',
      valor: carro.valor.toString()
    });
  };

  const handleCancelEdit = () => {
    setEditingCarro(null);
    setCarroForm({
      codigo: '',
      modeloId: '',
      ano: '',
      cor: '',
      descricao: '',
      observacoes: '',
      imagem: '',
      valor: ''
    });
  };

  const handleUpdateCarro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCarro) return;

    try {
      await carroService.update(editingCarro, {
        ...carroForm,
        ano: parseInt(carroForm.ano),
        valor: parseFloat(carroForm.valor)
      });
      
      // Limpar estado de edição primeiro
      setEditingCarro(null);
      
      // Depois limpar o formulário
      setCarroForm({
        codigo: '',
        modeloId: '',
        ano: '',
        cor: '',
        descricao: '',
        observacoes: '',
        imagem: '',
        valor: ''
      });
      
      // Recarregar dados
      await loadData();
      
      showNotification('success', 'Sucesso!', 'Carro atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar carro:', error);
      showNotification('error', 'Erro ao Atualizar Carro', 'Ocorreu um erro ao atualizar o carro. Tente novamente.');
    }
  };

  const handleDeleteCarro = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este carro?')) {
      try {
        await carroService.delete(id);
        loadData();
        showNotification('success', 'Sucesso!', 'Carro excluído com sucesso!');
      } catch (error: any) {
        console.error('Erro ao excluir carro:', error);
        
        // Mostrar mensagem específica do erro
        if (error.response?.data?.message) {
          showNotification('error', 'Erro ao Excluir Carro', error.response.data.message);
        } else {
          showNotification('error', 'Erro ao Excluir Carro', 'Ocorreu um erro ao excluir o carro. Tente novamente.');
        }
      }
    }
  };

  const handleEditMarca = (marca: Marca) => {
    setEditingMarca(marca.id);
    setMarcaForm({ nome: marca.nome });
  };

  const handleCancelEditMarca = () => {
    setEditingMarca(null);
    setMarcaForm({ nome: '' });
  };

  const handleUpdateMarca = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMarca) return;

    try {
      await marcaService.update(editingMarca, marcaForm);
      setEditingMarca(null);
      setMarcaForm({ nome: '' });
      await loadData();
      showNotification('success', 'Sucesso!', 'Marca atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar marca:', error);
      showNotification('error', 'Erro ao Atualizar Marca', 'Ocorreu um erro ao atualizar a marca. Tente novamente.');
    }
  };

  const handleEditModelo = (modelo: Modelo) => {
    setEditingModelo(modelo.id);
    setModeloForm({
      codigo: modelo.codigo,
      descricao: modelo.descricao,
      marcaId: modelo.marcaId
    });
  };

  const handleCancelEditModelo = () => {
    setEditingModelo(null);
    setModeloForm({ codigo: '', descricao: '', marcaId: '' });
  };

  const handleUpdateModelo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModelo) return;

    try {
      await modeloService.update(editingModelo, modeloForm);
      setEditingModelo(null);
      setModeloForm({ codigo: '', descricao: '', marcaId: '' });
      await loadData();
      showNotification('success', 'Sucesso!', 'Modelo atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar modelo:', error);
      showNotification('error', 'Erro ao Atualizar Modelo', 'Ocorreu um erro ao atualizar o modelo. Tente novamente.');
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
                  {editingMarca ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  <span>{editingMarca ? 'Editar Marca' : 'Cadastrar Marca'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingMarca ? handleUpdateMarca : handleCreateMarca} className="space-y-4">
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
                  <div className="flex space-x-4">
                    <Button type="submit" className="flex-1">
                      {editingMarca ? 'Atualizar Marca' : 'Salvar Marca'}
                    </Button>
                    {editingMarca && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancelEditMarca}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
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
                    <div key={marca.id} className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      editingMarca === marca.id ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{marca.nome}</span>
                        {editingMarca === marca.id && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Editando
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditMarca(marca)}
                        >
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
                  {editingModelo ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  <span>{editingModelo ? 'Editar Modelo' : 'Cadastrar Modelo'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingModelo ? handleUpdateModelo : handleCreateModelo} className="space-y-4">
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
                  <div className="flex space-x-4">
                    <Button type="submit" className="flex-1">
                      {editingModelo ? 'Atualizar Modelo' : 'Salvar Modelo'}
                    </Button>
                    {editingModelo && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancelEditModelo}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
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
                    <div key={modelo.id} className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                      editingModelo === modelo.id ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{modelo.descricao}</span>
                          {editingModelo === modelo.id && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Editando
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{modelo.marca?.nome}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditModelo(modelo)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteModelo(modelo.id)}
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

        {activeTab === 'carros' && (
          <div className="space-y-8">
            {/* Formulário de Carro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {editingCarro ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  <span>{editingCarro ? 'Editar Carro' : 'Cadastrar Carro'}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={editingCarro ? handleUpdateCarro : handleCreateCarro} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor da Diária (R$)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Digite o valor da diária"
                      value={carroForm.valor}
                      onChange={(e) => setCarroForm({ ...carroForm, valor: e.target.value })}
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
                      Imagem do Carro
                    </label>
                    <ImageUpload
                      value={carroForm.imagem}
                      onChange={(value) => setCarroForm({ ...carroForm, imagem: value })}
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
                    <div className="flex space-x-4">
                      <Button type="submit" className="flex-1">
                        {editingCarro ? 'Atualizar Carro' : 'Salvar Carro'}
                      </Button>
                      {editingCarro && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleCancelEdit}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
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
                    <div 
                      key={carro.id} 
                      className={`p-4 rounded-lg transition-all ${
                        editingCarro === carro.id 
                          ? 'bg-blue-50 border-2 border-blue-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-3 mb-3">
                        {/* Imagem do carro */}
                        {carro.imagem && (
                          <div className="w-16 h-12 flex-shrink-0">
                            <img
                              src={carro.imagem}
                              alt={`${carro.modelo?.marca?.nome || ''} ${carro.modelo?.descricao || ''}`}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/car-icon.svg';
                              }}
                            />
                          </div>
                        )}
                        
                        {/* Informações do carro */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-lg truncate">
                              {carro.modelo?.marca?.nome} {carro.modelo?.descricao}
                            </h3>
                            {editingCarro === carro.id && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                                Editando
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{carro.descricao}</p>
                          <p className="text-sm text-gray-600">
                            {carro.ano} - {carro.cor}
                          </p>
                          <p className="text-sm font-semibold text-green-600">
                            R$ {carro.valor?.toFixed(2) || '150,00'}/dia
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditCarro(carro)}
                        >
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

      {/* Modal de Notificação */}
      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={closeNotification}
      />
    </div>
  );
};

export default Admin; 