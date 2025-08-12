// src/components/Login.tsx
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (user: { name: string; email: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Lütfen e-posta adresinizi girin.');
      return;
    }
    if (!password) {
      setError('Lütfen şifrenizi girin.');
      return;
    }

    setError('');
    // Mock login (Gerçek API ile değiştirilebilir)
    onLogin({ name: 'Ahmet Yılmaz', email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg max-w-md w-full p-8">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
            GD
          </div>
        </div>

        <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Dosya Yöneticisine Giriş Yap
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Şifrenizi girin"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center animate-pulse">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-3 rounded-md font-semibold shadow-md focus:outline-none focus:ring-4 focus:ring-blue-400"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
