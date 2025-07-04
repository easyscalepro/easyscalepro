"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, TrendingUp, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const ReportsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  // Mock data para gráficos
  const categoryData = [
    { name: 'Marketing', value: 35, commands: 420 },
    { name: 'Finanças', value: 25, commands: 300 },
    { name: 'Gestão', value: 20, commands: 240 },
    { name: 'Vendas', value: 15, commands: 180 },
    { name: 'Outros', value: 5, commands: 60 }
  ];

  const usageData = [
    { day: 'Seg', copies: 45, views: 120 },
    { day: 'Ter', copies: 52, views: 140 },
    { day: 'Qua', copies: 38, views: 110 },
    { day: 'Qui', copies: 61, views: 160 },
    { day: 'Sex', copies: 55, views: 145 },
    { day: 'Sáb', copies: 28, views: 80 },
    { day: 'Dom', copies: 22, views: 65 }
  ];

  const COLORS = ['#2563EB', '#FBBF24', '#10B981', '#F59E0B', '#6B7280'];

  const handleExportReport = () => {
    toast.success('Relatório exportado com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-[#2563EB]" />
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={handleExportReport}
          className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115]"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-[#2563EB]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-green-600">+12% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comandos Copiados</CardTitle>
            <FileText className="h-4 w-4 text-[#2563EB]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,432</div>
            <p className="text-xs text-green-600">+18% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Engajamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#2563EB]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67.8%</div>
            <p className="text-xs text-green-600">+5.2% vs período anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-[#2563EB]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-green-600">+8.1% vs período anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Uso por dia da semana */}
        <Card>
          <CardHeader>
            <CardTitle>Uso por Dia da Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="copies" fill="#2563EB" name="Cópias" />
                <Bar dataKey="views" fill="#FBBF24" name="Visualizações" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Comandos por categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Comandos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de top comandos */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Comandos Mais Utilizados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Estratégia de Marketing Digital', category: 'Marketing', copies: 234, views: 567 },
              { name: 'Análise Financeira Mensal', category: 'Finanças', copies: 198, views: 445 },
              { name: 'Script de Vendas Persuasivo', category: 'Vendas', copies: 176, views: 398 },
              { name: 'Gestão de Equipe Remota', category: 'Gestão', copies: 154, views: 356 },
              { name: 'Plano de Negócios Completo', category: 'Estratégia', copies: 142, views: 334 }
            ].map((command, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-[#0F1115]">{command.name}</h4>
                  <p className="text-sm text-gray-600">{command.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{command.copies} cópias</p>
                  <p className="text-xs text-gray-500">{command.views} visualizações</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};