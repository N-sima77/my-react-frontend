export interface FileItem {
  id: string;     
  name: string;
  type: 'folder' | 'file';
  children?: FileItem[];
}


export const initialFileSystem: FileItem[] = [
  {
    id: '1',
    name: 'Belgeler',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'CV.pdf',
        type: 'file',
      },
      {
        id: '3',
        name: 'Özgeçmiş.docx',
        type: 'file',
      },
    ],
  },
  {
    id: '4',
    name: 'Resimler',
    type: 'folder',
    children: [],
  },
  {
    id: '5',
    name: 'notlar.txt',
    type: 'file',
  },
];
export const getFileSystem = (): FileItem[] => {
  // Burada API çağrısı yaparak dosya sistemini alabilirsiniz
  return initialFileSystem;
};
