import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Car, User, LogOut, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-300">
                <img
                  src="/assets/easyrent-logo.png"
                  alt="EasyRent Logo"
                  className="h-12 w-12 object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                EasyRent
              </span>
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-blue-50 transition-all duration-200"
            >
              Início
            </Link>
            <Link 
              to="/locacao" 
              className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-blue-50 transition-all duration-200"
            >
              Veículos
            </Link>
            
            {isAuthenticated ? (
              <>
                {/* Botão especial para Admin - apenas para usuários logados */}
                <Link 
                  to="/admin" 
                  className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-2 animate-pulse hover:animate-none"
                  title="Acesso liberado para fins acadêmicos"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Acesso à Área Admin Para Fins Acadêmicos</span>
                </Link>
                
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>
                <Button
                  onClick={() => navigate('/cadastro')}
                  className="flex items-center space-x-2"
                >
                  <span>Cadastro</span>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 