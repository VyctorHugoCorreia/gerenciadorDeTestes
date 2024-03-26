import React, { useState, MouseEvent } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import TestService from '../../services/TestCaseService';
import ExecuteTestCaseModal from './ExecuteTestCaseModal'
import CloneScenarioModal from './CloneScenarioModal';

interface OpcoesMenuProps {
  idCenario: string;
  fetchTestCases: () => void;
}

const OpcoesMenu: React.FC<OpcoesMenuProps> = ({ idCenario, fetchTestCases }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [showCloneModal, setShowCloneModal] = useState(false);

  const handleExecute = () => {
    setShowExecuteModal(true);
  };

  const handleCloseModal = () => {
    setShowExecuteModal(false);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-test-case/${id}`);
    handleClose();
  };

  const handleClone = () => {
    setShowCloneModal(true);
    handleClose();
  };

  const handleCloneModalClose = () => {
    setShowCloneModal(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await TestService.deleteTestCase(id);
      fetchTestCases();
      setShowToast(true);
    } catch (error) {
      console.error(error);
      setError(`${error}`);
      setErrorPopupOpen(true);
    }
    handleClose();
  };

  const handleDetails = (id: number) => {
    navigate(`/details-test-case/${id}`);
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="Opções"
        aria-controls="menu-options"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="menu-options"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
           <MenuItem onClick={handleExecute}>Executar</MenuItem>
        <MenuItem onClick={() => handleDetails(Number(idCenario))}>Detalhes</MenuItem>
        <MenuItem onClick={handleClone}>Clonar Cenário</MenuItem>
        <MenuItem onClick={() => handleEdit(Number(idCenario))}>Editar</MenuItem>
        <MenuItem onClick={() => handleDelete(Number(idCenario))}>Excluir</MenuItem>
      </Menu>

      <ExecuteTestCaseModal
        open={showExecuteModal}
        onClose={handleCloseModal}
        idCenario ={Number(idCenario)}
        fetchTestCases={fetchTestCases}
      />

<CloneScenarioModal
        open={showCloneModal}
        onClose={handleCloneModalClose}
        idCenario ={Number(idCenario)}
      />
    </div>
  );
};

export default OpcoesMenu;
