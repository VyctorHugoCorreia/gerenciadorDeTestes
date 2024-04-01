import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../../styles/AddModal.css';
import Toast from '../Toast';


import TeamService from '../../services/TeamService'; 

interface TeamModalProps {
  open: boolean;
  onClose: () => void;
  fetchTeams: () => void; 
  selectedTeam?: { idTeam: number; nameTeam: string }; 
}

const TeamModal: React.FC<TeamModalProps> = ({ open, onClose, fetchTeams, selectedTeam }) => {
  const [nameTeam, setNameTeam] = useState(selectedTeam?.nameTeam || '');
  const [error, setError] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showToast, setShowToast] = useState(false); 

  useEffect(() => {
 
    if (open) {
      setNameTeam(selectedTeam?.nameTeam || '');
      setError('');
      setIsButtonDisabled(selectedTeam?.nameTeam === undefined );
      console.log(selectedTeam?.nameTeam)
    }
  }, [open, selectedTeam]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameTeam(event.target.value);
    setError(''); 
    setIsButtonDisabled(event.target.value === '');
  };

  const handleTeamAction = async () => {
    try {
      if (selectedTeam) {
        await TeamService.editTeam(selectedTeam.idTeam, nameTeam);
        setShowToast(true)
      } else {
        await TeamService.addTeam(nameTeam);
        setShowToast(true)
      }
      onClose(); 
      fetchTeams();
    } catch (err) {
      setError(`${err}`);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="team-modal-title"
        aria-describedby="team-modal-description"
      >
        <div className="team-modal">
          <h2 id="team-modal-title">{selectedTeam ? 'Editar time' : 'Adicionar novo time'}</h2>
          <TextField
            className="team-modal-input"
            id="team-name"
            label="Preencha o nome do time"
            variant="outlined"
            value={nameTeam}
            onChange={handleInputChange}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button
            className="team-modal-button"
            variant="contained"
            color="primary"
            onClick={handleTeamAction}
            disabled={isButtonDisabled}
          >
            {selectedTeam ? 'Salvar' : 'Cadastrar'}
          </Button>
        </div>
      </Modal>
  
      {showToast && (
        <div>
          <Toast
            message="Operação realizada com sucesso!"
            showToast={showToast}
            setShowToast={setShowToast}
          />
        </div>
      )}
    </>
  );
  
};

export default TeamModal;
