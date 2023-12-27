import React, { useEffect, useState } from 'react';
import '../../styles/Table.css';
import ErrorPopup from '../ErrorPopup';
import TestSuiteModal from '../TestSuite/TestSuiteModal';
import TestSuiteService from '../../services/TestSuiteService';
import Toast from '../Toast';
import TablePagination from '@mui/material/TablePagination';

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
  };
  quantidadeCenarios: number;
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
    idPlano: {
      idPlano: number;
      descPlano: string;
    };
    quantidadeCenarios: number;

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
    const { idSuite, descSuite, idTime, idTproduto, idPlano, quantidadeCenarios } = testSuite;

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
      },
      quantidadeCenarios: quantidadeCenarios
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
    setPage(0); // Resetar para a primeira página ao alterar a quantidade de itens por página
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
            <tr key={testSuite.idSuite}>
              <td>{testSuite.idTime.nomeTime}</td>
              <td>{testSuite.idTproduto.descProduto}</td>
              <td>{testSuite.idPlano.descPlano}</td>
              <td>{testSuite.descSuite}</td>
              <td>{testSuite.quantidadeCenarios}</td>
              <td className="action-buttons">
                <button onClick={() => handleEditTestSuite(testSuite)}>Editar</button>
                <button onClick={() => handleDeleteTestSuite(testSuite.idSuite)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={testSuites.length} // Total de itens para a paginação
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
    </div>
  );
};

export default TestSuiteTable;
