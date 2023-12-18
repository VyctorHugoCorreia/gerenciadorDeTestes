// AddProductButton.tsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import '../../styles/Teams/AddTeamButton.css';
import ProductModal from './ProductModal';

interface AddProductButtonProps {
  fetchProducts: () => void;
}

const AddProductButton: React.FC<AddProductButtonProps> = ({ fetchProducts }) => {
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
        Adicionar um novo produto
      </Button>
      <ProductModal open={openModal} onClose={handleModalClose} fetchProducts={fetchProducts} />
    </div>
  );
};

export default AddProductButton;
