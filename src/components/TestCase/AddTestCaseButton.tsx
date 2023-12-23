import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import '../../styles/AddButton.css'

interface AddTestCaseButtonProps {
  fetchTestCase: () => void;
}

const AddTestCaseButton: React.FC<AddTestCaseButtonProps> = ({ fetchTestCase }) => {
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
        Adicionar um novo cenário de teste
      </Button>
    </div>
  );
};

export default AddTestCaseButton;
