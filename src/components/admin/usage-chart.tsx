"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const UsageChart: React.FC = () => {
  const data = [
    { name: 'Jan', usuarios: 65, comandos: 120 },
    { name: 'Fev', usuarios: 78, comandos: 145 },
    { name: 'Mar', usuarios: 90, comandos: 180 },
    { name: 'Abr', usuarios: 105, comandos: 220 },
    { name: 'Mai', usuarios: 125, comandos: 280 },
    { name: 'Jun', usuarios: 142, comandos: 320 },
    { name: 'Jul', usuarios: 158, comandos: 380 },
  ];

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#0F1115]">
          Crescimento de Usuários e Comandos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="usuarios" 
              stroke="#2563EB" 
              strokeWidth={3}
              name="Usuários Ativos"
            />
            <Line 
              type="monotone" 
              dataKey="comandos" 
              stroke="#FBBF24" 
              strokeWidth={3}
              name="Comandos Copiados"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};