import React, { useState } from 'react';
//import { FileItem as FileType } from '@/data/FileSystem';
import { MoreVertical, Star, StarOff, Trash } from 'lucide-react';
import { UploadedFile } from './App';

type Props = {
  file: UploadedFile;
  onFolderClick?: (id: number) => void;
  onPreviewFile?: (file: UploadedFile) => void;
  onMoveToTrash?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  isFavorite?: boolean;
};

const FileItem: React.FC<Props> = ({
  file,
  onFolderClick,
  onPreviewFile,
  onMoveToTrash,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClick = () => {
    // UploadedFile her zaman dosyadır, folder değil
    if (onPreviewFile) {
      console.log('Dosya tıklandı:', file.name);
      onPreviewFile(file);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) onToggleFavorite(file.id);
  };

  const handleMoveToTrash = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMoveToTrash) onMoveToTrash(file.id);
    setMenuOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="text-2xl mb-2">
        {file.type === 'pdf' && '📄'}
        {file.type === 'excel' && '📊'}
        {file.type === 'image' && '🖼️'}
        {file.type === 'document' && '📝'}
        {file.type === 'text' && '📄'}
      </div>
      <div className="text-sm font-semibold text-gray-800 dark:text-white truncate">
        {file.name}
      </div>
      <div className="text-xs text-gray-500 capitalize">{file.type}</div>

      {/* Sağ alt köşe: Favori butonu */}
      <button
        onClick={handleToggleFavorite}
        className="absolute bottom-2 right-2 text-yellow-500 hover:text-yellow-600"
        title="Favorilere ekle/kaldır"
      >
        {isFavorite ? <Star fill="currentColor" /> : <StarOff />}
      </button>

      {/* Üç nokta menüsü */}
      <div className="absolute top-2 right-2">
        <button onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}>
          <MoreVertical className="text-gray-600 dark:text-gray-300" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 shadow-lg rounded z-10">
            <button
              onClick={handleMoveToTrash}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
            >
              <Trash size={16} /> Çöp Kutusuna Taşı
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileItem;