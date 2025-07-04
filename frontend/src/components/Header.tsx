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
    <header className="bg-white shadow-lg border-b-2 border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-blue-600 rounded-lg p-2 group-hover:bg-blue-700 transition-colors">
                <Car className="h-8 w-8 text-white" />
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
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md hover:bg-blue-50 transition-all duration-200"
                  >
                    Admin
                  </Link>
                )}
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