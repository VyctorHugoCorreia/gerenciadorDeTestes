import React, { useState, MouseEvent } from 'react';
import TestPlanService from '../../services/TestPlanService';
import '../../styles/Table.css';
import ErrorPopup from '../ErrorPopup';
import TestPlanModal from './TestPlanModal';
import Toast from '../Toast';
import TablePagination from '@mui/material/TablePagination';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import CreateTestSuiteByPlanModal from './CreateTestSuiteByPlanModal';

export interface TestPlan {
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
  testPlans: TestPlan[];
  fetchTestPlans: () => void;
}



const TestPlanTable: React.FC<TestPlanTableProps> = ({ testPlans, fetchTestPlans }) => {
  const [anchorElMap, setAnchorElMap] = useState<{ [key: number]: HTMLElement | null }>({});
  const [isCreateTestPlanModalOpen, setIsCreateTestSuiteModalOpen] = useState(false);
  const [selectedCreateTestPlanId, setSelectedCreateTestPlanId] = useState<number | null>(null);
  const [selectedTestPlanId, setSelectedTestPlanId] = useState<number | null>(null);

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
    };
    quantidadeSuites: number;
  } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleDeleteTestPlan = async (testPlanId: number) => {
    try {
      await TestPlanService.deleteTestPlan(testPlanId);
      fetchTestPlans();
      setShowToast(true);
    } catch (err) {
      console.error('Error deleting test plan:', err);
      setError(`${err}`);
      setErrorPopupOpen(true);
    }
  };

  const handleCreateTestSuite = async (testPlanId: number) => {
    setIsCreateTestSuiteModalOpen(true)
    setSelectedCreateTestPlanId(testPlanId);
  };

  const handleViewTestCase = async (testPlanId: number) => {

  };

  const handleCloseModal = () => {
    setSelectedTestPlanId(null);
  };

  const handleCloseErrorPopup = () => {
    setErrorPopupOpen(false);
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>, testSuiteId: number) => {
    setAnchorElMap({
      ...anchorElMap,
      [testSuiteId]: event.currentTarget,
    });
  };

  const handleClose = (testSuiteId: number) => {
    setAnchorElMap({
      ...anchorElMap,
      [testSuiteId]: null,
    });
  };


  const handleEditTestPlan = (testPlan: TestPlan) => {
    const { idPlano, descPlano, idTime, idTproduto, quantidadeSuites } = testPlan;

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
      quantidadeSuites: quantidadeSuites,
    };

    setSelectedTestPlan(formattedTestPlan);
    setIsEditModalOpen(true);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      {testPlans.length === 0 ? (
        <h3 className="no-records-message">Nenhum plano de teste foi encontrado</h3>
      ) : (
        <>
          <table className="table-container">
            <thead>
              <tr>
                <th>Time</th>
                <th>Produto</th>
                <th>Plano de testes</th>
                <th>Quantidade de suítes</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {testPlans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((testPlan) => (
                <tr key={testPlan.idPlano}>
                  <td>{testPlan.idTime.nomeTime}</td>
                  <td>{testPlan.idTproduto.descProduto}</td>
                  <td>{testPlan.descPlano}</td>
                  <td>{testPlan.quantidadeSuites}</td>
                  <td className="action-buttons">
                    <div>
                      <IconButton
                        aria-label="Opções"
                        aria-controls={`menu-options-${testPlan.idPlano}`}
                        aria-haspopup="true"
                        onClick={(event) => handleClick(event, testPlan.idPlano)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id={`menu-options-${testPlan.idPlano}`}
                        anchorEl={anchorElMap[testPlan.idPlano]}
                        open={Boolean(anchorElMap[testPlan.idPlano])}
                        onClose={() => handleClose(testPlan.idPlano)}
                      >
                        <MenuItem onClick={() => handleEditTestPlan(testPlan)}>Editar</MenuItem>
                        <MenuItem onClick={() => handleDeleteTestPlan(testPlan.idPlano)}>Excluir</MenuItem>
                        <MenuItem onClick={() => handleCreateTestSuite(testPlan.idPlano)}>Cadastrar suite de testes</MenuItem>
                        <MenuItem
                          disabled={testPlan.quantidadeSuites === 0}
                          onClick={() => handleViewTestCase(testPlan.idPlano)}
                        >
                          Visualizar suites de teste
                        </MenuItem>
                      </Menu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={testPlans.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Itens por página"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
        </>
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

      <Toast
        message="Operação realizada com sucesso!"
        showToast={showToast}
        setShowToast={setShowToast}
      />


       
      <CreateTestSuiteByPlanModal
        open={isCreateTestPlanModalOpen}
        onClose={() => {
          setIsCreateTestSuiteModalOpen(false);
        }}
        testPlanId={selectedCreateTestPlanId}
        fetchTestPlans={fetchTestPlans}
      />
    </div>
  );
};

export default TestPlanTable;
