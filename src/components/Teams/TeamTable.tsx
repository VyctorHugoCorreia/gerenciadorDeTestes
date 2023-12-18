import React, { useState } from 'react';
import TeamService from '../../services/TimeService';
import '../../styles/Teams/TimeTable.css'
import ErrorPopup from '../ErrorPopup';
import TeamModal from './TeamModal'; // Importe o componente TeamModal

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

  const handleDelete = async (id: number) => {
    try {
      await TeamService.deleteTeam(id);
      fetchTimes();
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
    setSelectedTeam({ id, name: nomeTime }); // Define o time selecionado
    setIsEditModalOpen(true); // Abre o modal de edição
  };

  return (
    <div>
      {times.length === 0 ? (
        <h3 className="no-records-message">Nenhum time foi encontrado</h3>
      ) : (
        <table className="table-container">
        <thead>
          <th>Nome do time</th>
          <th>Ações</th>
        </thead>
          <tbody>
            {times.map((time) => (
              <tr key={time.idTime}>
                <td>{time.nomeTime}</td>
                <td className="action-buttons">
                  <button onClick={() => handleEdit(time.idTime, time.nomeTime)}>Editar</button>
                  <button onClick={() => handleDelete(time.idTime)}>Excluir</button>
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

      {/* Modal de edição */}
      <TeamModal
     open={isEditModalOpen}
     onClose={() => {
       setIsEditModalOpen(false);
       setSelectedTeam(null); // Limpa o time selecionado ao fechar o modal
     }}
     fetchTimes={fetchTimes}
     selectedTeam={selectedTeam ?? { id: 0, name: '' }} // Adicionando o operador ?? para fornecer um objeto vazio se selectedTeam for null
   />
   
    </div>
  );
};

export default TimeTable;
