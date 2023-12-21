import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import '../../styles/AddButton.css';
import FeatureModal from './TestPlanModal';

interface AddFeatureButtonProps {
  fetchTestPlan: () => void;
}

const AddTestPlanButton: React.FC<AddFeatureButtonProps> = ({ fetchTestPlan }) => {
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
        Adicionar um novo plano de teste
      </Button>
      <FeatureModal open={openModal} onClose={handleModalClose} fetchTestPlan={fetchTestPlan} />
    </div>
  );
};

export default AddTestPlanButton;
