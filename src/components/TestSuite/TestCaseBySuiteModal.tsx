import React, { useState, useEffect, MouseEvent } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import '../../styles/Table.css'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import TestCaseService from '../../services/TestCaseService';
import Toast from '../Toast';
import RefreshIcon from '@mui/icons-material/Refresh';
import { styled } from '@mui/system';

import ExecuteTestCaseModal from '../TestCase/ExecuteTestCaseModal';
interface TestCaseModalProps {
    open: boolean;
    onClose?: () => void;
    testSuiteId: number;
    fetchTestSuites: () => void;
}

const TestCaseModal: React.FC<TestCaseModalProps> = ({ open, onClose, testSuiteId, fetchTestSuites }) => {
    const [testCases, setTestCases] = useState<any[]>([]);
    const [anchorElMap, setAnchorElMap] = useState<{ [key: number]: HTMLElement | null }>({});
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showExecuteModal, setShowExecuteModal] = useState(false);

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
    const fetchTestCase = async () => {
        try {
            const testCaseData = await TestCaseService.searchTestCaseByIdSuite(testSuiteId);
            setTestCases(testCaseData);
        } catch (error) {
            console.error('Erro ao buscar casos de teste:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const testCaseData = await TestCaseService.searchTestCaseByIdSuite(testSuiteId);
                setTestCases(testCaseData);
            } catch (error) {
                console.error('Erro ao buscar casos de teste:', error);
            }
        };
        if (open) {
            fetchData();
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
        }
        finally {
            setLoading(false);
        }

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
                <table className="table-container">
                    <thead>
                        <tr>
                            <th>Título do Cenário</th>
                            <th>Status do Cenário</th>
                            <th>Status Automatizado</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testCases.map((testCase, index) => (
                            <tr key={index}>
                                <td>{testCase.tituloCenario}</td>
                                <td>{testCase.idStatus.descStatus}</td>
                                <td>{testCase.idAutomatizado.descAutomatizado}</td>
                                <td className="action-buttons">
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
                                </td>
                            </tr>

                        ))}
                    </tbody>

                </table>
                <div className="button-container">
                    <Button variant="contained" onClick={onClose} className="team-modal-button">
                        Fechar
                    </Button>
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