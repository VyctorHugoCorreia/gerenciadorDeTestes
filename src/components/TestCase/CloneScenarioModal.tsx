import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@mui/material';
import TeamsDropDown from '../Dropdown/TeamsDropDown';
import ProductDropDown from '../Dropdown/ProductDropDown';
import TestPlanDropDown from '../Dropdown/TestPlanDropDown';
import TestSuiteDropDown from '../Dropdown/TestSuiteDropDown';
import TestCaseService from '../../services/TestCaseService';
import HistoryStatusScenarioService from '../../services/HistoryStatusScenarioService';
import Toast from '../Toast';

interface CloneScenarioModalProps {
  open: boolean;
  onClose: () => void;
  idScenario: number;
}


interface SelectedTeam {
  idTeam: number;
  nameTeam: string;
}

interface TestCase {
  idScenarioType: number;
  idPlatformType: number;
  idScenarioStatus: number;
  idAutomationStatus: number;
  titleScenario: string;
  descScenario: string;
  linkScenario: string;
  steps?: { step: number; description: string }[];
  tags?: string[];
}

const CloneScenarioModal: React.FC<CloneScenarioModalProps> = ({
  open,
  onClose,
  idScenario,
}) => {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [resetProductDropdown, setResetProductDropdown] = useState(false);
  const [selectedTestPlan, setSelectedTestPlan] = useState<number | null>(null);
  const [selectedTestSuite, setSelectedTestSuite] = useState<number | null>(null);
  const [selectedScenarioType, setSelectedScenarioType] = useState<number | null>(null);
  const [selectedPlataformType, setSelectedPlataformType] = useState<number | null>(null);
  const [selectedStatusAutomationType, setSelectedStatusAutomationType] = useState<number | null>(
    null
  );
  const [selectedScenarioStatusType, setSelectedScenarioStatusType] = useState<number | null>(
    null
  );
  const [scenarioTitle, setScenarioTitle] = useState<string>('');
  const [scenarioDescription, setscenarioDescription] = useState<string>('');
  const [scenarioLink, setscenarioLink] = useState<string>('');
  const [steps, setSteps] = useState<{ step: number; description: string }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [jsonResult, setJsonResult] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const testCaseResult = await TestCaseService.searchTestCase({ idScenario });

        setSelectedScenarioType(testCaseResult[0].idScenarioType.idScenarioType);
        setSelectedPlataformType(testCaseResult[0].idPlatformType.idPlatformType);
        setSelectedScenarioStatusType(testCaseResult[0].idScenarioStatus.idScenarioStatus);
        setSelectedStatusAutomationType(testCaseResult[0].idAutomationStatus.idAutomationStatus);
        setSelectedScenarioStatusType(3)
        setScenarioTitle(testCaseResult[0].titleScenario);
        setscenarioDescription(testCaseResult[0].descScenario);
        setscenarioLink(testCaseResult[0].linkScenario);
        setSteps(testCaseResult[0].steps || []);
        setTags(testCaseResult[0].tags || []);
      } catch (error) {
        console.error('Ocorreu um erro ao buscar o caso de teste:', error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [idScenario, open]);


  const handleSelectTeam = (team: number | SelectedTeam | null | string) => {
    if (typeof team === 'string' || team === null) {
      setSelectedTeam(null);
      setResetProductDropdown(true);
      setSelectedProductId(null);
    } else if (typeof team !== 'number') {
      setSelectedTeam(team.idTeam);
    }
  };

  const handleSelectProduct = (productId: number | null) => {
    setSelectedProductId(productId);
    setSelectedTestSuite(null);
    setSelectedTestPlan(null);
  };

  const handleSelectTestPlan = (testPlanId: number | null) => {
    setSelectedTestPlan(testPlanId);
  };

  const handleSelectTestSuite = (testSuiteId: number | null) => {
    setSelectedTestSuite(testSuiteId);
  };

  const handleCadastro = async () => {
    try {
      const data = {
        idTeam: selectedTeam || 0,
        idTestPlan: selectedTestPlan || 0,
        idTestSuite: selectedTestSuite || 0,
        idProduct: selectedProductId || 0,
        idScenarioType: selectedScenarioType || 0,
        idPlatformType: selectedPlataformType || 0,
        idScenarioStatus: selectedScenarioStatusType || 0,
        idAutomationStatus: selectedStatusAutomationType || 0,
        titleScenario: scenarioTitle,
        descScenario: scenarioDescription,
        linkScenario: scenarioLink,
        steps: steps.map((step, index) => ({
          step: index + 1,
          description: step.description,
        })),
        tags,
      };

      setJsonResult(JSON.stringify(data, null, 2));

      const response = await TestCaseService.addTestCase(data);

      const dataHistory = {
        idScenario: response.idScenario,
        statusBefore:  selectedScenarioStatusType || 0,
        statusAfter:   selectedScenarioStatusType || 0,
      };

      await HistoryStatusScenarioService.addHistoryStatusScenario(dataHistory);

      setToastMessage('Caso de teste clonado com sucesso!');
      setShowToast(true);
      onClose()
    } catch (error) {
      console.error(error);
      setToastMessage('Erro ao cadastrar caso de teste. Tente novamente mais tarde.');
      setShowToast(true);
    }
  };

  return (
    <>
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="team-modal-title"
      aria-describedby="team-modal-description"
    >
      <div className="team-modal">
        <h2 id="modal-modal-title">Clonar Cenário</h2>
        <TeamsDropDown
          onSelectTeam={handleSelectTeam}
          selectedTeam={selectedTeam}
          disabled={false}
        />
        <ProductDropDown
          onSelectProduct={handleSelectProduct}
          selectedTeamId={selectedTeam}
          disabled={!selectedTeam}
          isEditing={false}
          resetDropdown={resetProductDropdown}
          selectedProductId={selectedProductId}
        />
        <TestPlanDropDown
          selectedProductId={selectedProductId}
          onSelectTestPlan={handleSelectTestPlan}
          disabled={!selectedProductId}
          isEditing={false}
          selectedTestPlanId={selectedTestPlan}
        />
        <TestSuiteDropDown
          selectedTestPlanId={selectedTestPlan}
          onSelectTestSuite={handleSelectTestSuite}
          disabled={!selectedTestPlan}
          isEditing={false}
          selectedTestSuiteId={selectedTestSuite}
        />
        <Button variant="contained" color="primary" onClick={handleCadastro}>
          Cadastrar
        </Button>
      </div>
    
    </Modal>
    {showToast && (
        <div>
          <Toast
            message={toastMessage}
            showToast={showToast}
            setShowToast={setShowToast}
          />
        </div>
      )}
  
    </>
  );
};

export default CloneScenarioModal;
