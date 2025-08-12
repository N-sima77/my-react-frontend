// Interface tanımları
interface UploadedFile {
  id: number;
  name: string;
  type: 'pdf' | 'excel' | 'image' | 'document';
  size: string;
  uploadDate: string;
  category: 'Belgeler' | 'Tablolar' | 'Resimler' | 'Diğer';
  favorite?: boolean;
  deleted?: boolean;
}

interface RecentFile extends UploadedFile {
  lastOpened: Date;
}

interface SidebarProps {
  onFolderSelect: (folder: string) => void;
  onNavigate: (section: 'favorites' | 'trash' | 'recent') => void;
  recentFiles?: RecentFile[];
}

// Sidebar.tsx
import React, { useState } from 'react';
import { Trash2, Star, FolderPlus, ChevronLeft, ChevronRight, Clock, FileText } from 'lucide-react';



const Sidebar: React.FC<SidebarProps> = ({ onFolderSelect, onNavigate, recentFiles = [] }) => {
  const [folders, setFolders] = useState<string[]>(['Okul', 'İş']);
  const [newFolder, setNewFolder] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const addFolder = () => {
    const trimmed = newFolder.trim();
    if (trimmed && !folders.includes(trimmed)) {
      setFolders(prev => [...prev, trimmed]);
      setNewFolder('');
    }
  };

  const getFileIcon = (type: 'pdf' | 'excel' | 'image' | 'document') => {
    switch (type) {
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      case 'excel': return '📊';
      case 'document': return '📝';
      default: return '📄';
    }
  };

  return (
    <div className={`h-full bg-white dark:bg-gray-900 shadow-md flex flex-col justify-between transition-width duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Üst Bölüm: Klasör Oluşturma ve Liste */}
      <div className="p-4 flex flex-col flex-grow overflow-y-auto">
        <div className={`flex items-center gap-2 mb-4 ${collapsed ? 'justify-center' : ''}`}>
          {!collapsed && <FolderPlus size={20} />}
          {!collapsed && (
            <input
              type="text"
              placeholder="Klasör adı"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value)}
              className="flex-1 px-2 py-1 rounded border text-sm dark:bg-gray-800 dark:text-white"
            />
          )}
          {!collapsed && (
            <button
              onClick={addFolder}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              title="Klasör Ekle"
            >
              Ekle
            </button>
          )}
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title={collapsed ? "Sidebar Aç" : "Sidebar Kapat"}
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Klasör Listesi */}
        <div className="flex flex-col space-y-1 mb-6">
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => onFolderSelect(folder)}
              className={`flex items-center gap-2 rounded px-2 py-1 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white text-sm truncate ${
                collapsed ? 'justify-center' : ''
              }`}
              title={folder}
            >
              <span role="img" aria-label="folder">📁</span>
              {!collapsed && folder}
            </button>
          ))}
        </div>

        {/* En Son Gezdiğim Dosyalar Bölümü */}
        {!collapsed && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} className="text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                En Son Gezdiğim
              </span>
            </div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {recentFiles.slice(0, 5).map((file) => (
                <button
                  key={file.id}
                  onClick={() => onNavigate('recent')}
                  className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs text-gray-600 dark:text-gray-400"
                  title={file.name}
                >
                  <span className="text-sm">{getFileIcon(file.type)}</span>
                  <span className="truncate flex-1">{file.name}</span>
                </button>
              ))}
              {recentFiles.length === 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-500 px-2 py-1">
                  Henüz dosya açılmadı
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Alt Bölüm: Favoriler ve Çöp Kutusu */}
      <div className={`border-t border-gray-300 dark:border-gray-600 p-4 space-y-3 ${collapsed ? 'flex flex-col items-center' : ''}`}>
        <button
          onClick={() => onNavigate('favorites')}
          className={`flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:underline text-sm ${
            collapsed ? 'justify-center w-full' : ''
          }`}
          title="Favoriler"
        >
          <Star size={16} />
          {!collapsed && 'Favoriler'}
        </button>
        <button
          onClick={() => onNavigate('trash')}
          className={`flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:underline text-sm ${
            collapsed ? 'justify-center w-full' : ''
          }`}
          title="Çöp Kutusu"
        >
          <Trash2 size={16} />
          {!collapsed && 'Çöp Kutusu'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;