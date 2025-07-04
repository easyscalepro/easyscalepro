"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Webhook, 
  Key, 
  CreditCard, 
  Mail, 
  MessageSquare, 
  BarChart3,
  Globe,
  Database,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  RefreshCw,
  TestTube,
  Settings,
  Zap,
  Link,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

export const IntegrationsDashboard: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [stripeKey, setStripeKey] = useState('');
  const [emailConfig, setEmailConfig] = useState({
    provider: 'smtp',
    host: '',
    port: '',
    username: '',
    password: ''
  });

  const [integrationStatus, setIntegrationStatus] = useState({
    webhook: false,
    payment: false,
    email: false,
    analytics: true,
    sms: false
  });

  const handleSaveWebhook = () => {
    if (!webhookUrl.trim()) {
      toast.error('URL do webhook é obrigatória');
      return;
    }
    
    // Simular salvamento
    setIntegrationStatus({...integrationStatus, webhook: true});
    toast.success('Webhook configurado com sucesso!');
  };

  const handleGenerateApiKey = () => {
    const newKey = `esk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newKey);
    toast.success('Nova chave API gerada!');
  };

  const handleCopyApiKey = async () => {
    if (!apiKey) {
      toast.error('Nenhuma chave API para copiar');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(apiKey);
      toast.success('Chave API copiada!');
    } catch (error) {
      toast.error('Erro ao copiar chave API');
    }
  };

  const handleTestWebhook = () => {
    if (!webhookUrl) {
      toast.error('Configure o webhook primeiro');
      return;
    }
    
    toast.info('Enviando teste para webhook...');
    
    // Simular teste
    setTimeout(() => {
      toast.success('Webhook testado com sucesso!');
    }, 2000);
  };

  const handleSavePayment = () => {
    if (!stripeKey.trim()) {
      toast.error('Chave do Stripe é obrigatória');
      return;
    }
    
    setIntegrationStatus({...integrationStatus, payment: true});
    toast.success('Integração de pagamento configurada!');
  };

  const handleSaveEmail = () => {
    if (!emailConfig.host || !emailConfig.username) {
      toast.error('Configurações de email incompletas');
      return;
    }
    
    setIntegrationStatus({...integrationStatus, email: true});
    toast.success('Configuração de email salva!');
  };

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Conectado
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        <XCircle className="h-3 w-3 mr-1" />
        Desconectado
      </Badge>
    );
  };

  const integrationCards = [
    {
      title: 'Webhooks',
      description: 'Receba notificações em tempo real sobre eventos da plataforma',
      icon: Webhook,
      status: integrationStatus.webhook,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'API de Pagamento',
      description: 'Integração com Stripe para processar pagamentos',
      icon: CreditCard,
      status: integrationStatus.payment,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Email',
      description: 'Configuração SMTP para envio de emails automáticos',
      icon: Mail,
      status: integrationStatus.email,
      color: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Analytics',
      description: 'Integração com Google Analytics e outras ferramentas',
      icon: BarChart3,
      status: integrationStatus.analytics,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'SMS',
      description: 'Envio de SMS via Twilio ou outras APIs',
      icon: MessageSquare,
      status: integrationStatus.sms,
      color: 'from-indigo-500 to-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {integrationCards.map((integration, index) => {
          const Icon = integration.icon;
          return (
            <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${integration.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  {getStatusBadge(integration.status)}
                </div>
                <h3 className="font-semibold text-[#0F1115] mb-1">{integration.title}</h3>
                <p className="text-xs text-gray-600">{integration.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Configuration Tabs */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#2563EB]" />
            Configurações de Integração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="webhooks" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
              <TabsTrigger value="payment">Pagamentos</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Webhooks Tab */}
            <TabsContent value="webhooks" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F1115]">Configuração de Webhooks</h3>
                    <p className="text-sm text-gray-600">Configure endpoints para receber notificações de eventos</p>
                  </div>
                  {getStatusBadge(integrationStatus.webhook)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">URL do Webhook</Label>
                      <Input
                        id="webhook-url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://sua-api.com/webhook"
                        className="border-gray-200 focus:border-[#2563EB]"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveWebhook}
                        className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Salvar Webhook
                      </Button>
                      <Button
                        onClick={handleTestWebhook}
                        variant="outline"
                        className="border-[#2563EB] text-[#2563EB]"
                      >
                        <TestTube className="h-4 w-4 mr-2" />
                        Testar
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-[#0F1115] mb-2">Eventos Disponíveis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <span>user.created</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch defaultChecked />
                        <span>command.copied</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch />
                        <span>payment.completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch />
                        <span>subscription.updated</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* API Keys Tab */}
            <TabsContent value="api" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#0F1115]">Chaves de API</h3>
                  <p className="text-sm text-gray-600">Gerencie chaves de acesso para integração com APIs externas</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Chave API Principal</Label>
                      <div className="flex gap-2">
                        <Input
                          value={apiKey}
                          readOnly
                          placeholder="Nenhuma chave gerada"
                          className="border-gray-200 bg-gray-50"
                        />
                        <Button
                          onClick={handleCopyApiKey}
                          variant="outline"
                          size="sm"
                          disabled={!apiKey}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleGenerateApiKey}
                        className="bg-[#FBBF24] hover:bg-[#F59E0B] text-[#0F1115]"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Gerar Nova Chave
                      </Button>
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-600"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Revogar
                      </Button>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-[#0F1115] mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Segurança
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>• Mantenha suas chaves seguras</p>
                      <p>• Use HTTPS em todas as requisições</p>
                      <p>• Revogue chaves comprometidas</p>
                      <p>• Monitore o uso das APIs</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F1115]">Integração de Pagamentos</h3>
                    <p className="text-sm text-gray-600">Configure processadores de pagamento</p>
                  </div>
                  {getStatusBadge(integrationStatus.payment)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="stripe-key">Chave Pública do Stripe</Label>
                      <Input
                        id="stripe-key"
                        value={stripeKey}
                        onChange={(e) => setStripeKey(e.target.value)}
                        placeholder="pk_test_..."
                        className="border-gray-200 focus:border-[#2563EB]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stripe-secret">Chave Secreta do Stripe</Label>
                      <Input
                        id="stripe-secret"
                        type="password"
                        placeholder="sk_test_..."
                        className="border-gray-200 focus:border-[#2563EB]"
                      />
                    </div>

                    <Button
                      onClick={handleSavePayment}
                      className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Salvar Configuração
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-medium text-[#0F1115] mb-2">Métodos Suportados</h4>
                      <div className="space-y-1 text-sm">
                        <p>✓ Cartões de Crédito/Débito</p>
                        <p>✓ PIX</p>
                        <p>✓ Boleto Bancário</p>
                        <p>✓ PayPal</p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-medium text-[#0F1115] mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Modo de Teste
                      </h4>
                      <p className="text-sm text-gray-700">
                        Use chaves de teste para desenvolvimento. Mude para produção apenas quando estiver pronto.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Email Tab */}
            <TabsContent value="email" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F1115]">Configuração de Email</h3>
                    <p className="text-sm text-gray-600">Configure SMTP para envio de emails</p>
                  </div>
                  {getStatusBadge(integrationStatus.email)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp-host">Servidor SMTP</Label>
                        <Input
                          id="smtp-host"
                          value={emailConfig.host}
                          onChange={(e) => setEmailConfig({...emailConfig, host: e.target.value})}
                          placeholder="smtp.gmail.com"
                          className="border-gray-200 focus:border-[#2563EB]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtp-port">Porta</Label>
                        <Input
                          id="smtp-port"
                          value={emailConfig.port}
                          onChange={(e) => setEmailConfig({...emailConfig, port: e.target.value})}
                          placeholder="587"
                          className="border-gray-200 focus:border-[#2563EB]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-username">Usuário</Label>
                      <Input
                        id="smtp-username"
                        value={emailConfig.username}
                        onChange={(e) => setEmailConfig({...emailConfig, username: e.target.value})}
                        placeholder="seu@email.com"
                        className="border-gray-200 focus:border-[#2563EB]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtp-password">Senha</Label>
                      <Input
                        id="smtp-password"
                        type="password"
                        value={emailConfig.password}
                        onChange={(e) => setEmailConfig({...emailConfig, password: e.target.value})}
                        placeholder="••••••••"
                        className="border-gray-200 focus:border-[#2563EB]"
                      />
                    </div>

                    <Button
                      onClick={handleSaveEmail}
                      className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Salvar Configuração
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-medium text-[#0F1115] mb-2">Provedores Recomendados</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Gmail:</strong> smtp.gmail.com:587
                        </div>
                        <div>
                          <strong>Outlook:</strong> smtp-mail.outlook.com:587
                        </div>
                        <div>
                          <strong>SendGrid:</strong> smtp.sendgrid.net:587
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full border-[#2563EB] text-[#2563EB]"
                    >
                      <TestTube className="h-4 w-4 mr-2" />
                      Testar Configuração
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#0F1115]">Analytics e Monitoramento</h3>
                    <p className="text-sm text-gray-600">Configure ferramentas de análise e monitoramento</p>
                  </div>
                  {getStatusBadge(integrationStatus.analytics)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ga-id">Google Analytics ID</Label>
                      <Input
                        id="ga-id"
                        placeholder="G-XXXXXXXXXX"
                        className="border-gray-200 focus:border-[#2563EB]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hotjar-id">Hotjar Site ID</Label>
                      <Input
                        id="hotjar-id"
                        placeholder="1234567"
                        className="border-gray-200 focus:border-[#2563EB]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mixpanel-token">Mixpanel Token</Label>
                      <Input
                        id="mixpanel-token"
                        placeholder="your-mixpanel-token"
                        className="border-gray-200 focus:border-[#2563EB]"
                      />
                    </div>

                    <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Salvar Analytics
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-medium text-[#0F1115] mb-2">Métricas Coletadas</h4>
                      <div className="space-y-1 text-sm">
                        <p>• Pageviews e sessões</p>
                        <p>• Comandos mais utilizados</p>
                        <p>• Tempo de permanência</p>
                        <p>• Conversões e eventos</p>
                        <p>• Dados demográficos</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-[#0F1115] mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Status das Integrações
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Google Analytics</span>
                          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Hotjar</span>
                          <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Mixpanel</span>
                          <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#2563EB]" />
            Log de Atividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '14:32', action: 'Webhook configurado', status: 'success' },
              { time: '13:45', action: 'Teste de pagamento realizado', status: 'success' },
              { time: '12:18', action: 'Falha na conexão SMTP', status: 'error' },
              { time: '11:22', action: 'API key gerada', status: 'success' },
              { time: '10:15', action: 'Analytics configurado', status: 'success' }
            ].map((log, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-500">{log.time}</span>
                <span className="text-sm text-[#0F1115] flex-1">{log.action}</span>
                {log.status === 'success' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};