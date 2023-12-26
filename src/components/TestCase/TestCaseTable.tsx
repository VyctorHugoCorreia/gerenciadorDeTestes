import React, { useState } from 'react';
import TestService from '../../services/TestCaseService';
import '../../styles/Table.css';
import ErrorPopup from '../ErrorPopup';
import Toast from '../Toast';
import { useNavigate } from 'react-router-dom';

interface TestCase {
  idCenario: number;
  tituloCenario: string;
  descCenario: string;
  linkCenario: string;
  idTime: {
    idTime: number;
    nomeTime: string;
  };
  idPlano: {
    idPlano: number;
    descPlano: string;
  };
  idSuite: {
    idSuite: number;
    descSuite: string;
  };
  idTproduto: {
    idTproduto: number;
    descProduto: string;
  };
  idFuncionalidade: {
    idFuncionalidade: number;
    descFuncionalidade: string;
  };
  idTpcenario: {
    idTpcenario: number;
    descTpcenario: string;
  };
  idStatus: {
    idStatus: number;
    descStatus: string;
  };
  idAutomatizado: {
    idAutomatizado: number;
    descAutomatizado: string;
  };
}

interface TestCaseTableProps {
  testCases: TestCase[];
  fetchTestCases: () => void;
}

const TestCaseTable: React.FC<TestCaseTableProps> = ({ testCases, fetchTestCases }) => {
  const [error, setError] = useState<string>('');
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

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
  };

  const handleEdit = (id: number) => {
    // Navegar para a página de edição com o ID do caso de teste selecionado
    navigate(`/edit-test-case/${id}`);
  };


  const handleCloseErrorPopup = () => {
    setErrorPopupOpen(false);
  };

  return (
    <div className="table-responsive">
      {testCases.length === 0 ? (
        <h3 className="no-records-message">Nenhum caso de teste encontrado</h3>
      ) : (
        <div className="scrollable-table">
          <table className="table-container">
            <thead>
              <tr>
                <th>Nome do time</th>
                <th>Produto</th>
                <th>Funcionalidade</th>
                <th>Cenário</th>
                <th>Plano de teste</th>
                <th>Suite de teste</th>
                <th>Status do cenário</th>
                <th>Automatizado?</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {testCases.map((testCase) => (
                <tr key={testCase.idCenario}>
                  <td>{testCase.idTime.nomeTime}</td>
                  <td>{testCase.idTproduto.descProduto}</td>
                  <td>{testCase.idFuncionalidade.descFuncionalidade}</td>
                  <td className="scrollable-cell">{testCase.tituloCenario}</td>
                  <td>{testCase.idPlano.descPlano}</td>
                  <td>{testCase.idSuite.descSuite}</td>
                  <td>{testCase.idStatus.descStatus}</td>
                  <td>{testCase.idAutomatizado.descAutomatizado}</td>
                  <td className="action-buttons">
                  <button onClick={() => handleEdit(testCase.idCenario)}>Editar</button>
                    <button onClick={() => handleDelete(testCase.idCenario)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ErrorPopup
        open={errorPopupOpen}
        onClose={handleCloseErrorPopup}
        errorMessage={error}
      />
      <Toast
        message="Operação realizada com sucesso!"
        showToast={showToast}
        setShowToast={setShowToast}
      />
    </div>
  );
};

export default TestCaseTable;
