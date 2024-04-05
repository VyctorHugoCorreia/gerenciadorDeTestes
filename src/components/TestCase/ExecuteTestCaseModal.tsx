import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import ScenarioStatusDropDown from '../Dropdown/ScenarioStatusDropDown';
import '../../styles/AddModal.css';
import '../../styles/Table.css';
import Toast from '../Toast';
import TestCaseService from '../../services/TestCaseService';
import HistoryStatusScenarioService from '../../services/HistoryStatusScenarioService';
import EvidenceUploadModal from './EvidenceUploadModal'; // Importando o componente EvidenceUploadModal

interface ExecuteTestCaseModalProps {
  open: boolean;
  onClose: () => void;
  fetchTestCases?: () => void;
  selectedScenario?: { id: number; name: string };
  idScenario: number;
}

const ExecuteTestCaseModal: React.FC<ExecuteTestCaseModalProps> = ({ open, onClose, selectedScenario, idScenario, fetchTestCases }) => {
  const [error, setError] = useState<string>('');
  const [selectedScenarioStatusId, setSelectedScenarioStatusId] = useState<number | null>(null);
  const [testCase, setTestCase] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');


  useEffect(() => {
    const fetchScenarioStatus = async () => {
      try {
        if (open && idScenario) {
          const testCaseDetails = await TestCaseService.searchTestCase({idScenario});
          if (testCaseDetails.length > 0) {
            setSelectedScenarioStatusId(testCaseDetails[0]?.idScenarioStatus?.idScenarioStatus || null);
            setTestCase(testCaseDetails[0]);
          }
        }
      } catch (err) {
        setError(`${err}`);
      }
    };

    if (open) {
      fetchScenarioStatus();
    }
  }, [idScenario, open]);

  useEffect(() => {
    if (testCase && testCase.steps) {
      setSteps([...testCase.steps]);
    }
  }, [testCase]);

  const handleChecklistChange = (index: number, checked: boolean) => {
    const updatedSteps = [...steps];
    updatedSteps[index].status = checked ? 'A' : 'P';
    setSteps(updatedSteps);
  };


  const handleExecute = async () => {
    try {
      const filteredSteps = steps.filter(step => step.description.trim() !== ''); 

      const testCaseDetails = await TestCaseService.searchTestCase({ idScenario });
      const statusScenario = testCaseDetails[0]?.idScenarioStatus?.idScenarioStatus;


      const data = {
        idTeam: testCase.idTestSuite.idTestPlan.idProduct.idTeam.idTeam || 0,
        idTestPlan: testCase.idTestSuite.idTestPlan.idTestPlan || 0,
        idTestSuite: testCase.idTestSuite.idTestSuite || 0,
        idProduct: testCase.idTestSuite.idTestPlan.idProduct.idProduct || 0,
        idScenarioType: testCase.idScenarioType.idScenarioType || 0,
        idPlatformType: testCase.idPlatformType.idPlatformType || 0,
        idScenarioStatus: selectedScenarioStatusId || 0,
        idAutomationStatus: testCase.idAutomationStatus.idAutomationStatus || 0,
        titleScenario: testCase.titleScenario,
        descScenario: testCase.descScenario,
        linkScenario: testCase.linkScenario,
        steps: filteredSteps.map((step, index) => ({
          step: index + 1,
          description: step.description,
          status: step.status === 'A' ? 'A' : 'P',
        })),
        tags: testCase.tags,
      };

      if (idScenario != null) {
        const response = await TestCaseService.updateTestCase(idScenario, data);

        const dataHistory = {

          idScenario: response.idScenario,
          statusBefore: statusScenario || 0,
          statusAfter: selectedScenarioStatusId || 0

        }

        await HistoryStatusScenarioService.addHistoryStatusScenario(dataHistory);
        
        setToastMessage('Caso de teste editado com sucesso!');
        setShowToast(true);
        onClose();
        if (fetchTestCases != null)
          fetchTestCases();
      }

    } catch (error) {
      console.error(error);
      setToastMessage('Erro ao editar o caso de teste. Tente novamente mais tarde.');
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
          <h2 id="scenario-modal-title">Executar cenário de teste</h2>
          <ScenarioStatusDropDown
            onSelectScenarioStatus={setSelectedScenarioStatusId}
            disabled={false}
            isEditing={true}
            selectedScenarioStatusId={selectedScenarioStatusId}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}


          {steps && steps.length > 0 ? (
            <table className="table-container">
              <thead>
                <tr>
                  <th>Nº</th>
                  <th>Passo</th>
                  <th>Checklist</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step: any, index: number) => (
                  <tr key={index}>
                    <td>{step.step}</td>
                    <td>{step.description}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={step.status === 'A'}
                        onChange={(e) => handleChecklistChange(index, e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Não há steps disponíveis para exibição.</p>
          )}
          <div>
         <span className='span-label'>Upload de evidência:</span>
          <EvidenceUploadModal />
        </div>
          <Button
            className="team-modal-button"
            variant="contained"
            color="primary"
            onClick={handleExecute}
            disabled={false}
          >
            Salvar
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

export default ExecuteTestCaseModal;
