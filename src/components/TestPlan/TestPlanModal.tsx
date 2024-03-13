import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TeamsDropDown from '../Dropdown/TeamsDropDown';
import ProductDropDown from '../Dropdown/ProductDropDown';
import TextField from '@mui/material/TextField';
import ProductService from '../../services/ProductService';
import TestPlanService from '../../services/TestPlanService';
import Toast from '../Toast';

export interface Product {
  idTproduto: number;
  descProduto: string;
  idTime: {
    idTime: number;
    nomeTime: string;
  };
}

export interface Feature {
  id: number;
  name: string;
  idTime: {
    idTime: number;
    nomeTime: string;
  };
}

export interface TestPlanModalProps {
  open: boolean;
  onClose: () => void;
  fetchTestPlan: () => void;
  selectedTestPlan?: {
    id: number;
    name: string;
    idTime: { idTime: number; nomeTime: string };
    idTproduto: { idTproduto: number; descProduto: string }
    quantidadeSuites: number;
  } | null;
}

const TestPlanModal: React.FC<TestPlanModalProps> = ({
  open,
  onClose,
  fetchTestPlan,
  selectedTestPlan,
}) => {
  const [error, setError] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [TestPlanName, setTestPlanName] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<{
    idTime: number;
    nomeTime: string;
  } | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [resetProductDropdown, setResetProductDropdown] = useState(false);
  const [showToast, setShowToast] = useState(false);


  useEffect(() => {
    if (open && selectedTestPlan) {
      setError('');
      setIsButtonDisabled(!selectedTestPlan.name);
      setTestPlanName(selectedTestPlan.name || '')
      setSelectedTeam(selectedTestPlan.idTime || null);
      setSelectedTeamId(selectedTestPlan.idTime?.idTime || null);
      setSelectedProductId(selectedTestPlan.idTproduto?.idTproduto);
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
      setIsButtonDisabled(selectedTeam === null || selectedProductId === null || TestPlanName === '');
  
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTestPlanName(event.target.value);
    setError('');
  };

  const handleSelectTeam = async (team: { idTime: number; nomeTime: string } | string) => {
    if (!selectedTestPlan) {
      if (typeof team === 'string') {
        setSelectedTeam(null);
        setSelectedTeamId(null);
        setSelectedProductId(null);
        setProducts([]);
        setResetProductDropdown(true);
      } else {
        setError('');
        setSelectedTeam(team);
        setSelectedTeamId(team.idTime);
        setSelectedProductId(null);
        setResetProductDropdown(false);

        try {
          const productsData = await ProductService.getProductsByTeam(team.idTime.toString());
          setProducts(productsData);
        } catch (error) {
          console.error('Error fetching products:', error);
          setProducts([]);
        }
      }
    }
  };

  const handleAddTestPlan = async () => {
    try {
      if (selectedTeam && selectedProductId !== null) {
        await TestPlanService.addTestPlan(selectedTeam.idTime, selectedProductId, TestPlanName);
        setTestPlanName('');
        setSelectedTeam(null);
        setSelectedTeamId(null);
        setSelectedProductId(null);
        onClose();
        fetchTestPlan();
        setShowToast(true)
      } else {
        setError('Selecione um time e um produto');
      }
    } catch (err) {
      setError(`${err}`);
    }
  };

  const handleEditTestPlan = async () => {
    try {
      if (selectedTeam && selectedTestPlan) {
        await TestPlanService.editTestPlan(selectedTestPlan.id, selectedTestPlan.idTime.idTime, selectedTestPlan.idTproduto.idTproduto, TestPlanName);
        setTestPlanName('');
        setSelectedTeam(null);
        setSelectedTeamId(null);
        onClose();
        fetchTestPlan();
        setShowToast(true)
      } else {
        setError('Selecione um time');
      }
    } catch (err) {
      setError(`${err}`);
    }
  };

  const isEditing = !!selectedTestPlan;

  return (
    <>

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
            selectedTeam={selectedTeam?.idTime || null}
            disabled={isEditing}
          />

          <ProductDropDown
            onSelectProduct={(selectedProductId) => {
              setSelectedProductId(selectedProductId);
            }}
            selectedTeamId={selectedTeamId}
            disabled={isEditing}
            isEditing={isEditing}
            resetDropdown={resetProductDropdown}
            selectedProductId={selectedTestPlan?.idTproduto.idTproduto || null}
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

      {showToast && (
        <div>
          <Toast
            message="Operação realizada com sucesso!"
            showToast={showToast}
            setShowToast={setShowToast}
          />
        </div>
      )}
    </>
  );
};

export default TestPlanModal;