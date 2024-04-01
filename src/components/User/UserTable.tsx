import React, { useState } from 'react';
import '../../styles/Table.css';
import ErrorPopup from '../ErrorPopup';
import Toast from '../Toast';
import TablePagination from '@mui/material/TablePagination';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UserService from '../../services/UserService';
import UserModal from './UserModal';
import { getUsername } from '../../authentication/token';

export interface User {
  id: string;
  name: string;
  login: string;
  accessProfile: {
    id: string;
    name: string;
  };
  status: string;
}

interface ProductTableProps {
  users: User[];
  fetchUsers: () => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ users, fetchUsers }) => {
  const [error, setError] = useState<string>('');
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    login:string;
    accessProfile: {
      id: string;
      name: string;
    };
  } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorElMap, setAnchorElMap] = useState<{ [key: string]: HTMLElement | null }>({});

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorElMap({
      ...anchorElMap,
      [id]: event.currentTarget,
    });
  };

  const handleClose = (id: string) => {
    setAnchorElMap({
      ...anchorElMap,
      [id]: null,
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

  const handleEditUser = (user: User) => {
    const { id, name, login, accessProfile } = user;

    const formattedUser = {
      id: id,
      name: name,
      login: login,
      accessProfile: {
        id: accessProfile.id,
        name: accessProfile.name,
      },
    };

    setSelectedUser(formattedUser);
    setIsEditModalOpen(true);
  };


  const handleInactiveOrActiveUser = async (id: string, status: string) => {
    try {
      await UserService.ActiveOrInactiveUser(id, status);
      fetchUsers();
      setShowToast(true);
    } catch (err) {
      console.error('Error update user:', err);
      setError(`${err}`);
      setErrorPopupOpen(true);
    }
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
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((users) => (
                <tr key={users.id}>
                  <td>{users.name}</td>
                  <td>{users.login}</td>
                  <td>{users.accessProfile.name}</td>
                  <td>{users.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</td>
                  
                  {users.name !== getUsername() ? (
                    <td className="action-buttons">
                      <div>
                        <IconButton
                          aria-label="Opções"
                          aria-controls={`menu-options-${users.id}`}
                          aria-haspopup="true"
                          onClick={(event) => handleClick(event, users.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id={`menu-options-${users.id}`}
                          anchorEl={anchorElMap[users.id]}
                          open={Boolean(anchorElMap[users.id])}
                          onClose={() => handleClose(users.id)}
                        >
                          <MenuItem onClick={() => { users.status === 'ACTIVE' ? handleInactiveOrActiveUser(users.id, "INACTIVE") : handleInactiveOrActiveUser(users.id, "ACTIVE") }}>{users.status === 'ACTIVE' ? 'Ativar usuário' : 'Inativar usuário'}</MenuItem>
                          <MenuItem onClick={() => handleEditUser(users)}>Editar usuário</MenuItem>
                        </Menu>
                      </div>
                    </td>
                  ) : (
                    <td>Ação indisponível</td>
                  )}
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

      <UserModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        fetchUser={fetchUsers}
        selectedUser={selectedUser}
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
