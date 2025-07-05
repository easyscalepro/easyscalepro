export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          EasyScale
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Comandos ChatGPT para PMEs
        </p>
        <div className="space-y-4">
          <a 
            href="/login" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Fazer Login
          </a>
          <br />
          <a 
            href="/dashboard" 
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Ver Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}