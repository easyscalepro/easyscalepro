"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Download, 
  Share, 
  Plus, 
  Smartphone, 
  ArrowUp, 
  Home,
  X,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';

export const IOSInstallButton: React.FC = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Detectar se já está instalado
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone ||
                      document.referrer.includes('android-app://');
    setIsStandalone(standalone);
  }, []);

  // Não mostrar se não for iOS ou se já estiver instalado
  if (!isIOS || isStandalone) {
    return null;
  }

  const steps = [
    {
      icon: Share,
      title: "1. Toque no botão Compartilhar",
      description: "Na barra inferior do Safari, toque no ícone de compartilhar",
      detail: "Procure pelo ícone de uma caixa com uma seta para cima"
    },
    {
      icon: Plus,
      title: "2. Adicionar à Tela de Início",
      description: "Role para baixo e toque em 'Adicionar à Tela de Início'",
      detail: "Você verá o ícone do EasyScale e poderá personalizar o nome"
    },
    {
      icon: Home,
      title: "3. Confirmar Instalação",
      description: "Toque em 'Adicionar' para instalar o app",
      detail: "O EasyScale aparecerá na sua tela inicial como um app nativo"
    }
  ];

  const handleInstallClick = () => {
    setShowInstructions(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowInstructions(false);
      toast.success('Instruções concluídas! Siga os passos no Safari para instalar o app.');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      {/* Botão de instalação para iOS */}
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm lg:hidden">
        <Card className="border-0 shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
          <CardContent className="p-4 relative">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Instalar EasyScale</h3>
                    <p className="text-white/80 text-xs">Acesso rápido aos comandos</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 text-xs text-white/90">
                <CheckCircle className="h-3 w-3" />
                <span>Funciona offline</span>
                <span>•</span>
                <span>Acesso rápido</span>
                <span>•</span>
                <span>Sem anúncios</span>
              </div>

              <Button
                onClick={handleInstallClick}
                size="sm"
                className="w-full bg-white text-blue-600 hover:bg-white/90 font-bold"
              >
                <Download className="h-4 w-4 mr-2" />
                Como Instalar no iPhone
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal com instruções */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-sm mx-auto bg-white dark:bg-gray-900 border-0 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Instalar EasyScale
              </DialogTitle>
              <Button
                onClick={() => setShowInstructions(false)}
                variant="ghost"
                size="sm"
                className="p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress indicator */}
            <div className="flex items-center justify-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Current step */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                {React.createElement(steps[currentStep].icon, {
                  className: "h-8 w-8 text-white"
                })}
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {steps[currentStep].description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {steps[currentStep].detail}
                </p>
              </div>
            </div>

            {/* Visual guide for current step */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              {currentStep === 0 && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-2 rounded-lg text-sm font-medium">
                    <Share className="h-4 w-4" />
                    Botão Compartilhar
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Localizado na barra inferior do Safari
                  </p>
                </div>
              )}

              {currentStep === 1 && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-2 rounded-lg text-sm font-medium">
                    <Plus className="h-4 w-4" />
                    Adicionar à Tela de Início
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Role para baixo na lista de opções
                  </p>
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-2 rounded-lg text-sm font-medium">
                    <Home className="h-4 w-4" />
                    App Instalado!
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    O EasyScale aparecerá na sua tela inicial
                  </p>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  onClick={prevStep}
                  variant="outline"
                  className="flex-1"
                >
                  Anterior
                </Button>
              )}
              
              <Button
                onClick={nextStep}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
                {currentStep < steps.length - 1 && (
                  <ArrowUp className="h-4 w-4 ml-2 rotate-90" />
                )}
              </Button>
            </div>

            {/* Additional tip */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-800 dark:text-blue-300 text-center">
                💡 <strong>Dica:</strong> Após instalar, o EasyScale funcionará como um app nativo, 
                mesmo sem internet!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};