"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  commands_used: number;
  last_access: string;
  created_at: string;
}

interface UsersContextType {
  users: User[];
  loading: boolean;
  setUsers: (users: User[]) => void;
  setLoading: (loading: boolean) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <UsersContext.Provider value={{
      users,
      loading,
      setUsers,
      setLoading
    }}>
      {children}
    </UsersContext.Provider>
  );
};