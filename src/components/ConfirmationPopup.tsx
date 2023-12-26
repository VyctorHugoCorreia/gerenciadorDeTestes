import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const ConfirmationPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [dynamicRoute, setDynamicRoute] = useState('');
  const navigate = useNavigate();

  const handleLeave = (dynamicRoute: string) => {
    setDynamicRoute(dynamicRoute);
    setOpen(true);
  };

  const handleConfirmLeave = () => {
    setOpen(false);
    navigate(`/${dynamicRoute}`);
  };

  const handleCancelLeave = () => {
    setOpen(false);
  };

  return (
    <div>
      <button onClick={() => handleLeave('cenarios-de-teste')}>
        Sair para Cenários de Teste
      </button>
      <button onClick={() => handleLeave('outra-rota')}>
        Sair para Outra Rota
      </button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirmar Saída</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja sair? As alterações não salvas serão perdidas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLeave}>Cancelar</Button>
          <Button onClick={handleConfirmLeave}>Sair</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConfirmationPopup;
