import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import '../../styles/AddButton.css';
import FeatureModal from './TestSuiteModal';

interface AddTestSuiteProps {
  fetchTestSuite: () => void;
}

const AddProductButton: React.FC<AddTestSuiteProps> = ({ fetchTestSuite }) => {
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
        Adicionar uma nova suite de testes
      </Button>
      <FeatureModal open={openModal} onClose={handleModalClose} fetchTestSuite={fetchTestSuite} />
    </div>
  );
};

export default AddProductButton;
