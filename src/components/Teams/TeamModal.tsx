import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../../styles/AddModal.css';
import Toast from '../Toast';


import TeamService from '../../services/TimeService'; 

interface TeamModalProps {
  open: boolean;
  onClose: () => void;
  fetchTimes: () => void; 
  selectedTeam?: { id: number; name: string }; 
}

const TeamModal: React.FC<TeamModalProps> = ({ open, onClose, fetchTimes, selectedTeam }) => {
  const [teamName, setTeamName] = useState(selectedTeam?.name || '');
  const [error, setError] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showToast, setShowToast] = useState(false); 

  useEffect(() => {
 
    if (open) {
      setTeamName(selectedTeam?.name || '');
      setError('');
      setIsButtonDisabled(selectedTeam?.name === undefined );
      console.log(selectedTeam?.name)
    }
  }, [open, selectedTeam]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(event.target.value);
    setError(''); 
    setIsButtonDisabled(event.target.value === '');
  };

  const handleTeamAction = async () => {
    try {
      if (selectedTeam) {
        await TeamService.editTeam(selectedTeam.id, teamName);
        setShowToast(true)
      } else {
        await TeamService.addTeam(teamName);
        setShowToast(true)
      }
      onClose(); 
      fetchTimes();
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
            value={teamName}
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
