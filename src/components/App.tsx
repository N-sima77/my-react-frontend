import React, { useState, useEffect } from 'react';
import FileItem from './FileItem'; 
import {  
  Search, Bell, Settings, Folder, File, Upload, Grid, List, Filter, 
  MoreVertical, Home, Star, Share, Trash2, HardDrive, Menu, X, Mail, Phone, Download,RotateCcw,
  Edit,MapPin, Moon, Sun, Eye,Clock
} from 'lucide-react';
import { User } from 'lucide-react';

// Türler
export interface UploadedFile {
  id: number;
  name: string;
  type: 'pdf' | 'excel' | 'image' | 'document'| 'text';
  size: string;
  uploadDate: string;
  category: 'Belgeler' | 'Tablolar' | 'Resimler' | 'Diğer';
  favorite?: boolean;
  deleted?: boolean;
  url: string;
  content?: string;
  originalFile?: File;
}

interface User {
  name: string;
  email: string;
}

// Recent file için yeni interface (UploadedFile'ı genişletir)
interface RecentFile extends UploadedFile {
  lastOpened: Date;
}

// cn utility function
const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

// Koyu mod hook'u
function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return [isDarkMode, setIsDarkMode] as const;
}



// Login Component
  const Login: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      onLogin({ name, email });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Dosya Yöneticisi</h1>
          <p className="text-gray-600 dark:text-gray-400">Giriş yapın</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">İsim</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Adınızı girin"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="email@example.com"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

// FileManagerApp Component
  const FileManagerApp: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([]);
  const [isDarkMode, setIsDarkMode] = useDarkMode();
   

  // Dosyalar
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // Kategori seçimi
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Belgeler' | 'Tablolar' | 'Resimler' | 'Diğer' | 'Favoriler' | 'CopKutusu'>('All');
  
  // Sidebar aç/kapa
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Görünüm modu
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Profil modal
  const [isProfileOpen, setProfileOpen] = useState(false);



// Resim modal state'i
const [selectedImage, setSelectedImage] = useState<UploadedFile | null>(null);
// Component'inizin return kısmına ekleyin
const ImageModal = () => {
  if (!selectedImage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-4xl max-h-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {selectedImage.name}
          </h3>
          <button
            onClick={() => setSelectedImage(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <img 
          src={selectedImage.url} 
          alt={selectedImage.name} 
          className="max-w-full max-h-96 rounded"
        />
      </div>
    </div>
  );
};



// Dosya indirme
  const downloadFile = (file: UploadedFile) => {
    if (!file.url) return;
    
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const openImageModal = (file: UploadedFile) => {
  setSelectedImage(file);
};
// Dosya kartı component'i (grid view için)
const FileCard = ({ 
  file, 
  onFileOpen 
}: { 
  file: UploadedFile;
  onFileOpen: (file: UploadedFile) => void;
}) => (
  <div
    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow hover:shadow-md transition-shadow cursor-pointer"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('FileCard tıklandı:', file.name);
      alert('FileCard tıklandı!');
      onFileOpen(file);
    }}
    onDoubleClick={() => onFileOpen(file)}
  >
    <div className="flex items-center space-x-3">
      {/* Dosya ikonu */}
      <div className="flex-shrink-0">
        {file.type === 'pdf' && <File className="w-8 h-8 text-red-500" />}
        {file.type === 'excel' && <File className="w-8 h-8 text-green-500" />}
        {file.type === 'image' && <File className="w-8 h-8 text-blue-500" />}
        {file.type === 'document' && <File className="w-8 h-8 text-gray-500" />}
      </div>
      
      {/* Dosya bilgileri */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {file.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {file.size} • {file.uploadDate}
        </p>
      </div>
    </div>
  </div>
);
 
  // Drag & Drop state
  const [dragActive, setDragActive] = useState(false);
  


  // Dosya sayısı kategoriye göre
  const getFileCountByCategory = (category: UploadedFile['category'] | 'Favoriler' | 'CopKutusu') => {
    if (category === 'Favoriler') return uploadedFiles.filter(f => f.favorite && !f.deleted).length;
    if (category === 'CopKutusu') return uploadedFiles.filter(f => f.deleted).length;
    return uploadedFiles.filter(f => f.category === category && !f.deleted).length;
  };

  //Navigasyon fonksiyonu
  const handleNavigate = (section: 'favorites' | 'trash' | 'recent') => {
  if (section === 'recent') {
    // Recent files sayfasını göster
    console.log('Recent files:', recentFiles);
  } else if (section === 'favorites') {
    // Favoriler sayfasını göster
  } else if (section === 'trash') {
    // Çöp kutusu sayfasını göster
  }
};
  // Kategoriler
  const quickFolders = [
    { id: 1, name: 'Belgeler', items: getFileCountByCategory('Belgeler'), color: 'bg-blue-500', key: 'Belgeler' },
    { id: 2, name: 'Tablolar', items: getFileCountByCategory('Tablolar'), color: 'bg-green-500', key: 'Tablolar' },
    { id: 3, name: 'Resimler', items: getFileCountByCategory('Resimler'), color: 'bg-purple-500', key: 'Resimler' },
    { id: 4, name: 'Diğer', items: getFileCountByCategory('Diğer'), color: 'bg-orange-500', key: 'Diğer' },
  ];


  // Dosya tipi belirleme
const getFileType = (fileName: string): 'pdf' | 'excel' | 'image' | 'document' => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext || '')) return 'image';
  if (['pdf'].includes(ext || '')) return 'pdf';
  if (['xlsx', 'xls', 'csv'].includes(ext || '')) return 'excel';
  return 'document';
};

// Kategori belirleme
const getCategoryByType = (type: string): 'Belgeler' | 'Tablolar' | 'Resimler' | 'Diğer' => {
  switch (type) {
    case 'pdf':
    case 'document':
      return 'Belgeler';
    case 'excel':
      return 'Tablolar';
    case 'image':
      return 'Resimler';
    default:
      return 'Diğer';
  }
};

// Dosya boyutunu formatla
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const handleFileUpload = (fileList: FileList | null) => {
  if (!fileList) return;
  
  Array.from(fileList).forEach((file, index) => {
    const newFile: UploadedFile = {
      id: Date.now() + index,
      name: file.name,
      type: getFileType(file.name),
      size: formatFileSize(file.size),
      uploadDate: new Date().toLocaleDateString('tr-TR'),
      category: getCategoryByType(getFileType(file.name)),
      url: URL.createObjectURL(file),
      originalFile: file // ⭐ Orijinal file objesini saklayın
    };
    
    setUploadedFiles(prev => [...prev, newFile]);
  });
};

const [selectedFileContent, setSelectedFileContent] = useState<string>('');
const [isFileModalOpen, setIsFileModalOpen] = useState<boolean>(false);
  // Dosya açma
 const handleFileOpen = (file: UploadedFile) => {
  console.log('handleFileOpen ÇALIŞTI!');
  alert(`Dosya açılıyor: ${file.name}`);
  
  // Recent files'a ekle
  const newRecentFile: RecentFile = {
    ...file,
    lastOpened: new Date()
  };
  
  setRecentFiles(prev => {
    const updated = prev.filter(f => f.id !== file.id);
    return [newRecentFile, ...updated].slice(0, 10);
  });
  
  console.log('URL açılıyor:', file.url);
  window.open(file.url, '_blank');
};
  // Drag & Drop eventleri
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
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

  // Dosyaları filtrele
  const filteredFiles = uploadedFiles.filter(file => {
    if (selectedCategory === 'All') return !file.deleted;
    if (selectedCategory === 'Favoriler') return file.favorite && !file.deleted;
    if (selectedCategory === 'CopKutusu') return file.deleted;
    return file.category === selectedCategory && !file.deleted;
  });

  // Dosyayı favorileme toggle
  const toggleFavorite = (id: number) => {
    setUploadedFiles(prev =>
      prev.map(file => (file.id === id ? { ...file, favorite: !file.favorite } : file))
    );
  };

  // Dosyayı çöpe taşıma
  const moveToTrash = (id: number) => {
    setUploadedFiles(prev =>
      prev.map(file => (file.id === id ? { ...file, deleted: true, favorite: false } : file))
    );
  };

  // Çöp kutusundan geri alma
  const restoreFromTrash = (id: number) => {
    setUploadedFiles(prev =>
      prev.map(file => (file.id === id ? { ...file, deleted: false } : file))
    );
  };

  // Kalıcı silme
  const permanentlyDelete = (id: number) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  // Sidebar navigasyon öğeleri
  const sidebarItems = [
    { key: 'All', label: 'Tüm Dosyalar', icon: Folder },
    { key: 'Favoriler', label: 'Favoriler', icon: Star },
    { key: 'CopKutusu', label: 'Çöp Kutusu', icon: Trash2 },
  ];

  // Kategoriye tıklayınca seçimi değiştir
  const handleCategoryClick = (key: typeof selectedCategory) => {
    setSelectedCategory(key);
  };

  // Dosya item componenti
    const FileItem: React.FC<{ file: UploadedFile }> = ({ file }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div
        className={cn(
          'group relative',
          viewMode === 'grid'
            ? 'bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer'
            : 'bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700'
        )}
      >
        <div
          className={`${
            file.type === 'pdf'
              ? 'bg-red-500'
              : file.type === 'excel'
              ? 'bg-green-500'
              : file.type === 'image'
              ? 'bg-purple-500'
              : 'bg-blue-500'
          } ${viewMode === 'grid' ? 'w-10 h-10' : 'w-8 h-8'} rounded-lg flex items-center justify-center`}
        >
          <File className={`${viewMode === 'grid' ? 'w-5 h-5' : 'w-4 h-4'} text-white`} />
        </div>

        <div className="flex-1">
          <h3
            className={cn(
              'font-medium text-gray-800 dark:text-white truncate',
              viewMode === 'grid' ? 'mb-1' : ''
            )}
            title={file.name}
          >
            {file.name}
          </h3>
          <div
            className={cn(
              'text-sm text-gray-500 dark:text-gray-400',
              viewMode === 'list' ? 'flex items-center space-x-4' : ''
            )}
          >
            <span>{file.size}</span>
            {viewMode === 'list' && <span>•</span>}
            <span>{file.uploadDate}</span>
          </div>
        </div>

        {/* Favorileme ikonu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(file.id);
          }}
          className={cn(
            'absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full',
            file.favorite 
              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-500' 
              : 'bg-white dark:bg-gray-700 text-gray-400 hover:text-yellow-500'
          )}
          title={file.favorite ? 'Favoriden Kaldır' : 'Favori Yap'}
        >
          <Star className={`w-4 h-4 ${file.favorite ? 'fill-current' : ''}`} />
        </button>

        {/* Üç nokta menü */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(file.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2"
              >
                <Star className={`w-4 h-4 ${file.favorite ? 'fill-current text-yellow-500' : ''}`} />
                <span>{file.favorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
              </button>
              
              {selectedCategory !== 'CopKutusu' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveToTrash(file.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Çöp Kutusuna Taşı</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      restoreFromTrash(file.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center space-x-2"
                  >
                    <Share className="w-4 h-4" />
                    <span>Geri Yükle</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      permanentlyDelete(file.id);
                      setShowMenu(false);
                    }}
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
      </div>
    );
  };

  // Dosyayı yeniden adlandırma
const renameFile = (id: number, newName: string) => {
  setUploadedFiles(prev =>
    prev.map(file => 
      file.id === id 
        ? { ...file, name: newName }
        : file
    )
  );
};

// Dosya listesi componenti
const FileList: React.FC<{ files: UploadedFile[] }> = ({ files }) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Menüyü kapatmak için dışarı tıklama
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg mb-2">Henüz dosya yok</p>
        <p className="text-sm">Dosya yüklemek için yukarıdaki butonu kullanın</p>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-2'
      }
    >
      {files.map(file => (
        <div
          key={file.id}
          onClick={() => {
            console.log('Dosya tıklandı:', file.name);
            handleFileOpen(file);
          }}
          className={`group relative transition-all cursor-pointer ${
            viewMode === 'grid'
              ? 'bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600'
              : 'bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {/* Dosya ikonu */}
          <div
            className={`${
              file.type === 'pdf'
                ? 'bg-red-500'
                : file.type === 'excel'
                ? 'bg-green-500'
                : file.type === 'image'
                ? 'bg-purple-500'
                : file.type === 'document'
                ? 'bg-blue-500'
                : 'bg-gray-500'
            } ${
              viewMode === 'grid' ? 'w-12 h-12 mb-3' : 'w-10 h-10'
            } rounded-lg flex items-center justify-center shadow-sm`}
          >
            <File className={`${viewMode === 'grid' ? 'w-6 h-6' : 'w-5 h-5'} text-white`} />
          </div>

          {/* Dosya bilgileri */}
          <div className={`flex-1 ${viewMode === 'grid' ? '' : 'min-w-0'}`}>
            <h3
              className={`font-medium text-gray-900 dark:text-white truncate ${
                viewMode === 'grid' ? 'text-sm mb-1' : 'text-sm'
              }`}
              title={file.name}
            >
              {file.name}
            </h3>
            <div
              className={`text-xs text-gray-500 dark:text-gray-400 ${
                viewMode === 'list' ? 'flex items-center space-x-2' : 'space-y-1'
              }`}
            >
              <span className="capitalize font-medium">{file.type}</span>
              {viewMode === 'list' && <span>•</span>}
              <span>{file.size}</span>
              {viewMode === 'list' && <span>•</span>}
              <span>{file.uploadDate}</span>
            </div>
          </div>

          {/* Favori göstergesi - sadece favoriyse görünür */}
          {file.favorite && (
            <div className={`absolute ${viewMode === 'grid' ? 'top-2 left-2' : 'right-16'}`}>
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
            </div>
          )}

          {/* Hover butonları */}
          <div className={`absolute ${viewMode === 'grid' ? 'bottom-2 right-2' : 'right-12'} opacity-0 group-hover:opacity-100 transition-opacity`}>
            {/* Hızlı favori butonu */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(file.id);
              }}
              className={`p-1 rounded-full shadow-sm transition-colors mr-1 ${
                file.favorite
                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 hover:bg-yellow-200'
                  : 'bg-white dark:bg-gray-700 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
              title={file.favorite ? 'Favoriden Kaldır' : 'Favorilere Ekle'}
            >
              <Star className={`w-4 h-4 ${file.favorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Üç nokta menü */}
          <div className={`absolute ${viewMode === 'grid' ? 'top-2 right-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === file.id ? null : file.id);
              }}
              className="p-1 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
            >
              <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            
            {/* Dropdown menü */}
            {openMenuId === file.id && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 py-1">
                {/* Favorilere ekle/çıkar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(file.id);
                    setOpenMenuId(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <Star className={`w-4 h-4 ${file.favorite ? 'fill-current text-yellow-500' : 'text-gray-400'}`} />
                  <span>{file.favorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}</span>
                </button>

                {/* Ayırıcı çizgi */}
                <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

                {/* Çöp kutusu dışındaysa */}
                {selectedCategory !== 'CopKutusu' ? (
                  <>
                    {/* İndir */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // İndirme fonksiyonunuz buraya
                        console.log('İndiriliyor:', file.name);
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-400" />
                      <span>İndir</span>
                    </button>

                    {/* Yeniden adlandır */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Yeniden adlandırma fonksiyonunuz buraya
                        const newName = prompt('Yeni dosya adı:', file.name);
                          if (newName && newName.trim() && newName !== file.name) {
                            renameFile(file.id, newName.trim());
                             } 
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-400" />
                      <span>Yeniden Adlandır</span>
                    </button>

                    {/* Ayırıcı çizgi */}
                    <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>

                    {/* Çöp kutusuna taşı */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveToTrash(file.id);
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Çöp Kutusuna Taşı</span>
                    </button>
                  </>
                ) : (
                  /* Çöp kutusundaysa */
                  <>
                    {/* Geri yükle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        restoreFromTrash(file.id);
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center space-x-3 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Geri Yükle</span>
                    </button>

                    {/* Kalıcı sil */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`${file.name} dosyasını kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
                          permanentlyDelete(file.id);
                        }
                        setOpenMenuId(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Kalıcı Olarak Sil</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Seçili göstergesi (opsiyonel) */}
          {/* {isSelected && (
            <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded-lg pointer-events-none"></div>
          )} */}
        </div>
      ))}
    </div>
  );
};

  // Profil modal componenti
  const ProfileModal: React.FC<{
    open: boolean;
    onClose: () => void;
    user: User;
    onLogout: () => void;
  }> = ({ open, onClose, user, onLogout }) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-[320px] relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Profil</h2>

          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white">{user.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p><strong>Toplam Dosya:</strong> {uploadedFiles.filter(f => !f.deleted).length}</p>
              <p><strong>Favori Dosya:</strong> {uploadedFiles.filter(f => f.favorite && !f.deleted).length}</p>
              <p><strong>Çöp Kutusunda:</strong> {uploadedFiles.filter(f => f.deleted).length}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="mt-6 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    );
  };

  // Sidebar componenti
  const Sidebar = () => (
    <div
      className={cn(
        sidebarOpen ? 'w-64' : 'w-16',
        'bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-bold text-gray-800 dark:text-white">Dosya Yöneticisi</span>
          )}
        </div>
      </div>

      {/* Navigasyon */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Ana Menü */}
        {sidebarItems.map(item => (
          <button
            key={item.key}
            onClick={() => handleCategoryClick(item.key as any)}
            className={cn(
              'flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left transition',
              selectedCategory === item.key
                ? 'bg-purple-600 text-white'
                : 'text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            <item.icon className="w-5 h-5" />
            {sidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
        {sidebarOpen && recentFiles.length > 0 && (
  <>
    <div className="px-4 py-2">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Clock className="w-4 h-4" />
        <span>En Son Gezdiğim</span>
      </div>
    </div>
    <div className="space-y-1 mb-4">
      {recentFiles.slice(0, 5).map((file) => (
        <button
          key={file.id}
          onClick={() => handleFileOpen(file)}
          className="flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left transition text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <div className="text-base">
            {file.type === 'pdf' && '📄'}
            {file.type === 'excel' && '📊'}
            {file.type === 'image' && '🖼️'}
            {file.type === 'document' && '📝'}
          </div>
          <span className="truncate flex-1">{file.name}</span>
        </button>
      ))}
    </div>
  </>
)}

        {/* Ayrıcı */}
        <hr className="border-gray-200 dark:border-gray-700 my-4" />

        {/* QuickFolders */}
        {quickFolders.map(folder => (
          <button
            key={folder.id}
            onClick={() => setSelectedCategory(folder.key as any)}
            className={cn(
              'flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer w-full text-left transition',
              selectedCategory === folder.key
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 ${folder.color} rounded-lg flex items-center justify-center`}>
                <Folder className="w-4 h-4 text-white" />
              </div>
              {sidebarOpen && <span>{folder.name}</span>}
            </div>
            {sidebarOpen && (
              <span className="text-sm font-medium">{folder.items === 0 ? '0' : folder.items}</span>
            )}
          </button>
        ))}
      </nav>

      {/* User Info */}
      {sidebarOpen && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Header componenti
  const Header = () => (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label="Menü Aç/Kapa"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Arama */}
        <div className="relative text-gray-600 dark:text-gray-300">
          <input
            type="search"
            name="search"
            placeholder="Dosya ara..."
            className="border border-gray-300 dark:border-gray-700 rounded-md py-1 pl-8 pr-3 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-900 dark:text-white"
          />
          <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* Sağ menü */}
      <div className="flex items-center space-x-6">
        {/* Koyu mod toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          title="Koyu Mod"
          aria-label="Koyu Mod Aç/Kapa"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
        </button>

        {/* Bildirim */}
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition" aria-label="Bildirimler">
          <Bell className="w-5 h-5" />
        </button>

        {/* Ayarlar */}
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition" aria-label="Ayarlar">
          <Settings className="w-5 h-5" />
        </button>

        {/* Profil */}
        <button
          onClick={() => setProfileOpen(true)}
          className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          aria-label="Profil"
        >
          <User className="w-6 h-6" />
          <span className="hidden sm:inline text-gray-700 dark:text-white font-semibold">{user.name}</span>
        </button>
      </div>
    </header>
  );

  // Dosya yükleme inputu referansı
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Dosya yükleme butonuna tıklama
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Dosyalarım bölümü için kategorilere göre gruplandırma
  const groupFilesByCategory = (files: UploadedFile[]) => {
    return files.reduce((acc, file) => {
      if (!acc[file.category]) {
        acc[file.category] = [];
      }
      acc[file.category].push(file);
      return acc;
    }, {} as Record<string, UploadedFile[]>);
  };

  return (
    <div className={cn('flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white')}>
      {/* Sidebar */}
     <Sidebar/>

      {/* Ana içerik */}
      <div className="flex flex-col flex-1">
        <Header />

        {/* Ana İçerik */}
        <main
          className="flex-1 p-6 overflow-auto"
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {/* Content Area */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                {selectedCategory === 'All' && 'Tüm Dosyalar'}
                {selectedCategory === 'Favoriler' && 'Favoriler'}
                {selectedCategory === 'CopKutusu' && 'Çöp Kutusu'}
                {selectedCategory !== 'All' && selectedCategory !== 'Favoriler' && selectedCategory !== 'CopKutusu' && selectedCategory}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Dosya yükleme butonu */}
          <div className="mb-6">
            <button
              onClick={triggerFileInput}
              className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Dosya Yükle</span>
            </button>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Content based on selected category */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <FileList files={filteredFiles} />
          </div>

          {/* Drag & Drop overlay */}
          {dragActive && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-white text-xl font-semibold border-4 border-dashed border-white rounded-xl p-10">
                <Upload className="w-12 h-12 mx-auto mb-4" />
                Dosyaları buraya bırakın
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Profil modal */}
      <ProfileModal
        open={isProfileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        onLogout={onLogout}
      />
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  

  // JSX dışında kontrol ediyoruz
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <FileManagerApp user={user} onLogout={handleLogout} />
  );


};
  
export default App;