// Configuração Firebase básica
// Para desenvolvimento, vamos simular a autenticação

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export interface Auth {
  currentUser: User | null;
}

// Mock do Firebase Auth para desenvolvimento
export const auth: Auth = {
  currentUser: null
};

// Funções simuladas do Firebase
export const onAuthStateChanged = (auth: Auth, callback: (user: User | null) => void) => {
  // Simular usuário logado para desenvolvimento
  const mockUser: User = {
    uid: 'mock-user-id',
    email: 'admin@easyscale.com',
    displayName: 'Admin EasyScale'
  };
  
  // Simular login automático após 1 segundo
  setTimeout(() => {
    auth.currentUser = mockUser;
    callback(mockUser);
  }, 1000);

  // Retornar função de cleanup
  return () => {};
};

export const signOut = async (auth: Auth) => {
  auth.currentUser = null;
  return Promise.resolve();
};

export const signInWithEmailAndPassword = async (auth: Auth, email: string, password: string) => {
  // Simular autenticação
  if (email && password) {
    const mockUser: User = {
      uid: 'mock-user-id',
      email: email,
      displayName: 'Admin EasyScale'
    };
    auth.currentUser = mockUser;
    return { user: mockUser };
  }
  throw new Error('Credenciais inválidas');
};