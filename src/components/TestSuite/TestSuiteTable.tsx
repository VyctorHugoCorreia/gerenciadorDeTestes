import React, { useEffect, useState } from 'react';
import TestPlanService from '../../services/TestPlanService';
import '../../styles/Table.css';
import ErrorPopup from '../ErrorPopup';
import TestSuiteModal from '../TestSuite/TestSuiteModal'; 
import TestSuiteService from '../../services/TestSuiteService';
import Toast from '../Toast';

export interface testSuite {
  idSuite: number;
  descSuite: string;
  idTime: {
    idTime: number;
    nomeTime: string;
  };
  idTproduto: {
    idTproduto: number;
    descProduto: string;
  };
  idPlano: {
    idPlano: number;
    descPlano: string;
  }
}

interface TestSuiteTableProps {
  testSuites: testSuite[];
  fetchTestSuites: () => void;
}

const TestSuiteTable: React.FC<TestSuiteTableProps> = ({ testSuites, fetchTestSuites }) => {
  const [error, setError] = useState<string>('');
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTestSuite, setSelectedTestSuite] = useState<{
    id: number;
    name: string;
    idTime: {
      idTime: number;
      nomeTime: string;
    };
    idTproduto: {
      idTproduto: number;
      descProduto: string;
    }
    idPlano:{
      idPlano: number;
      descPlano: string;
    }
   
  } | null>(null);
  const [showToast, setShowToast] = useState(false);


  const handleDeleteTestSuite = async (testSuiteId: number) => {
    try {
      await TestSuiteService.deleteTestSuite(testSuiteId);
      fetchTestSuites();
      setShowToast(true)
    } catch (err) {
      console.error('Error deleting test suites:', err);
      setError(`${err}`);
      setErrorPopupOpen(true);
    }
  };

  const handleCloseErrorPopup = () => {
    setErrorPopupOpen(false);
  };

  const handleEditTestSuite = (testSuite: testSuite) => {
    const { idSuite, descSuite, idTime, idTproduto, idPlano} = testSuite;

    const formattedTestSuite = {
      id: idSuite,
      name: descSuite,
      idTime: {
        idTime: idTime.idTime,
        nomeTime: idTime.nomeTime,
      },
      idTproduto: {
        idTproduto: idTproduto.idTproduto,
        descProduto: idTproduto.descProduto,

      },
      idPlano: {
        idPlano: idPlano.idPlano,
        descPlano: idPlano.descPlano,

      }
    };

    setSelectedTestSuite(formattedTestSuite);
    setIsEditModalOpen(true);
  };


  return (

    <div>
      {testSuites.length === 0 ? (
        <h3 className="no-records-message">Nenhuma suite de testes foi encontrada</h3>
      ) : (<table className="table-container">
        <thead>
          <tr>
            <th>Time</th>
            <th>Produto</th>
            <th>plano de testes</th>
            <th>Suite de testes</th>
            <th>Quantidade de cenários</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {testSuites.map((testSuites) => (
            <tr key={testSuites.idSuite}>
              <td>{testSuites.idTime.nomeTime}</td>
              <td>{testSuites.idTproduto.descProduto}</td>
              <td>{testSuites.idPlano.descPlano}</td>
              <td>{testSuites.descSuite}</td>
              <td>0</td>
              <td className="action-buttons">
                <button onClick={() => handleEditTestSuite(testSuites)}>Editar</button>
                <button onClick={() => handleDeleteTestSuite(testSuites.idSuite)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      <ErrorPopup
        open={errorPopupOpen}
        onClose={handleCloseErrorPopup}
        errorMessage={error}
      />

      <TestSuiteModal 
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTestSuite(null);
        }}
        fetchTestSuite={fetchTestSuites}
        selectedTestSuite={selectedTestSuite}
      />
       <Toast
        message="Operação realizada com sucesso!"
        showToast={showToast}
        setShowToast={setShowToast}
      />
    </div>
  );
};

export default TestSuiteTable;
