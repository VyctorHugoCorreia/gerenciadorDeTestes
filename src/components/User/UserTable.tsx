import React, { useState } from 'react';
import '../../styles/Table.css';
import ErrorPopup from '../ErrorPopup';
import Toast from '../Toast';
import TablePagination from '@mui/material/TablePagination';

export interface User {
  id: string;
  nome: string;
  login: string;
  perfilDeAcesso: {
    id: string;
    nome: string;
  };
}

interface ProductTableProps {
  users: User[];
  fetchUsers: () => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ users, fetchUsers }) => {
  const [error, setError] = useState<string>('');
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
    idTime: {
      idTime: number;
      nomeTime: string;
    };
  } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorElMap, setAnchorElMap] = useState<{ [key: number]: HTMLElement | null }>({});



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

  return (
    <div>
      {users.length === 0 ? (
        <h3 className="no-records-message">Nenhum usuário foi encontrado</h3>
      ) : (
        <>
          <table className="table-container">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Login</th>
                <th>Perfil de acesso</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((users) => (
                <tr key={users.id}>
                  <td>{users.nome}</td>
                  <td>{users.login}</td>
                  <td>{users.perfilDeAcesso.nome}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={users.length}
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

      <Toast
        message="Operação realizada com sucesso!"
        showToast={showToast}
        setShowToast={setShowToast}
      />
    </div>
  );
};

export default ProductTable;
