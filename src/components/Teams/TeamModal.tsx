import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../../styles/AddModal.css';
import Toast from '../Toast';


import TeamService from '../../services/TimeService'; // Importe o serviço

interface TeamModalProps {
  open: boolean;
  onClose: () => void;
  fetchTimes: () => void; // Adicione a propriedade fetchTimes
  selectedTeam?: { id: number; name: string }; // Recebe o time selecionado para edição, se houver
}

const TeamModal: React.FC<TeamModalProps> = ({ open, onClose, fetchTimes, selectedTeam }) => {
  const [teamName, setTeamName] = useState(selectedTeam?.name || '');
  const [error, setError] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showToast, setShowToast] = useState(false); // Estado para exibir o Toast

  useEffect(() => {
    // Reseta o estado quando o modal é aberto
    if (open) {
      setTeamName(selectedTeam?.name || '');
      setError('');
      setIsButtonDisabled(selectedTeam?.name === ''); // Habilita ou desabilita o botão de acordo com a presença do nome
    }
  }, [open, selectedTeam]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTeamName(event.target.value);
    setError(''); // Limpa o erro ao digitar
    setIsButtonDisabled(event.target.value === ''); // Desabilita o botão se o campo estiver vazio
  };

  const handleTeamAction = async () => {
    try {
      if (selectedTeam) {
        // Se houver um time selecionado, trata-se de uma edição
        await TeamService.editTeam(selectedTeam.id, teamName);
        setShowToast(true)
      } else {
        // Caso contrário, é uma adição
        await TeamService.addTeam(teamName);
        setShowToast(true)
      }
      onClose(); // Feche o modal após a operação
      fetchTimes(); // Atualize os times após a adição ou edição
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
  
      {/* Renderiza o Toast fora do Modal */}
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
