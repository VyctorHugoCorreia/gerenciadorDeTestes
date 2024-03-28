import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import TeamModal from './TeamModal';
import '../../styles/AddButton.css'

interface AddTeamButtonProps {
  fetchTeams: () => void;
}

const AddTeamButton: React.FC<AddTeamButtonProps> = ({ fetchTeams }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  return (
    <div className="add-team-button-container">
      <Button
        className="add-team-button"
        startIcon={<Avatar sx={{ bgcolor: '#1082BE' }}><AddIcon sx={{ color: '#fff' }} /></Avatar>}
        variant="contained"
        onClick={handleModalOpen}
      >
        Adicionar um novo time
      </Button>
      <TeamModal open={openModal} onClose={handleModalClose} fetchTeams={fetchTeams} />
    </div>
  );
};

export default AddTeamButton;
