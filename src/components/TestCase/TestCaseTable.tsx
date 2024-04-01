import React, { useState } from 'react';
import TestService from '../../services/TestCaseService';
import ErrorPopup from '../ErrorPopup';
import Toast from '../Toast';
import { useNavigate } from 'react-router-dom';
import OptionMenuTestCaseTable from './OptionMenuTestCaseTable';
import TablePagination from '@mui/material/TablePagination';
import TableContainer from '@mui/material/TableContainer';
import { FormGroup, FormControlLabel, Checkbox, styled, Menu, MenuItem, Button } from '@mui/material';

const TransparentTableContainer = styled(TableContainer)({
  background: 'transparent',
  boxShadow: 'none',
});

interface TestCase {
  idScenario: number;
  titleScenario: string;
  descScenario: string;
  linkScenario: string;
  descScenarioStatus: string;
  descAutomationStatus: string;
  idTestSuite: {
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
      };
    };
  };
}

interface TestCaseTableProps {
  testCases: TestCase[];
  fetchTestCases: () => void;
}

type ColumnNames =
  | 'Nome do time'
  | 'Produto'
  | 'Plano de teste'
  | 'Suite de teste'
  | 'Cenário'
  | 'Status do cenário'
  | 'Automatizado?'
  | 'Ações';

const TestCaseTable: React.FC<TestCaseTableProps> = ({ testCases, fetchTestCases }) => {
  const [error, setError] = useState<string>('');
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const initialColumnsState: Record<ColumnNames, boolean> = {
    'Nome do time': true,
    'Produto': true,
    'Plano de teste': true,
    'Suite de teste': true,
    'Cenário': true,
    'Status do cenário': true,
    'Automatizado?': true,
    'Ações': true,
  };

  const [selectedColumns, setSelectedColumns] = useState(initialColumnsState);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleColumnToggle = (columnName: ColumnNames) => {
    setSelectedColumns({
      ...selectedColumns,
      [columnName]: !selectedColumns[columnName],
    });
  };

  const handleCloseErrorPopup = () => {
    setErrorPopupOpen(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleColumnMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {testCases.length === 0 ? (
        <h3 className="no-records-message">Nenhum caso de teste encontrado</h3>
      ) : (
        <div>
          <div className='column-selection'>
            <Button
              variant="contained"
              onClick={handleColumnMenuClick}
              sx={{ marginBottom: '10px' }}
            >
              Exibir colunas
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleColumnMenuClose}
            >
              <FormGroup>
                {Object.keys(selectedColumns).map((columnName) => (
                  <MenuItem key={columnName}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={selectedColumns[columnName as ColumnNames]}
                          onChange={() => handleColumnToggle(columnName as ColumnNames)}
                        />
                      }
                      label={columnName}
                    />
                  </MenuItem>
                ))}
              </FormGroup>
            </Menu>
          </div>
          <TransparentTableContainer>
            <table className="table-container">
              <thead >
                <tr>
                  {Object.keys(selectedColumns).map((columnName) => (
                    selectedColumns[columnName as ColumnNames] && (
                      <th key={columnName}>{columnName}</th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody >
                {testCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((testCase) => (
                  <tr key={testCase.idScenario}>
                    {Object.keys(selectedColumns).map((columnName) => (
                      selectedColumns[columnName as ColumnNames] && (
                        <td key={columnName} className="action-buttons">
                          {columnName === 'Nome do time' && testCase.idTestSuite.idTestPlan.idProduct.idTeam.nameTeam}
                          {columnName === 'Produto' && testCase.idTestSuite.idTestPlan.idProduct.descProduct}
                          {columnName === 'Plano de teste' && testCase.idTestSuite.idTestPlan.descTestPlan}
                          {columnName === 'Suite de teste' && testCase.idTestSuite.descTestSuite}
                          {columnName === 'Cenário' && testCase.titleScenario}
                          {columnName === 'Status do cenário' && testCase.descScenarioStatus}
                          {columnName === 'Automatizado?' && testCase.descAutomationStatus}
                          {columnName === 'Ações' && (
                            <OptionMenuTestCaseTable
                              idScenario={testCase.idScenario.toString()}
                              fetchTestCases={fetchTestCases}
                            />
                          )}
                        </td>
                      )
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </TransparentTableContainer>
          <TablePagination
            labelRowsPerPage="Itens por página"
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={testCases.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          />
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
