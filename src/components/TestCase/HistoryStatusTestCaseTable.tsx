import React, { useState, useEffect } from 'react';
import '../../styles/Table.css';
import TablePagination from '@mui/material/TablePagination';
import HistoryStatusScenarioService from '../../services/HistoryStatusScenarioService';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface HistoryStatus {
  idHistory: number;
  statusBefore: { descStatus: string };
  statusAfter: { descStatus: string };
  dateUpdate: string;
}

interface HistoryStatusTestCaseTableProps {
  idCenario: string;
}

const HistoryStatusTestCaseTable: React.FC<HistoryStatusTestCaseTableProps> = ({ idCenario }) => {
  const [historyStatuScenario, setHistoryStatuScenario] = useState<Array<HistoryStatus>>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function formatDate(dateString: string) {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    const formattedDate = new Date(dateString).toLocaleString('pt-BR', options as Intl.DateTimeFormatOptions);
    return formattedDate;
  }



  useEffect(() => {
    const fetchData = async () => {
      try {
        const historyData = await HistoryStatusScenarioService.searchHistoryByTestCaseId(idCenario);

        const sortedHistory = historyData.sort((a: HistoryStatus, b: HistoryStatus) => {
          return new Date(b.dateUpdate).getTime() - new Date(a.dateUpdate).getTime();
        });

        setHistoryStatuScenario(sortedHistory);
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };

    fetchData();
  }, [idCenario]);


  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Histórico de Status da execução</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {historyStatuScenario.length === 0 ? (
            <Typography className="no-records-message">Nenhum histórico encontrado</Typography>
          ) : (
            <>
              <table className="table-container">
                <thead>
                  <tr>
                    <th>Status anterior</th>
                    <th>Status atualizado</th>
                    <th>Data de atualização</th>
                  </tr>
                </thead>
                <tbody>
                  {historyStatuScenario.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((history) => (
                    <tr key={history.idHistory}>
                      <td>{history.statusBefore.descStatus}</td>
                      <td>{history.statusAfter.descStatus}</td>
                      <td>{formatDate(history.dateUpdate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={historyStatuScenario.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Itens por página"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              />
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default HistoryStatusTestCaseTable;
