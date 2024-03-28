import React, { useState, useEffect, MouseEvent } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import TestCaseService from '../../services/TestCaseService';
import Toast from '../Toast';
import RefreshIcon from '@mui/icons-material/Refresh';
import TablePagination from '@mui/material/TablePagination';
import ExecuteTestCaseModal from '../TestCase/ExecuteTestCaseModal';

import { styled } from '@mui/system';

interface TestCaseModalProps {
    open: boolean;
    onClose?: () => void;
    idTestSuite: number;
    fetchTestSuites: () => void;
}

const TestCaseModal: React.FC<TestCaseModalProps> = ({ open, onClose, idTestSuite, fetchTestSuites }) => {
    const [testCases, setTestCases] = useState<any[]>([]);
    const [anchorElMap, setAnchorElMap] = useState<{ [key: number]: HTMLElement | null }>({});
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showExecuteModal, setShowExecuteModal] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(testCases.length);

    const WhiteRefreshIcon = styled(RefreshIcon)({
        color: 'white',
    });

    const handleEditTestCase = (id: number) => {
        window.open(`/edit-test-case/${id}`, '_blank');
    };

    const handleDetailsTestCase = (id: number) => {
        window.open(`/details-test-case/${id}`, '_blank');
    };

    const handleExecuteTestCase = () => {
        setShowExecuteModal(true);
    };

    const handleCloseModal = () => {
        setShowExecuteModal(false);
        fetchTestCase();
    };

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

    const fetchTestCase = async () => {
        try {
            const testCaseData = await TestCaseService.searchTestCase({ idTestSuite });
            setTestCases(testCaseData);
            setTotalItems(testCaseData.length);
        } catch (error) {
            console.error('Erro ao buscar casos de teste:', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchTestCase();
        }
    }, [open]);

    const handleDeleteTestCase = async (id: number) => {
        setLoading(true);
        try {
            await TestCaseService.deleteTestCase(id);
            fetchTestCase();
            setShowToast(true);
            fetchTestSuites();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="test-case-modal-title"
            aria-describedby="test-case-modal-description"
        >
            <div className='team-modal'>
                <h2 id="test-case-modal-title">Casos de Teste</h2>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Título do cenário</TableCell>
                                <TableCell>Status do cenário</TableCell>
                                <TableCell>Status da automação</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {testCases.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((testCase, index) => (
                                <TableRow key={index}>
                                    <TableCell>{testCase.tituloCenario}</TableCell>
                                    <TableCell>{testCase.idStatus.descStatus}</TableCell>
                                    <TableCell>{testCase.idAutomatizado.descAutomatizado}</TableCell>
                                    <TableCell className="action-buttons">
                                        <div>
                                            <IconButton
                                                aria-label="Opções"
                                                aria-controls={`menu-options-${testCase.idCenario}`}
                                                aria-haspopup="true"
                                                onClick={(event) => handleClick(event, testCase.idCenario)}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                id={`menu-options-${testCase.idCenario}`}
                                                anchorEl={anchorElMap[testCase.idCenario]}
                                                open={Boolean(anchorElMap[testCase.idCenario])}
                                                onClose={() => handleClose(testCase.idCenario)}
                                            >
                                                <MenuItem onClick={() => handleEditTestCase(testCase.idCenario)}>Editar</MenuItem>
                                                <MenuItem onClick={() => handleExecuteTestCase()}>Executar cenário</MenuItem>
                                                <MenuItem disabled={loading} onClick={() => handleDeleteTestCase(testCase.idCenario)}>{loading ? 'Excluindo...' : 'Excluir'}</MenuItem>
                                                <MenuItem onClick={() => handleDetailsTestCase(testCase.idCenario)}>Detalhes</MenuItem>
                                                <ExecuteTestCaseModal
                                                    open={showExecuteModal}
                                                    onClose={handleCloseModal}
                                                    idCenario={Number(testCase.idCenario)}
                                                />
                                            </Menu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalItems}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage="Itens por página"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                </TableContainer>

               

                <div className="button-container">
                    <IconButton onClick={fetchTestCase} className="team-modal-button">
                        <WhiteRefreshIcon />
                    </IconButton>
                </div>
                <Toast
                    message="Operação realizada com sucesso!"
                    showToast={showToast}
                    setShowToast={setShowToast}
                />
            </div>
        </Modal>
    );
};

export default TestCaseModal;
