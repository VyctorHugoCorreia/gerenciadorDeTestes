import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TeamsDropDown from '../Dropdown/TeamsDropDown';
import ProductDropDown from '../Dropdown/ProductDropDown';
import TextField from '@mui/material/TextField';
import ProductService from '../../services/ProductService';
import TestPlanService from '../../services/TestPlanService';
import Toast from '../Toast';

interface Product {
  idProduct: number;
  descProduct: string;
  idTeam: {
    idTeam: number;
    nameTeam: string;
  };
}

interface TestPlanModalProps {
  open: boolean;
  onClose: () => void;
  fetchTestPlan: () => void;
  selectedTestPlan?: {
    idTestPlan: number;
    descTestPlan: string;
    idProduct: {
      idProduct: number;
      descProduct: string;
      idTeam: { idTeam: number; nameTeam: string };
    };
    scenarioQuantity: number;
  } | null;
}

const TestPlanModal: React.FC<TestPlanModalProps> = ({
  open,
  onClose,
  fetchTestPlan,
  selectedTestPlan,
}) => {
  const [error, setError] = useState<string>('');
  const [TestPlanName, setTestPlanName] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<{
    idTeam: number;
    nameTeam: string;
  } | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [resetProductDropdown, setResetProductDropdown] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    if (open && selectedTestPlan) {
      setError('');
      setIsButtonDisabled(!selectedTestPlan.descTestPlan);
      setTestPlanName(selectedTestPlan.descTestPlan || '')
      setSelectedTeam((selectedTestPlan.idProduct.idTeam )|| null);
      setSelectedTeamId(selectedTestPlan.idProduct.idTeam.idTeam || null);
      setSelectedProductId(selectedTestPlan.idProduct?.idProduct);
    } else {
      setError('');
      setIsButtonDisabled(true);
      setTestPlanName('');
      setSelectedTeam(null);
      setSelectedTeamId(null);
      setSelectedProductId(null);
    }
  }, [open, selectedTestPlan]);

  useEffect(() => {
      setIsButtonDisabled(!selectedTeam || !selectedProductId || TestPlanName === '');
  }, [selectedTeam, selectedProductId, TestPlanName]);
 
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTestPlanName(event.target.value);
    setError('');
  };

  const handleSelectTeam = (team: { idTeam: number; nameTeam: string }) => {
      setError('');
      setSelectedTeam(team);
      setSelectedTeamId(team.idTeam);
      setSelectedProductId(null);
      setResetProductDropdown(false);
  };

  const handleAddTestPlan = async () => {
    try {
      if (selectedTeam && selectedProductId) {
        await TestPlanService.addTestPlan(selectedTeam.idTeam, selectedProductId, TestPlanName);
        setTestPlanName('');
        setSelectedTeam(null);
        setSelectedTeamId(null);
        setSelectedProductId(null);
        onClose();
        fetchTestPlan();
        setShowToast(true);
      } else {
        setError('Selecione um time e um produto');
      }
    } catch (err) {
      setError(`${err}`);
    }
  };

  const handleEditTestPlan = async () => {
    try {
      if (selectedTeam && selectedTestPlan && selectedProductId) {
        await TestPlanService.editTestPlan(
          selectedTestPlan.idTestPlan,
          selectedTeam.idTeam,
          selectedProductId,
          TestPlanName
        );
        setTestPlanName('');
        setSelectedTeam(null);
        setSelectedTeamId(null);
        setSelectedProductId(null);
        onClose();
        fetchTestPlan();
        setShowToast(true);
      } else {
        setError('Selecione um time');
      }
    } catch (err) {
      setError(`${err}`);
    }
  };

  const isEditing = !!selectedTestPlan;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="team-modal-title"
      aria-describedby="team-modal-description"
    >
      <div className="team-modal">
        <h2 id="team-modal-title">
          {selectedTestPlan ? 'Editar plano de testes' : 'Adicionar novo plano de teste'}
        </h2>
        <TeamsDropDown
          onSelectTeam={handleSelectTeam}
          selectedTeam={selectedTeam?.idTeam || null}
          disabled={isEditing}
        />
        <ProductDropDown
          onSelectProduct={setSelectedProductId}
          selectedTeamId={selectedTeamId}
          disabled={isEditing}
          isEditing={isEditing}
          resetDropdown={resetProductDropdown}
          selectedProductId={selectedTestPlan?.idProduct?.idProduct || null}
        />
        <TextField
          className="team-modal-input"
          id="test-plan-name"
          placeholder="Preencha o nome do plano de testes"
          value={TestPlanName}
          onChange={handleInputChange}
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button
          className="team-modal-button"
          variant="contained"
          color="primary"
          onClick={selectedTestPlan ? handleEditTestPlan : handleAddTestPlan}
          disabled={isButtonDisabled}
        >
          {selectedTestPlan ? 'Editar' : 'Cadastrar'}
        </Button>
      </div>
    </Modal>
  );
};

export default TestPlanModal;
