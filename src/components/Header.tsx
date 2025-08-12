import React from 'react';
import { Moon, Sun, User } from 'lucide-react';

type HeaderProps = {
  user: { name: string; email: string };
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  onProfileClick: () => void;
};

const Header: React.FC<HeaderProps> = ({ user, onToggleDarkMode, isDarkMode, onProfileClick }) => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 shadow-sm">
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">Dosya Yöneticisi</h1>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={onProfileClick}
          className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <User size={18} />
          <span className="text-sm text-gray-800 dark:text-gray-200">{user.name}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
