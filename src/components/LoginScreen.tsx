import React, { useState } from 'react';

type Props = {
  onLogin: (user: { name: string; email: string }) => void;
};

const LoginScreen: React.FC<Props> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      onLogin({ name, email });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Giriş Yap</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">İsim</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium dark:text-gray-300">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
