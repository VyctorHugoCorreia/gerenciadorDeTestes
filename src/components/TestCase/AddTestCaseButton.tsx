import React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import '../../styles/AddButton.css';
import { useNavigate } from 'react-router-dom'; // Importe useNavigate

const AddTestCaseButton: React.FC = () => {
  const navigate = useNavigate(); // Obtenha a função de navegação

  const handleClick = () => {
    navigate('/criar-caso-de-teste'); // Navegue para a rota de criação de casos de teste
  };

  return (
    <div className="add-team-button-container">
      <Button
        className="add-team-button"
        startIcon={<Avatar sx={{ bgcolor: '#1082BE' }}><AddIcon sx={{ color: '#fff' }} /></Avatar>}
        variant="contained"
        onClick={handleClick} // Chame handleClick no clique do botão
      >
        Adicionar um novo cenário de teste
      </Button>
    </div>
  );
};

export default AddTestCaseButton;
