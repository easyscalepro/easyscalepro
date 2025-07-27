"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Command {
  id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  prompt: string;
  tags: string[];
  views: number;
  copies: number;
  popularity: number;
}

interface CommandsContextType {
  commands: Command[];
  loading: boolean;
  setCommands: (commands: Command[]) => void;
  setLoading: (loading: boolean) => void;
}

const CommandsContext = createContext<CommandsContextType | undefined>(undefined);

export const useCommands = () => {
  const context = useContext(CommandsContext);
  if (!context) {
    throw new Error('useCommands must be used within a CommandsProvider');
  }
  return context;
};

export const CommandsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <CommandsContext.Provider value={{
      commands,
      loading,
      setCommands,
      setLoading
    }}>
      {children}
    </CommandsContext.Provider>
  );
};