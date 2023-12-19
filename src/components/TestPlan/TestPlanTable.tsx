import React, { useEffect, useState } from 'react';
import TestPlanService from '../../services/TestPlanService';
import '../../styles/Table.css';
import ErrorPopup from '../ErrorPopup';
import TestPlanModal from './TestPlanModal'; 

export interface testPlan {
  idPlano: number;
  descPlano: string;
  idTime: {
    idTime: number;
    nomeTime: string;
  };
  idTproduto: {
    idTproduto: number;
    descProduto: string;
    idTime: {
      idTime: number;
      nomeTime: string;
    };
  };
  quantidadeSuites: number;
}

interface TestPlanTableProps {
  testPlans: testPlan[];
  fetchTestPlans: () => void;
}

const TestPlanTable: React.FC<TestPlanTableProps> = ({ testPlans, fetchTestPlans }) => {
  const [error, setError] = useState<string>('');
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTestPlan, setSelectedTestPlan] = useState<{
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
    quantidadeSuites: number;
  } | null>(null);

  const handleDeleteTestPlan = async (testPlanId: number) => {
    try {
      await TestPlanService.deleteTestPlan(testPlanId);
      fetchTestPlans();
    } catch (err) {
      console.error('Error deleting test plan:', err);
      setError(`${err}`);
      setErrorPopupOpen(true);
    }
  };

  const handleCloseErrorPopup = () => {
    setErrorPopupOpen(false);
  };

  const handleEditTestPlan = (testPlan: testPlan) => {
    const { idPlano, descPlano, idTime, idTproduto,quantidadeSuites } = testPlan;

    const formattedTestPlan = {
      id: idPlano,
      name: descPlano,
      idTime: {
        idTime: idTime.idTime,
        nomeTime: idTime.nomeTime,
      },
      idTproduto: {
        idTproduto: idTproduto.idTproduto,
        descProduto: idTproduto.descProduto,

      },
      quantidadeSuites:  quantidadeSuites
    };

    setSelectedTestPlan(formattedTestPlan);
    setIsEditModalOpen(true);
  };


  return (

    <div>
      {testPlans.length === 0 ? (
        <h3 className="no-records-message">Nenhum plano de teste foi encontrada</h3>
      ) : (<table className="table-container">
        <thead>
          <tr>
            <th>Time</th>
            <th>Produto</th>
            <th>plano de testes</th>
            <th>Quantidade de suítes</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {testPlans.map((testPlan) => (
            <tr key={testPlan.idPlano}>
              <td>{testPlan.idTime.nomeTime}</td>
              <td>{testPlan.idTproduto.descProduto}</td>
              <td>{testPlan.descPlano}</td>
              <td>{testPlan.quantidadeSuites}</td>
              <td className="action-buttons">
                <button onClick={() => handleEditTestPlan(testPlan)}>Editar</button>
                <button onClick={() => handleDeleteTestPlan(testPlan.idPlano)}>Excluir</button>
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

      <TestPlanModal 
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTestPlan(null);
        }}
        fetchTestPlan={fetchTestPlans}
        selectedTestPlan={selectedTestPlan}
      />
    </div>
  );
};

export default TestPlanTable;
