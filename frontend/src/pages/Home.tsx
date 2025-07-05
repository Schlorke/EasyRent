import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Car, Shield, Clock } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bem-vindo ao EasyRent
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            A solução completa para locação de veículos. Encontre o carro perfeito
            para sua necessidade com facilidade e segurança.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/locacao">
                <Car className="mr-2 h-5 w-5" />
                Ver Veículos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
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
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8">
            Encontre o veículo ideal para sua próxima viagem
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link to="/locacao">
              Explorar Veículos
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home; 