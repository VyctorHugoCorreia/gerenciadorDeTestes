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
  idProduct: number;
  descProduct: string;
  idTeam: {
    idTeam: number;
    nameTeam: string;
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
    idTestSuite: number;
    descTestSuite: string;
    idTestPlan: { idTestPlan: number; descTestPlan: string; idProduct: { idProduct: number; descProduct: string;  idTeam: { idTeam: number; nameTeam: string };} }
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
    idTeam: number;
    nameTeam: string;
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
      setTestSuiteName(selectedTestSuite.descTestSuite || '')
      setSelectedTeam(selectedTestSuite.idTestPlan.idProduct.idTeam || null);
      setSelectedTeamId(selectedTestSuite.idTestPlan.idProduct.idTeam.idTeam || null);
      setSelectedTestPlanId(selectedTestSuite.idTestPlan?.idTestPlan || null);
      setSelectedProductId(selectedTestSuite.idTestPlan?.idProduct.idProduct);
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

  const handleSelectTeam = async (team: { idTeam: number; nameTeam: string } | string) => {
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
        setSelectedTeamId(team.idTeam);
        setSelectedProductId(null);
        setResetProductDropdown(false);

        try {
          const productsData = await ProductService.getProductsByTeam(team.idTeam.toString());
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
      idTeam: (selectedTeam && selectedTeam.idTeam) ?? 0,
      idProduct: selectedProductId,
      idTestPlan: selectedTestPlanId,
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
        await TestSuiteService.editTestSuite(selectedTestSuite.idTestSuite, selectedTestSuite.idTestPlan.idProduct.idTeam.idTeam, selectedTestSuite.idTestPlan.idProduct.idProduct, selectedTestSuite.idTestPlan.idTestPlan, TestSuiteName);
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
            selectedTeam={selectedTeam?.idTeam || null}
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
            selectedProductId={selectedTestSuite?.idTestPlan.idProduct.idProduct || null}
          />

          <TestPlanDropDown
            selectedProductId={selectedProductId}
            onSelectTestPlan={(selectedTestPlanId) => {
              setSelectedTestPlanId(selectedTestPlanId);
            }}
            isEditing={isEditing}
            selectedTestPlanId={selectedTestSuite?.idTestPlan.idTestPlan || null}
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