 export interface FileItem {
  id:number;     
  name: string;
  type: 'folder' | 'file';
  children?: FileItem[];
}


export const initialFileSystem: FileItem[] = [
  {
    id: 1,
    name: 'Belgelerim',
    type: 'folder',
    children: [
      {
        id: 2,
        name: 'CV.pdf',
        type: 'file',
      },
      {
        id: 3,
        name: 'Fotoğraflar',
        type: 'folder',
        children: [
          {
            id: 4,
            name: 'tatil.jpg',
            type: 'file',
          },
        ],
      },
    ],
  },
  {
    id: 5,
    name: 'README.md',
    type: 'file',
  },
];