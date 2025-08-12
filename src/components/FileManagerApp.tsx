// FileManagerApp.tsx
import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, Settings, User, Folder, File, Upload, Grid, List, Filter, 
  MoreVertical, Home, Star, Share, Trash2, HardDrive, Menu, X 
} from 'lucide-react';

import Sidebar from './Sidebar';  // Kendi Sidebar bileşenin

interface UploadedFile {
  id: number;
  name: string;
  type: 'pdf' | 'excel' | 'image' | 'document';
  size: string;
  uploadDate: string;
  category: string; // artık category string çünkü Sidebar klasör isimleri dinamik
  favorite?: boolean;
  deleted?: boolean;
}

interface User {
  name: string;
  email: string;
}

interface FileManagerAppProps {
  user: User;
  onLogout: () => void;
}

const FileManagerApp: React.FC<FileManagerAppProps> = ({ user, onLogout }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // Seçili klasör / kategori: klasör adı ya da 'favorites' ya da 'trash'
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Dark mode efekti
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // Dosya yükleme fonksiyonu (basit)
  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach((file, index) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      let type: UploadedFile['type'] = 'document';
      let category = 'Diğer';

      if (ext === 'pdf') { type = 'pdf'; category = 'Belgeler'; }
      else if (ext === 'xlsx' || ext === 'xls') { type = 'excel'; category = 'Tablolar'; }
      else if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) { type = 'image'; category = 'Resimler'; }
      else if (['doc', 'docx', 'txt'].includes(ext)) { type = 'document'; category = 'Belgeler'; }

      const newFile: UploadedFile = {
        id: Date.now() + index,
        name: file.name,
        type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date().toLocaleDateString('tr-TR'),
        category,
        favorite: false,
        deleted: false,
      };
      setUploadedFiles(prev => [...prev, newFile]);
    });
  };

  // Favori toggle
  const toggleFavorite = (id: number) => {
    setUploadedFiles(prev =>
      prev.map(file => (file.id === id ? { ...file, favorite: !file.favorite } : file))
    );
  };

  // Çöp kutusuna taşıma
  const moveToTrash = (id: number) => {
    setUploadedFiles(prev =>
      prev.map(file => (file.id === id ? { ...file, deleted: true, favorite: false } : file))
    );
  };

  // Geri yükleme
  const restoreFromTrash = (id: number) => {
    setUploadedFiles(prev =>
      prev.map(file => (file.id === id ? { ...file, deleted: false } : file))
    );
  };

  // Kalıcı silme
  const permanentlyDelete = (id: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  // Aktif dosyalar, favoriler, çöp kutusu
  const activeFiles = uploadedFiles.filter(f => !f.deleted);
  const favoriteFiles = activeFiles.filter(f => f.favorite);
  const trashFiles = uploadedFiles.filter(f => f.deleted);

  // Sidebar klasörleri: Sidebar'dan gelen klasör isimleriyle uyumlu olması lazım.
  // Burada tüm dosyalardaki kategori isimlerini uniq alıyoruz.
  const folders = Array.from(new Set(activeFiles.map(f => f.category)));

  // Dosyaları filtrele seçili kategoriye göre
  let filesToShow: UploadedFile[] = [];

  if (selectedCategory === 'favorites') {
    filesToShow = favoriteFiles;
  } else if (selectedCategory === 'trash') {
    filesToShow = trashFiles;
  } else if (selectedCategory && folders.includes(selectedCategory)) {
    filesToShow = activeFiles.filter(f => f.category === selectedCategory);
  } else {
    filesToShow = activeFiles;
  }

  // File list component
  const FileList: React.FC<{ files: UploadedFile[] }> = ({ files }) => {
    if (files.length === 0) {
      return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Henüz dosya yok</div>;
    }

    return (
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}>
        {files.map(file => (
          <div
            key={file.id}
            className={`bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer relative
            ${viewMode === 'list' ? 'flex items-center space-x-3' : ''}
            `}
          >
            <div
              className={`${
                file.type === 'pdf' ? 'bg-red-500' :
                file.type === 'excel' ? 'bg-green-500' :
                file.type === 'image' ? 'bg-purple-500' :
                'bg-blue-500'
              } ${viewMode === 'grid' ? 'w-10 h-10' : 'w-8 h-8'} rounded-lg flex items-center justify-center`}
            >
              <File className={`${viewMode === 'grid' ? 'w-5 h-5' : 'w-4 h-4'} text-white`} />
            </div>

            <div className="flex-1">
              <h3 className={`font-medium text-gray-800 dark:text-white truncate ${viewMode === 'grid' ? 'mb-1' : ''}`} title={file.name}>
                {file.name}
              </h3>
              {viewMode === 'list' && (
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-4">
                  <span>{file.size}</span>
                  <span>•</span>
                  <span>{file.uploadDate}</span>
                </div>
              )}
            </div>

            {/* Favori yıldız butonu sağ alt köşede */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(file.id);
              }}
              className={`absolute bottom-2 right-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${file.favorite ? 'text-yellow-400' : 'text-gray-400'}`}
              title={file.favorite ? 'Favoriden kaldır' : 'Favorilere ekle'}
            >
              <Star className="w-5 h-5" />
            </button>

            {/* Üç nokta menü */}
            <FileMenu
              file={file}
              selectedCategory={selectedCategory}
              moveToTrash={moveToTrash}
              restoreFromTrash={restoreFromTrash}
              permanentlyDelete={permanentlyDelete}
              toggleFavorite={toggleFavorite}
            />
          </div>
        ))}
      </div>
    );
  };

  // Üç nokta menü componenti
  const FileMenu: React.FC<{
    file: UploadedFile;
    selectedCategory: string | null;
    moveToTrash: (id: number) => void;
    restoreFromTrash: (id: number) => void;
    permanentlyDelete: (id: number) => void;
    toggleFavorite: (id: number) => void;
  }> = ({ file, selectedCategory, moveToTrash, restoreFromTrash, permanentlyDelete, toggleFavorite }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="absolute top-2 right-2">
        <button
          onClick={e => {
            e.stopPropagation();
            setOpen(!open);
          }}
          className="p-1 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
          title="İşlemler"
        >
          <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        {open && (
          <div
            onClick={e => e.stopPropagation()}
            className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10"
          >
            <button
              onClick={() => { toggleFavorite(file.id); setOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2"
            >
              <Star className={`w-4 h-4 ${file.favorite ? 'fill-current text-yellow-500' : ''}`} />
              <span>{file.favorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
            </button>

            {selectedCategory !== 'trash' ? (
              <button
                onClick={() => { moveToTrash(file.id); setOpen(false); }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Çöp Kutusuna Taşı</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => { restoreFromTrash(file.id); setOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center space-x-2"
                >
                  <Share className="w-4 h-4" />
                  <span>Geri Yükle</span>
                </button>
                <button
                  onClick={() => { permanentlyDelete(file.id); setOpen(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Kalıcı Sil</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // Profil modal
  const ProfileModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Profil Bilgileri</h2>
          <button
            onClick={() => setShowProfile(false)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">{user.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={() => {
              setShowProfile(false);
              onLogout();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen flex bg-gray-50 dark:bg-gray-900`}>

      {/* Sidebar */}
      <Sidebar
        onFolderSelect={setSelectedCategory}
        onNavigate={setSelectedCategory}
      />

      {/* Main Content */}
      <div
        className="flex-1 flex flex-col"
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Dosya Yöneticisi</h1>
          </div>

          <div className="flex items-center space-x-6">
            <button
              title="Profil"
              onClick={() => setShowProfile(true)}
              className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg"
            >
              <User className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-800 dark:text-white font-medium">{user.name}</span>
            </button>
          </div>
        </header>

        {/* File List Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <FileList files={filesToShow} />
        </main>
      </div>

      {/* Profil Modal */}
      {showProfile && <ProfileModal />}
    </div>
  );
};

export default FileManagerApp;
