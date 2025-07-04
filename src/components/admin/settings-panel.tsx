"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Save, Upload, Database, Mail, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'EasyScale',
    siteDescription: 'Mais de 1.000 comandos de ChatGPT para PMEs',
    allowRegistration: true,
    requireEmailVerification: false,
    enableNotifications: true,
    maxCommandsPerUser: 100,
    backupFrequency: 'daily',
    maintenanceMode: false
  });

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const handleBackup = () => {
    toast.success('Backup iniciado com sucesso!');
  };

  const handleImport = () => {
    toast.info('Funcionalidade de importação em desenvolvimento');
  };

  return (
    <div className="space-y-6">
      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#2563EB]" />
            <CardTitle>Configurações Gerais</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Nome do Site</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxCommands">Máx. Comandos por Usuário</Label>
              <Input
                id="maxCommands"
                type="number"
                value={settings.maxCommandsPerUser}
                onChange={(e) => setSettings({...settings, maxCommandsPerUser: parseInt(e.target.value)})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Descrição do Site</Label>
            <Textarea
              id="siteDescription"
              value={settings.siteDescription}
              onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Usuário */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#2563EB]" />
            <CardTitle>Configurações de Usuário</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Permitir Novos Registros</Label>
              <p className="text-sm text-gray-600">Usuários podem criar novas contas</p>
            </div>
            <Switch
              checked={settings.allowRegistration}
              onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Verificação de Email</Label>
              <p className="text-sm text-gray-600">Exigir verificação de email para novos usuários</p>
            </div>
            <Switch
              checked={settings.requireEmailVerification}
              onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notificações</Label>
              <p className="text-sm text-gray-600">Enviar notificações por email aos usuários</p>
            </div>
            <Switch
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações do Sistema */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-[#2563EB]" />
            <CardTitle>Sistema e Backup</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo Manutenção</Label>
              <p className="text-sm text-gray-600">Desabilitar acesso temporariamente</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleBackup}
              variant="outline"
              className="border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white"
            >
              <Database className="h-4 w-4 mr-2" />
              Fazer Backup Agora
            </Button>
            
            <Button
              onClick={handleImport}
              variant="outline"
              className="border-gray-300"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar Dados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Email */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#2563EB]" />
            <CardTitle>Configurações de Email</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">Servidor SMTP</Label>
              <Input
                id="smtpHost"
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">Porta SMTP</Label>
              <Input
                id="smtpPort"
                placeholder="587"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emailFrom">Email Remetente</Label>
              <Input
                id="emailFrom"
                placeholder="noreply@easyscale.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailPassword">Senha do Email</Label>
              <Input
                id="emailPassword"
                type="password"
                placeholder="••••••••"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115] font-medium"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};