import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Car, Shield, Clock } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white overflow-hidden">
        {/* Banner de Carros */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/carros.jpg"
            alt="Frota de veículos EasyRent"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-800/80"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            Bem-vindo ao EasyRent
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-md">
            A solução completa para locação de veículos. Encontre o carro perfeito
            para sua necessidade com facilidade e segurança.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link to="/locacao">
                <Car className="mr-2 h-5 w-5" />
                Ver Veículos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o EasyRent?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Oferecemos a melhor experiência em locação de veículos com
              tecnologia moderna e atendimento personalizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="modern" className="text-center p-8 hover:scale-105">
              <CardHeader>
                <div className="mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
                  <Car className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl mb-3 text-gray-900">Frota Moderna</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Veículos novos e bem conservados de diversas marcas e modelos
                  para atender todas as suas necessidades
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="modern" className="text-center p-8 hover:scale-105">
              <CardHeader>
                <div className="mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
                  <Shield className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl mb-3 text-gray-900">Segurança Total</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Todos os veículos com seguro completo e assistência 24h
                  para sua total tranquilidade
                </CardDescription>
              </CardHeader>
            </Card>

            <Card variant="modern" className="text-center p-8 hover:scale-105">
              <CardHeader>
                <div className="mx-auto bg-gradient-to-br from-purple-100 to-purple-200 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
                  <Clock className="h-10 w-10 text-purple-600" />
                </div>
                <CardTitle className="text-2xl mb-3 text-gray-900">Disponibilidade 24h</CardTitle>
                <CardDescription className="text-base text-gray-600">
                  Locação rápida e fácil, disponível 24 horas por dia
                  para sua máxima conveniência
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 drop-shadow-md">
            Encontre o veículo ideal para sua próxima viagem
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <Link to="/locacao">
              <Car className="mr-2 h-5 w-5" />
              Explorar Veículos
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home; 