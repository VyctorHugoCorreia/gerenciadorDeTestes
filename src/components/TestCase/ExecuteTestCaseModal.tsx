import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import ScenarioStatusDropDown from '../Dropdown/ScenarioStatusDropDown';
import '../../styles/AddModal.css';
import '../../styles/Table.css';
import Toast from '../Toast';
import TestCaseService from '../../services/TestCaseService';
import HistoryStatusScenarioService from '../../services/HistoryStatusScenarioService';

interface ExecuteTestCaseModalProps {
  open: boolean;
  onClose: () => void;
  fetchTestCases?: () => void;
  selectedScenario?: { id: number; name: string };
  idCenario: number;
}

const ExecuteTestCaseModal: React.FC<ExecuteTestCaseModalProps> = ({ open, onClose, selectedScenario, idCenario, fetchTestCases }) => {
  const [error, setError] = useState<string>('');
  const [selectedScenarioStatusId, setSelectedScenarioStatusId] = useState<number | null>(null);
  const [testCase, setTestCase] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');


  useEffect(() => {
    const fetchScenarioStatus = async () => {
      try {
        if (open && idCenario) {
          const testCaseDetails = await TestCaseService.searchTestCaseById(idCenario);
          if (testCaseDetails.length > 0) {
            setSelectedScenarioStatusId(testCaseDetails[0]?.idStatus?.idStatus || null);
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
  }, [idCenario, open]);

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
      const filteredSteps = steps.filter(step => step.descricao.trim() !== ''); // Filtrar passos vazios, se necessário

      const testCaseDetails = await TestCaseService.searchTestCaseById(idCenario);
      const statusScenario = testCaseDetails[0]?.idStatus?.idStatus;


      const data = {
        idTime: testCase.idTime.idTime || 0,
        idPlano: testCase.idPlano.idPlano || 0,
        idSuite: testCase.idSuite.idSuite || 0,
        idTproduto: testCase.idTproduto.idTproduto || 0,
        idFuncionalidade: testCase.idFuncionalidade.idFuncionalidade || 0,
        idTpcenario: testCase.idTpcenario.idTpcenario || 0,
        idPlataforma: testCase.idPlataforma.idPlataforma || 0,
        idStatus: selectedScenarioStatusId || 0,
        idAutomatizado: testCase.idAutomatizado.idAutomatizado || 0,
        tituloCenario: testCase.tituloCenario,
        descCenario: testCase.descCenario,
        linkCenario: testCase.linkCenario,
        steps: filteredSteps.map((step, index) => ({
          passo: index + 1,
          descricao: step.descricao,
          status: step.status === 'A' ? 'A' : 'P',
        })),
        tags: testCase.tags,
      };

      if (idCenario != null) {

        const response = await TestCaseService.updateTestCase(idCenario, data);

        const dataHistory = {

          idCenario: response.idCenario,
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
                    <td>{step.passo}</td>
                    <td>{step.descricao}</td>
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
