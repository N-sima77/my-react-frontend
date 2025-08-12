import React from 'react';
import { FileItem } from '@/data/FileSystem';

type Props = {
  items: FileItem[];
  onFolderClick?: (item: FileItem) => void;
};

const FileExplorer: React.FC<Props> = ({ items, onFolderClick }) => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} style={{ marginLeft: 16 }}>
          {item.type === 'folder' ? (
            <span
              style={{ fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => onFolderClick?.(item)}
            >
              📁 {item.name}
            </span>
          ) : (
            <span>📄 {item.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
};

export default FileExplorer;
