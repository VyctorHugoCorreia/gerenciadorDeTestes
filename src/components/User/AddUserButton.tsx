import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import '../../styles/AddButton.css';
import UserModal from './UserModal';

interface AddUserButtonProps {
  fetchUsers: () => void;
}

const AddUserButton: React.FC<AddUserButtonProps> = ({ fetchUsers }) => {
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
        Adicionar um novo usuário
      </Button>
      <UserModal open={openModal} onClose={handleModalClose} fetchUser={fetchUsers} />
    </div>
  );
};

export default AddUserButton;
