export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '16px'
        }}>
          EasyScale
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#6b7280',
          marginBottom: '32px'
        }}>
          Comandos ChatGPT para PMEs
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
          <a 
            href="/login"
            style={{
              display: 'inline-block',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
          >
            Fazer Login
          </a>
          <a 
            href="/dashboard"
            style={{
              display: 'inline-block',
              backgroundColor: '#7c3aed',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'background-color 0.2s'
            }}
          >
            Ver Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}