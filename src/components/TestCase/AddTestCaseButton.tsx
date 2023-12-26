import React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import '../../styles/AddButton.css';
import { useNavigate } from 'react-router-dom'; 

const AddTestCaseButton: React.FC = () => {
  const navigate = useNavigate(); 

  const handleClick = () => {
    navigate('/criar-caso-de-teste'); 
  };

  return (
    <div className="add-team-button-container">
      <Button
        className="add-team-button"
        startIcon={<Avatar sx={{ bgcolor: '#1082BE' }}><AddIcon sx={{ color: '#fff' }} /></Avatar>}
        variant="contained"
        onClick={handleClick} 
      >
        Adicionar um novo cenário de teste
      </Button>
    </div>
  );
};

export default AddTestCaseButton;
