import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import GetAppIcon from '@mui/icons-material/GetApp';
import ScenarioEvidenceService from '../../services/ScenarioEvidenceService';
import '../../styles/EvidenceUploadModal.css';

interface Evidence {
  fileName: string;
  fileData: string;
}

interface EvidenceUploadModalProps {
  idScenario: number;
}

const EvidenceUploadModal: React.FC<EvidenceUploadModalProps> = ({ idScenario }) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<Evidence | null>(null);

  useEffect(() => {
    fetchScenarioEvidence();
  }, [idScenario]);

  const fetchScenarioEvidence = async () => {
    try {
      const evidenceList: Evidence[] = await ScenarioEvidenceService.getScenarioEvidence(idScenario.toString());
      if (evidenceList.length > 0) {
        const evidence = evidenceList[0];
        setSelectedFile(evidence);
        setFilePreview(`data:${getFileMimeType(evidence.fileName)};base64,${evidence.fileData}`);
      } else {
        setSelectedFile(null);
        setFilePreview(null);
      }
    } catch (error) {
      console.error('Erro ao buscar evidência:', error);
    }
  };

  const getFileMimeType = (fileName: string): string => {
    const extension = fileName.split('.').pop() || '';
    switch (extension.toLowerCase()) {
      case 'pdf':
        return 'application/pdf';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'mp4':
        return 'video/mp4';
      default:
        return 'application/octet-stream';
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const uploadedUrl = reader.result as string;
        setFilePreview(uploadedUrl);
        setSelectedFile({ fileName: file.name, fileData: uploadedUrl });
        saveEvidence(file);
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

  const handleDownloadFile = () => {
    if (selectedFile) {
      const blob = new Blob([selectedFile.fileData]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.fileName;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const saveEvidence = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        await ScenarioEvidenceService.addScenarioEvidence(idScenario.toString(), file.name, file);
        console.log('Evidência enviada com sucesso');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao enviar evidência:', error);
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
        disabled={!!selectedFile}
      />
      <label htmlFor="fileInput">
        <Button component="span" variant="outlined" disabled={!!selectedFile}>
          {selectedFile ? selectedFile.fileName : 'Selecionar arquivo'}
        </Button>
      </label>
      {selectedFile && (
        <>
          <Button onClick={handleDownloadFile}>
            <GetAppIcon />
          </Button>
          <Button onClick={handleRemoveFile}>
            <DeleteIcon style={{ color: 'red' }} />
          </Button>
        </>
      )}

      {filePreview && (
        <div>
          <h3>Visualização:</h3>
          {selectedFile?.fileName.toLowerCase().endsWith('.pdf') ? (
            <embed src={filePreview} type="application/pdf" width="100%" height="600px" />
          ) : selectedFile?.fileName.toLowerCase().endsWith('.mp4') ? (
            <video controls style={{ maxWidth: '100%' }}>
              <source src={filePreview} type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          ) : selectedFile?.fileName.toLowerCase().endsWith('.gif') ? (
            <img src={filePreview} alt="Preview" style={{ maxWidth: '100%' }} />
          ) : selectedFile?.fileName.toLowerCase().match(/\.(jpeg|jpg|png)$/) ? (
            <img src={filePreview} alt="Preview" style={{ maxWidth: '100%' }} />
          ) : (
            <p>Não foi possível exibir a visualização para este tipo de arquivo.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EvidenceUploadModal;
