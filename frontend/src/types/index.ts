export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
}

export interface Marca {
  id: string;
  nome: string;
  modelos?: Modelo[];
}

export interface Modelo {
  id: string;
  codigo: string;
  marcaId: string;
  descricao: string;
  marca?: Marca;
  carros?: Carro[];
}

export interface Carro {
  id: string;
  codigo: string;
  modeloId: string;
  ano: number;
  cor: string;
  descricao: string;
  observacoes?: string;
  imagem?: string;
  valor: number;
  modelo?: Modelo;
  locacoes?: Locacao[];
}

export interface Locacao {
  id: string;
  codigo: string;
  carroId: string;
  usuarioId: string;
  dataRetirada: Date;
  dataDevolucao: Date;
  valor: number;
  observacoes?: string;
  carro?: Carro;
  usuario?: Usuario;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
} 