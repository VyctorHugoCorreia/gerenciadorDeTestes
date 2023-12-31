import React, { useState, MouseEvent } from 'react';
import TeamService from '../../services/TimeService';
import '../../styles/Table.css'
import ErrorPopup from '../ErrorPopup';
import TeamModal from './TeamModal'; 
import Toast from '../Toast';
import TablePagination from '@mui/material/TablePagination';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';


interface Time {
  idTime: number;
  nomeTime: string;
}

interface TimeTableProps {
  times: Time[];
  fetchTimes: () => void;
}

const TimeTable: React.FC<TimeTableProps> = ({ times, fetchTimes }) => {
  const [error, setError] = useState<string>('');
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<{ id: number; name: string } | null>(null); // Estado para o time selecionado
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para controlar a abertura do modal de edição
  const [showToast, setShowToast] = useState(false); // Estado para exibir o Toast
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorElMap, setAnchorElMap] = useState<{ [key: number]: HTMLElement | null }>({});
  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLButtonElement>, testSuiteId: number) => {
    setAnchorElMap({
      ...anchorElMap,
      [testSuiteId]: event.currentTarget,
    });
  };
  
  const handleDashboard = (TeamId: number) => {
    navigate(`/dashboard/${TeamId}`);
};

  const handleClose = (testSuiteId: number) => {
    setAnchorElMap({
      ...anchorElMap,
      [testSuiteId]: null,
    });
  };
  const handleDelete = async (id: number) => {
    try {
      await TeamService.deleteTeam(id);
      fetchTimes();
      setShowToast(true); 
    } catch (error) {
      console.error(error);
      setError(`${error}`);
      setErrorPopupOpen(true);
    }
  };

  const handleCloseErrorPopup = () => {
    setErrorPopupOpen(false);
  };

  const handleEdit = (id: number, nomeTime: string) => {
    setSelectedTeam({ id, name: nomeTime });
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
      {times.length === 0 ? (
        <h3 className="no-records-message">Nenhum time foi encontrado</h3>
      ) : (
        <>
          <table className="table-container">
            <thead>
              <th>Nome do time</th>
              <th>Ações</th>
            </thead>
            <tbody>
              {times.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((time) => (
                <tr key={time.idTime}>
                  <td>{time.nomeTime}</td>
                  <td className="action-buttons">
                  <div>
                  <IconButton
                    aria-label="Opções"
                    aria-controls={`menu-options-${time.idTime}`}
                    aria-haspopup="true"
                    onClick={(event) => handleClick(event, time.idTime)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={`menu-options-${time.idTime}`}
                    anchorEl={anchorElMap[time.idTime]}
                    open={Boolean(anchorElMap[time.idTime])}
                    onClose={() => handleClose(time.idTime)}
                  >

                    <MenuItem onClick={() => handleEdit(time.idTime, time.nomeTime)}>Editar</MenuItem>
                    <MenuItem onClick={() => handleDelete(time.idTime)}>Excluir</MenuItem>
                    <MenuItem onClick={() => handleDashboard(time.idTime)}>Detalhes dashboard</MenuItem>
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
            count={times.length}
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
      <TeamModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTeam(null);
        }}
        fetchTimes={fetchTimes}
        selectedTeam={selectedTeam ?? { id: 0, name: '' }} 
      />
    </div>
  );
};

export default TimeTable;
