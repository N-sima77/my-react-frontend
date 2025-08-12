import React from 'react';

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose, user, onLogout }) => {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-[320px] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
          aria-label="Close Profile Modal"
        >
          ×
        </button>

        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Profil</h2>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Ad:</span> {user.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">Email:</span> {user.email}
          </p>
        </div>

        <button
          onClick={onLogout}
          className="mt-2 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;