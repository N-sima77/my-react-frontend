 import React from 'react';
import { FileItem } from '@/data/FileSystem';

type Props = {
  items: FileItem[];
  onFolderClick: (id: number) => void;
};

const FileList: React.FC<Props> = ({ items, onFolderClick }) => {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => item.type === 'folder' && onFolderClick(item.id)}
        >
          <span>{item.type === 'folder' ? '📁' : '📄'}</span>
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  );
};

export default FileList;