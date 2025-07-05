import axios from 'axios';
import type { Usuario, Marca, Modelo, Carro, LoginRequest, LoginResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Serviços de usuário
export const userService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: Omit<Usuario, 'id'>): Promise<Usuario> {
    const response = await api.post('/usuarios', userData);
    return response.data;
  },

  async getProfile(): Promise<Usuario> {
    const response = await api.get('/usuarios/profile');
    return response.data;
  },
};

// Serviços de marca
export const marcaService = {
  async getAll(): Promise<Marca[]> {
    const response = await api.get('/marcas');
    return response.data;
  },

  async create(marca: Omit<Marca, 'id'>): Promise<Marca> {
    const response = await api.post('/marcas', marca);
    return response.data;
  },

  async update(id: string, marca: Partial<Marca>): Promise<Marca> {
    const response = await api.put(`/marcas/${id}`, marca);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/marcas/${id}`);
  },
};

// Serviços de modelo
export const modeloService = {
  async getAll(): Promise<Modelo[]> {
    const response = await api.get('/modelos');
    return response.data;
  },

  async getByMarca(marcaId: string): Promise<Modelo[]> {
    const response = await api.get(`/modelos/marca/${marcaId}`);
    return response.data;
  },

  async create(modelo: Omit<Modelo, 'id'>): Promise<Modelo> {
    const response = await api.post('/modelos', modelo);
    return response.data;
  },

  async update(id: string, modelo: Partial<Modelo>): Promise<Modelo> {
    const response = await api.put(`/modelos/${id}`, modelo);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/modelos/${id}`);
  },
};

// Serviços de carro
export const carroService = {
  async getAll(): Promise<Carro[]> {
    const response = await api.get('/carros');
    return response.data;
  },

  async getById(id: string): Promise<Carro> {
    const response = await api.get(`/carros/${id}`);
    return response.data;
  },

  async create(carro: Omit<Carro, 'id'>): Promise<Carro> {
    const response = await api.post('/carros', carro);
    return response.data;
  },

  async update(id: string, carro: Partial<Carro>): Promise<Carro> {
    const response = await api.put(`/carros/${id}`, carro);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/carros/${id}`);
  },
};

// Serviços de upload
export const uploadService = {
  async uploadCarImage(file: File): Promise<{ filename: string; path: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/carro-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteCarImage(filename: string): Promise<void> {
    await api.delete(`/upload/carro-image/${filename}`);
  },

  async getCarImages(): Promise<Array<{ filename: string; path: string }>> {
    const response = await api.get('/upload/carro-images');
    return response.data;
  },
};

export default api; 