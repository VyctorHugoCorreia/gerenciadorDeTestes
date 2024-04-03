import React, { useState, useEffect, MouseEvent } from 'react';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import TestSuiteService from '../../services/TestSuiteService';
import Toast from '../Toast';
import RefreshIcon from '@mui/icons-material/Refresh';
import TablePagination from '@mui/material/TablePagination';
import TestCaseBySuiteModal from '../TestSuite/TestCaseBySuiteModal';
import CreateTestCaseBySuiteModal from '../TestSuite/CreateTestCaseBySuiteModal';

import { styled } from '@mui/system';

interface TestSuiteModalProps {
    open: boolean;
    onClose?: () => void;
    testPlanId: number;
    fetchTestPlans: () => void;
}

const TestSuiteModal: React.FC<TestSuiteModalProps> = ({ open, onClose, testPlanId, fetchTestPlans }) => {
    const [testSuite, setTestSuites] = useState<any[]>([]);
    const [anchorElMap, setAnchorElMap] = useState<{ [key: number]: HTMLElement | null }>({});
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedTestSuiteId, setSelectedTestSuiteId] = useState<number | null>(null);
    const [isCreateTestCaseModalOpen, setIsCreateTestCaseModalOpen] = useState(false);
    const [selectedCreateTestSuiteId, setSelectedCreateTestSuiteId] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(testSuite.length);

    const WhiteRefreshIcon = styled(RefreshIcon)({
        color: 'white',
    });

    const handleViewTestCase = async (testSuiteId: number) => {
        setSelectedTestSuiteId(testSuiteId);
    };

    const handleCreateTestCase = async (testSuiteId: number) => {
        setIsCreateTestCaseModalOpen(true)
        setSelectedCreateTestSuiteId(testSuiteId);
    };

    const handleCloseModal = () => {
        setSelectedTestSuiteId(null);
        fetchTestSuite();
    };

    const handleClick = (event: MouseEvent<HTMLButtonElement>, testSuiteId: number) => {
        setAnchorElMap({
            ...anchorElMap,
            [testSuiteId]: event.currentTarget,
        });
    };

    const handleClose = (testSuiteId: number) => {
        setAnchorElMap({
            ...anchorElMap,
            [testSuiteId]: null,
        });
    };

    const fetchTestSuite = async () => {
        try {
            const testSuiteData = await TestSuiteService.getTestSuitesByPlan(testPlanId);
            setTestSuites(testSuiteData);
            setTotalItems(testSuiteData.length);
        } catch (error) {
            console.error('Erro ao buscar suites de teste:', error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchTestSuite();
        }
    }, [open]);

    const handleDeleteTestSuite = async (id: number) => {
        setLoading(true);
        try {
            await TestSuiteService.deleteTestSuite(id);
            fetchTestPlans();
            setShowToast(true);
            fetchTestSuite();

        } catch (error) {
            console.error(error);
        }
        finally {
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
                <h2 id="test-case-modal-title">Suites de Teste</h2>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome da suite</TableCell>
                                <TableCell>Quantidade de cenários</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {testSuite.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((testSuite, index) => (
                                <TableRow key={index}>
                                    <TableCell>{testSuite.descTestSuite}</TableCell>
                                    <TableCell>{testSuite.scenarioQuantity}</TableCell>
                                    <TableCell className="action-buttons">
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

                                                <MenuItem disabled={loading} onClick={() => handleDeleteTestSuite(testSuite.idTestSuite)}>{loading ? 'Excluindo...' : 'Excluir'}</MenuItem>

                                                <MenuItem
                                                    disabled={testSuite.scenarioQuantity === 0}
                                                    onClick={() => handleViewTestCase(testSuite.idTestSuite)}
                                                >
                                                    Visualizar cenários
                                                </MenuItem>
                                                <MenuItem onClick={() => handleCreateTestCase(testSuite.idTestSuite)}>Cadastrar cenário</MenuItem>
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
                    <IconButton onClick={fetchTestSuite} className="team-modal-button">
                        <WhiteRefreshIcon />
                    </IconButton>
                </div> 
                <Toast
                    message="Operação realizada com sucesso!"
                    showToast={showToast}
                    setShowToast={setShowToast}
                />

                {selectedTestSuiteId !== null && (
                    <TestCaseBySuiteModal
                        open={true}
                        idTestSuite={selectedTestSuiteId}
                        onClose={handleCloseModal}
                        fetchTestSuites={fetchTestSuite}
                    />
                )}

                {isCreateTestCaseModalOpen && (
                    <CreateTestCaseBySuiteModal
                        open={isCreateTestCaseModalOpen}
                        onClose={() => setIsCreateTestCaseModalOpen(false)}
                        idTestSuite={selectedCreateTestSuiteId}
                        fetchTestSuites={fetchTestSuite}
                    />
                )}
            </div>

        </Modal>
    );
};

export default TestSuiteModal;
