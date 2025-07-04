import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Car, Users, Shield, Clock } from 'lucide-react';

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
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/cadastro">
                <Users className="mr-2 h-5 w-5" />
                Cadastrar-se
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
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                  <Car className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Frota Moderna</CardTitle>
                <CardDescription>
                  Veículos novos e bem conservados de diversas marcas e modelos
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Todos os veículos com seguro completo e assistência 24h
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-purple-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Disponibilidade</CardTitle>
                <CardDescription>
                  Locação rápida e fácil, disponível 24 horas por dia
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