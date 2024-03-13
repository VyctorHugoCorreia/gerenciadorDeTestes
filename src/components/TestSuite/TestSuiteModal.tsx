import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TeamsDropDown from '../Dropdown/TeamsDropDown';
import ProductDropDown from '../Dropdown/ProductDropDown';
import TestPlanDropDown from '../Dropdown/TestPlanDropDown';
import TextField from '@mui/material/TextField';
import ProductService from '../../services/ProductService';
import TestSuiteService from '../../services/TestSuiteService';
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

export interface TestPlan {
  id: number;
  name: string;

}

export interface TestSuiteModalProps {
  open: boolean;
  onClose: () => void;
  fetchTestSuite: () => void;
  selectedTestSuite?: {
    id: number;
    name: string;
    idTime: { idTime: number; nomeTime: string };
    idTproduto: { idTproduto: number; descProduto: string }
    idPlano: { idPlano: number; descPlano: string }
  } | null;
}

const TestSuiteModal: React.FC<TestSuiteModalProps> = ({
  open,
  onClose,
  fetchTestSuite,
  selectedTestSuite,
}) => {
  const [error, setError] = useState<string>('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [TestSuiteName, setTestSuiteName] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<{
    idTime: number;
    nomeTime: string;
  } | null>(null);

  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [resetProductDropdown, setResetProductDropdown] = useState(false);
  const [selectedTestPlanId, setSelectedTestPlanId] = useState<number | null>(null);
  const handleSelectTestPlan = (selectedPlanId: number | null) => {
    setSelectedTestPlanId(selectedPlanId);
  };
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (open && selectedTestSuite) {
      setError('');
      setTestSuiteName(selectedTestSuite.name || '')
      setSelectedTeam(selectedTestSuite.idTime || null);
      setSelectedTeamId(selectedTestSuite.idTime?.idTime || null);
      setSelectedTestPlanId(selectedTestSuite.idPlano?.idPlano || null);
      setSelectedProductId(selectedTestSuite.idTproduto?.idTproduto);
    } else {
      setError('');
      setTestSuiteName('');
      setSelectedTeam(null);
      setSelectedTeamId(null);
      setSelectedProductId(null);
      setSelectedTestPlanId(null);
    }
  }, [open, selectedTestSuite]);

  useEffect(() => {
    setIsButtonDisabled(selectedTeam === null || selectedProductId === null || selectedTestPlanId === null || TestSuiteName === '' );

});

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTestSuiteName(event.target.value);
    setError('');
  };

  const handleSelectTeam = async (team: { idTime: number; nomeTime: string } | string) => {
    if (!selectedTestSuite) {
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

  const handleAddTestSuite = async () => {
    const data = {
      idTime: (selectedTeam && selectedTeam.idTime) ?? 0,
      idTproduto: selectedProductId,
      idPlano: selectedTestPlanId,
      descSuite: TestSuiteName,
    };
    try {

      if (selectedTeam && selectedProductId !== null && selectedTestPlanId !== null) {
        await TestSuiteService.addTestSuite(data);
        setTestSuiteName('');
        setSelectedTeam(null);
        setSelectedTeamId(null);
        setSelectedProductId(null);
        onClose();
        fetchTestSuite();
        setShowToast(true)
      } else {
        console.log(selectedProductId);
        console.log(selectedTestPlanId);
        setError('Selecione um time e um produto');
      }
    } catch (err) {
      setError(`${err}`);
    }
  };

  const handleEditTestSuite = async () => {
    try {
      if (selectedTeam && selectedTestSuite) {
        await TestSuiteService.editTestSuite(selectedTestSuite.id, selectedTestSuite.idTime.idTime, selectedTestSuite.idTproduto.idTproduto, selectedTestSuite.idPlano.idPlano, TestSuiteName);
        setTestSuiteName('');
        setSelectedTeam(null);
        setSelectedTeamId(null);
        onClose();
        fetchTestSuite();
        setShowToast(true)
      } else {
        setError('Selecione um time');
      }
    } catch (err) {
      setError(`${err}`);
    }
  };

  const isEditing = !!selectedTestSuite;

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
            {selectedTestSuite ? 'Editar suite de testes' : 'Adicionar nova suíte de testes'}
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
            selectedProductId={selectedTestSuite?.idTproduto.idTproduto || null}
          />

          <TestPlanDropDown
            selectedProductId={selectedProductId}
            onSelectTestPlan={(selectedTestPlanId) => {
              setSelectedTestPlanId(selectedTestPlanId);
            }}
            isEditing={isEditing}
            selectedTestPlanId={selectedTestSuite?.idPlano.idPlano || null}
          />

          <TextField
            className="team-modal-input"
            id="test-plan-name"
            placeholder="Preencha o nome da suíte de testes"
            value={TestSuiteName}
            onChange={handleInputChange}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button
            className="team-modal-button"
            variant="contained"
            color="primary"
            onClick={selectedTestSuite ? handleEditTestSuite : handleAddTestSuite}
            disabled={isButtonDisabled}
          >
            {selectedTestSuite ? 'Editar' : 'Cadastrar'}
          </Button>
        </div>
      </Modal>
      <Toast
        message="Operação realizada com sucesso!"
        showToast={showToast}
        setShowToast={setShowToast}
      />
    </>
  );
};

export default TestSuiteModal