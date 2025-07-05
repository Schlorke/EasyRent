import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { userService } from '../services/api';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await userService.login({ email, senha });
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', 'admin'); // Para fins acadêmicos, todos têm acesso total
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <img
                src="/assets/easyrent-logo.png"
                alt="EasyRent Logo"
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Faça login na sua conta
          </h2>
          <p className="mt-3 text-base text-gray-600">
            Ou{' '}
            <Link to="/cadastro" className="font-semibold text-blue-600 hover:text-blue-500 underline">
              crie uma nova conta
            </Link>
          </p>
        </div>

        <Card variant="elevated" className="p-8">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">Bem-vindo de volta!</CardTitle>
            <CardDescription className="text-base">
              Entre com suas credenciais para acessar o EasyRent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-3 text-red-700 bg-red-50 p-4 rounded-lg border border-red-200">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-semibold text-gray-800">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 border-2 border-gray-300 focus:border-blue-500 rounded-lg"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="senha" className="text-sm font-semibold text-gray-800">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-11 h-12 border-2 border-gray-300 focus:border-blue-500 rounded-lg"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login; 