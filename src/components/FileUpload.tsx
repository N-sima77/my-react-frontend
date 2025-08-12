import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

const FileUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filtered = acceptedFiles.filter(file =>
      ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type)
    );

    const newFiles = filtered.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': [],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': []
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-6 transition-all text-center cursor-pointer bg-white
        ${isDragActive ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-blue-400'}
      `}
    >
      <input {...getInputProps()} />
      <p className="text-sm font-medium">
        {isDragActive
          ? 'Dosyayı bırakabilirsiniz...'
          : 'Excel veya PDF dosyasını sürükleyin ya da tıklayın'}
      </p>

      {files.length > 0 && (
        <div className="mt-5 text-left">
          <h3 className="font-semibold mb-2">Yüklenen Dosyalar:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center space-x-2 border rounded p-2 bg-gray-50">
                <span>📄</span>
                <span>{file.name}</span>
                <span className="ml-auto text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
