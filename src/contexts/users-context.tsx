"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'ativo' | 'inativo' | 'suspenso';
  role: 'admin' | 'user' | 'moderator';
  lastAccess: string;
  commandsUsed: number;
  joinedAt: string;
  avatar?: string;
  phone?: string;
  company?: string;
}

interface UsersContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'joinedAt' | 'commandsUsed' | 'lastAccess'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  toggleUserStatus: (id: string) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

const initialUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    status: 'ativo',
    role: 'user',
    lastAccess: '30 min atrás',
    commandsUsed: 45,
    joinedAt: '2024-01-10',
    company: 'Empresa ABC Ltda',
    phone: '(11) 99999-9999'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@startup.com',
    status: 'ativo',
    role: 'admin',
    lastAccess: '2 horas atrás',
    commandsUsed: 78,
    joinedAt: '2024-01-08',
    company: 'Startup XYZ',
    phone: '(11) 88888-8888'
  },
  {
    id: '3',
    name: 'Pedro Costa',
    email: 'pedro@pme.com',
    status: 'inativo',
    role: 'user',
    lastAccess: '1 semana atrás',
    commandsUsed: 23,
    joinedAt: '2024-01-05',
    company: 'PME Solutions',
    phone: '(11) 77777-7777'
  },
  {
    id: '4',
    name: 'Ana Oliveira',
    email: 'ana@consultoria.com',
    status: 'suspenso',
    role: 'moderator',
    lastAccess: '3 dias atrás',
    commandsUsed: 156,
    joinedAt: '2023-12-20',
    company: 'Consultoria Pro',
    phone: '(11) 66666-6666'
  }
];

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('easyscale_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      setUsers(initialUsers);
      localStorage.setItem('easyscale_users', JSON.stringify(initialUsers));
    }
  }, []);

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('easyscale_users', JSON.stringify(newUsers));
  };

  const addUser = (userData: Omit<User, 'id' | 'joinedAt' | 'commandsUsed' | 'lastAccess'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      joinedAt: new Date().toISOString().split('T')[0],
      commandsUsed: 0,
      lastAccess: 'Nunca'
    };
    
    const newUsers = [...users, newUser];
    saveUsers(newUsers);
    toast.success('Usuário criado com sucesso!');
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const newUsers = users.map(user => 
      user.id === id ? { ...user, ...updates } : user
    );
    saveUsers(newUsers);
    toast.success('Usuário atualizado com sucesso!');
  };

  const deleteUser = (id: string) => {
    const newUsers = users.filter(user => user.id !== id);
    saveUsers(newUsers);
    toast.success('Usuário excluído com sucesso!');
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  const toggleUserStatus = (id: string) => {
    const user = getUserById(id);
    if (user) {
      const newStatus = user.status === 'ativo' ? 'inativo' : 'ativo';
      updateUser(id, { status: newStatus });
    }
  };

  return (
    <UsersContext.Provider value={{
      users,
      addUser,
      updateUser,
      deleteUser,
      getUserById,
      toggleUserStatus
    }}>
      {children}
    </UsersContext.Provider>
  );
};