import React, { useState } from 'react';
import { Button, colors } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


const FileUpload: React.FC<{ onFileChange: (file: File | null) => void }> = ({ onFileChange }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onFileChange(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    // Reset input value to allow selecting the same file again
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    onFileChange(null);
  };

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.txt"
      />
      <label htmlFor="fileInput">
        <Button component="span" variant="outlined">
          {selectedFile ? selectedFile.name : 'Selecionar arquivo'}
        </Button>
      </label>
      {selectedFile && (
        <Button  onClick={handleRemoveFile}>
       <DeleteIcon style={{ color: 'red' }}></DeleteIcon>
        </Button>
      )}
    </div>
  );
};

export default FileUpload;
