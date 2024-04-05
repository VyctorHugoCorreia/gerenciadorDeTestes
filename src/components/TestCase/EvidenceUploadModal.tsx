import { Button } from '@mui/material';
import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../styles/EvidenceUploadModal.css'

const EvidenceUploadModal: React.FC = () => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadedUrl = reader.result as string;
        setFilePreview(uploadedUrl);
        setSelectedFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className='evidence'>
      <input
        id="fileInput"
        type="file"
        style={{ display: 'none' }}
        accept="*/*"
        onChange={handleFileChange}
      />
      <label htmlFor="fileInput">
        <Button component="span" variant="outlined">
          {selectedFile ? selectedFile.name : 'Selecionar arquivo'}
        </Button>
      </label>
      {selectedFile && (
        <Button onClick={handleRemoveFile}>
          <DeleteIcon style={{ color: 'red' }} />
        </Button>
      )}

      {filePreview && (
        <div>
          <h3>Visualização:</h3>
          {selectedFile?.type?.startsWith('video/') ? (
            <video controls style={{ maxWidth: '100%' }}>
              <source src={filePreview} type={selectedFile.type} />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          ) : selectedFile?.type === 'image/gif' ? (
            <img src={filePreview} alt="gif" style={{ maxWidth: '100%' }} />
          ) : selectedFile?.type?.startsWith('image/') ? (
            <img src={filePreview} alt="image" style={{ maxWidth: '100%' }} />
          ) : selectedFile?.type === 'application/pdf' ? (
            <embed src={filePreview} type="application/pdf" width="100%" height="600px" />
          ) : (
            <p>Não foi possível ter uma visualização prévia.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EvidenceUploadModal;
