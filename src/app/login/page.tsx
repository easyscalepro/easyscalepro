"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      router.push('/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '24px'
      }}>
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '24px',
          color: '#1f2937'
        }}>
          Login - EasyScale
        </h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '4px'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none'
              }}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '4px'
            }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none'
              }}
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Entrar
          </button>
        </form>
        
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <a 
            href="/" 
            style={{
              color: '#2563eb',
              fontSize: '0.875rem',
              textDecoration: 'none'
            }}
          >
            ← Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}