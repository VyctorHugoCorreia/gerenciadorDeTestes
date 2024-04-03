import React, { useState, MouseEvent } from 'react';
import '../../styles/Table.css';
import ErrorPopup from '../ErrorPopup';
import TestSuiteModal from '../TestSuite/TestSuiteModal';
import TestSuiteService from '../../services/TestSuiteService';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';

import Toast from '../Toast';
import TablePagination from '@mui/material/TablePagination';
import TestCaseBySuiteModal from './TestCaseBySuiteModal';
import CreateTestCaseBySuiteModal from './CreateTestCaseBySuiteModal';
import TestCaseService from '../../services/TestCaseService';
import { generateFeatureFile } from '../GenerateFeatureFile';

export interface testSuite {
  idTestSuite: number;
  descTestSuite: string;
  idTestPlan: {
    idTestPlan: number;
    descTestPlan: string;
    idProduct: {
      idProduct: number;
      descProduct: string;
      idTeam: {
        idTeam: number;
        nameTeam: string;
      };
    }
  };
  scenarioQuantity: number;
}

interface TestSuiteTableProps {
  testSuites: testSuite[];
  fetchTestSuites: () => void;
}

const TestSuiteTable: React.FC<TestSuiteTableProps> = ({ testSuites, fetchTestSuites }) => {
  const [anchorElMap, setAnchorElMap] = useState<{ [key: number]: HTMLElement | null }>({});
  const [error, setError] = useState<string>('');
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTestSuiteId, setSelectedTestSuiteId] = useState<number | null>(null);
  const [selectedCreateTestSuiteId, setSelectedCreateTestSuiteId] = useState<number | null>(null);
  const [isCreateTestCaseModalOpen, setIsCreateTestCaseModalOpen] = useState(false);
  const [selectedTestSuite, setSelectedTestSuite] = useState<{
    idTestSuite: number;
    descTestSuite: string;
    idTestPlan: {
      idTestPlan: number;
      descTestPlan: string;
      idProduct: {
        idProduct: number;
        descProduct: string;
        idTeam: {
          idTeam: number;
          nameTeam: string;
        };
      }
    };
    scenarioQuantity: number;

  } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [testCases, setTestCases] = useState<any[]>([]);

  const handleClick = (event: MouseEvent<HTMLButtonElement>, idTestSuite: number) => {
    setAnchorElMap({
      ...anchorElMap,
      [idTestSuite]: event.currentTarget,
    });
  };

  const handleClose = (idTestSuite: number) => {
    setAnchorElMap({
      ...anchorElMap,
      [idTestSuite]: null,
    });
  };

  const handleDeleteTestSuite = async (idTestSuite: number) => {
    try {
      await TestSuiteService.deleteTestSuite(idTestSuite);
      fetchTestSuites();
      setShowToast(true)
    } catch (err) {
      console.error('Error deleting test suites:', err);
      setError(`${err}`);
      setErrorPopupOpen(true);
    }
  };

  const handleGenerateFeatureTestCase = async (idTestSuite: number) => {
    try {
        const testCaseData = await TestCaseService.searchTestCase({ idTestSuite });
        
        if (testCaseData && testCaseData.length > 0) {
            generateFeatureFile(testCaseData);
        } else {
            console.warn('Nenhum caso de teste encontrado para este conjunto de teste.');
        }
    } catch (error) {
        console.error('Erro ao buscar casos de teste:', error);
    }
};
  const handleCreateTestCase = async (idTestSuite: number) => {
    setIsCreateTestCaseModalOpen(true)
    setSelectedCreateTestSuiteId(idTestSuite);
  };

  const handleViewTestCase = async (idTestSuite: number) => {
    setSelectedTestSuiteId(idTestSuite);

  };

  const handleCloseModal = () => {
    setSelectedTestSuiteId(null);
  };

  const handleCloseErrorPopup = () => {
    setErrorPopupOpen(false);
  };

  const handleEditTestSuite = (testSuite: testSuite) => {
    const { idTestSuite, descTestSuite, idTestPlan, scenarioQuantity } = testSuite;

    const formattedTestSuite = {
      idTestSuite: idTestSuite,
      descTestSuite: descTestSuite,
      idTestPlan: {
        idTestPlan: idTestPlan.idTestPlan,
        descTestPlan: idTestPlan.descTestPlan,
        idProduct: {
          idProduct: idTestPlan.idProduct.idProduct,
          descProduct: idTestPlan.idProduct.descProduct,
          idTeam: {
            idTeam: idTestPlan.idProduct.idTeam.idTeam,
            nameTeam: idTestPlan.idProduct.idTeam.nameTeam,
          }
        },
      },
      scenarioQuantity: scenarioQuantity
    };

    setSelectedTestSuite(formattedTestSuite);
    setIsEditModalOpen(true);
  };
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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

          {testSuites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((testSuite) => (
            <tr key={testSuite.idTestSuite}>
              <td>{testSuite.idTestPlan.idProduct.idTeam.nameTeam}</td>
              <td>{testSuite.idTestPlan.idProduct.descProduct}</td>
              <td>{testSuite.idTestPlan.descTestPlan}</td>
              <td>{testSuite.descTestSuite}</td>
              <td>{testSuite.scenarioQuantity}</td>
              <td className="action-buttons">
                <div>
                  <IconButton
                    aria-label="Opções"
                    aria-controls={`menu-options-${testSuite.idTestSuite}`}
                    aria-haspopup="true"
                    onClick={(event) => handleClick(event, testSuite.idTestSuite)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={`menu-options-${testSuite.idTestSuite}`}
                    anchorEl={anchorElMap[testSuite.idTestSuite]}
                    open={Boolean(anchorElMap[testSuite.idTestSuite])}
                    onClose={() => handleClose(testSuite.idTestSuite)}
                  >

                    <MenuItem onClick={() => handleEditTestSuite(testSuite)}>Editar</MenuItem>
                    <MenuItem onClick={() => handleDeleteTestSuite(testSuite.idTestSuite)}>Excluir</MenuItem>
                    <MenuItem onClick={() => handleCreateTestCase(testSuite.idTestSuite)}>Cadastrar cenário</MenuItem>
                    <MenuItem onClick={() => handleGenerateFeatureTestCase(testSuite.idTestSuite)}>Gerar gherkin em java</MenuItem>
                    <MenuItem
                      disabled={testSuite.scenarioQuantity === 0}
                      onClick={() => handleViewTestCase(testSuite.idTestSuite)}
                    >
                      Visualizar cenários
                    </MenuItem>
                  </Menu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )
      }
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={testSuites.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Itens por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
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

      {
        selectedTestSuiteId !== null && (
          <TestCaseBySuiteModal
            open={true}
            idTestSuite={selectedTestSuiteId}
            onClose={handleCloseModal}
            fetchTestSuites={fetchTestSuites}
          />
        )
      }
      <CreateTestCaseBySuiteModal
        open={isCreateTestCaseModalOpen}
        onClose={() => {
          setIsCreateTestCaseModalOpen(false);
        }}
        idTestSuite={selectedCreateTestSuiteId}
        fetchTestSuites={fetchTestSuites}
      />
    </div >
  );
};

export default TestSuiteTable;
