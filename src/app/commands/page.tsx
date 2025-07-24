"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/loading-screen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Command, 
  Filter,
  Star,
  Copy,
  Eye,
  TrendingUp
} from 'lucide-react';

export default function CommandsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Simular carregamento da página
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Simular carregamento de dados
  useEffect(() => {
    if (!pageLoading) {
      const timer = setTimeout(() => {
        setDataLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [pageLoading]);

  if (loading || pageLoading) {
    return (
      <LoadingScreen 
        message="Carregando comandos..."
        submessage="Buscando comandos especializados"
      />
    );
  }

  if (!user) {
    return null;
  }

  if (dataLoading) {
    return (
      <LoadingScreen 
        message="Carregando biblioteca de comandos..."
        submessage="Preparando mais de 1.000 comandos para você"
      />
    );
  }

  const mockCommands = [
    {
      id: 1,
      title: "Análise de Concorrência",
      description: "Comando para analisar estratégias da concorrência",
      category: "Marketing",
      level: "Intermediário",
      views: 1250,
      copies: 89,
      rating: 4.8
    },
    {
      id: 2,
      title: "Criação de Conteúdo para Redes Sociais",
      description: "Gere posts engajadores para suas redes sociais",
      category: "Conteúdo",
      level: "Básico",
      views: 2100,
      copies: 156,
      rating: 4.9
    },
    {
      id: 3,
      title: "Estratégia de Vendas B2B",
      description: "Desenvolva estratégias eficazes para vendas B2B",
      category: "Vendas",
      level: "Avançado",
      views: 890,
      copies: 67,
      rating: 4.7
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0F1115] mb-2">
            Biblioteca de Comandos
          </h1>
          <p className="text-gray-600">
            Mais de 1.000 comandos especializados para impulsionar seu negócio
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Command className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0F1115]">1,247</div>
                  <div className="text-sm text-gray-600">Total Comandos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0F1115]">89</div>
                  <div className="text-sm text-gray-600">Novos Esta Semana</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Star className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0F1115]">4.8</div>
                  <div className="text-sm text-gray-600">Avaliação Média</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Copy className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#0F1115]">15.2k</div>
                  <div className="text-sm text-gray-600">Cópias Este Mês</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-gray-200 mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar comandos..."
                  className="pl-10 h-12 border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]"
                />
              </div>
              
              <Button variant="outline" className="h-12 border-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                Categoria
              </Button>
              
              <Button variant="outline" className="h-12 border-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                Nível
              </Button>
              
              <Button variant="outline" className="h-12 border-gray-200">
                <Filter className="h-4 w-4 mr-2" />
                Popularidade
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Commands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCommands.map((command) => (
            <Card key={command.id} className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-[#0F1115] mb-2">
                      {command.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mb-3">
                      {command.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    {command.category}
                  </Badge>
                  <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                    {command.level}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {command.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Copy className="h-4 w-4" />
                      {command.copies}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {command.rating}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115]"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button 
            size="lg"
            variant="outline"
            className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
          >
            Carregar Mais Comandos
          </Button>
        </div>
      </div>
    </div>
  );
}