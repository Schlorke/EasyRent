import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Car, User, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('userRole') === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">EasyRent</span>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Início
            </Link>
            <Link to="/locacao" className="text-gray-700 hover:text-blue-600">
              Veículos
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600">
                    Admin
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/cadastro')}
                >
                  Cadastro
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