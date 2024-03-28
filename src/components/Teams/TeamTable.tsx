import React, { useState, MouseEvent } from 'react';
import TeamService from '../../services/TeamService';
import '../../styles/Table.css'
import ErrorPopup from '../ErrorPopup';
import TeamModal from './TeamModal'; 
import Toast from '../Toast';
import TablePagination from '@mui/material/TablePagination';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';


interface Time {
  idTeam: number;
  nameTeam: string;
  scenarioQuantity: number;
}

interface TimeTableProps {
  teams: Time[];
  fetchTeams: () => void;
}

const TimeTable: React.FC<TimeTableProps> = ({ teams, fetchTeams }) => {
  const [error, setError] = useState<string>('');
  const [errorPopupOpen, setErrorPopupOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<{ idTeam: number; nameTeam: string } | null>(null); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [showToast, setShowToast] = useState(false); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorElMap, setAnchorElMap] = useState<{ [key: number]: HTMLElement | null }>({});
  const navigate = useNavigate();

  const handleClick = (event: MouseEvent<HTMLButtonElement>, idTestSuite: number) => {
    setAnchorElMap({
      ...anchorElMap,
      [idTestSuite]: event.currentTarget,
    });
  };
  
  const handleDashboard = (idTeam: number) => {
    navigate(`/dashboard/${idTeam}`);
};

  const handleClose = (idTestSuite: number) => {
    setAnchorElMap({
      ...anchorElMap,
      [idTestSuite]: null,
    });
  };
  const handleDelete = async (idTeam: number) => {
    try {
      await TeamService.deleteTeam(idTeam);
      fetchTeams();
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

  const handleEdit = (idTeam: number, nameTeam: string) => {
    setSelectedTeam({ idTeam, nameTeam: nameTeam });
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
      {teams.length === 0 ? (
        <h3 className="no-records-message">Nenhum time foi encontrado</h3>
      ) : (
        <>
          <table className="table-container">
            <thead>
              <th>Nome do time</th>
              <th>Ações</th>
            </thead>
            <tbody>
              {teams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((team) => (
                <tr key={team.idTeam}>
                  <td>{team.nameTeam}</td>
                  <td className="action-buttons">
                  <div>
                  <IconButton
                    aria-label="Opções"
                    aria-controls={`menu-options-${team.idTeam}`}
                    aria-haspopup="true"
                    onClick={(event) => handleClick(event, team.idTeam)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={`menu-options-${team.idTeam}`}
                    anchorEl={anchorElMap[team.idTeam]}
                    open={Boolean(anchorElMap[team.idTeam])}
                    onClose={() => handleClose(team.idTeam)}
                  >

                    <MenuItem onClick={() => handleEdit(team.idTeam, team.nameTeam)}>Editar</MenuItem>
                    <MenuItem onClick={() => handleDelete(team.idTeam)}>Excluir</MenuItem>
                    <MenuItem disabled={team.scenarioQuantity === 0} onClick={() => handleDashboard(team.idTeam)}>Detalhes dashboard</MenuItem>
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
            count={teams.length}
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
        fetchTeams={fetchTeams}
        selectedTeam={selectedTeam ?? { idTeam: 0, nameTeam: '' }} 
      />
    </div>
  );
};

export default TimeTable;
