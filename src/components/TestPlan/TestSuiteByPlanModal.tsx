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
import TestSuiteService from '../../services/TestSuiteService';
import TestCaseBySuiteModal from '../TestSuite/TestCaseBySuiteModal';
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

    const WhiteRefreshIcon = styled(RefreshIcon)({
        color: 'white',
    });


    const handleViewTestCase = async (testSuiteId: number) => {
        setSelectedTestSuiteId(testSuiteId);

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
        } catch (error) {
            console.error('Erro ao buscar suites de teste:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const testPlanData = await TestSuiteService.getTestSuitesByPlan(testPlanId);
                setTestSuites(testPlanData);
            } catch (error) {
                console.error('Erro ao buscar suites de teste:', error);
            }
        };
        if (open) {
            fetchData();
        }

    }, [open]);

    const handleDeleteTestSuite = async (id: number) => {
        setLoading(true);
        try {
            await TestSuiteService.deleteTestSuite(id);
            fetchTestPlans();
            setShowToast(true);
            fetchTestPlans();
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
                <h2 id="test-case-modal-title">Suites de Teste</h2>
                <table className="table-container">
                    <thead>
                        <tr>
                            <th>Nome da suite</th>
                            <th>Quantidade de cenários</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testSuite.map((testSuite, index) => (
                            <tr key={index}>
                                <td>{testSuite.descSuite}</td>
                                <td>{testSuite.quantidadeCenarios}</td>
                                <td className="action-buttons">
                                    <div>
                                        <IconButton
                                            aria-label="Opções"
                                            aria-controls={`menu-options-${testSuite.idSuite}`}
                                            aria-haspopup="true"
                                            onClick={(event) => handleClick(event, testSuite.idSuite)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            id={`menu-options-${testSuite.idSuite}`}
                                            anchorEl={anchorElMap[testSuite.idSuite]}
                                            open={Boolean(anchorElMap[testSuite.idSuite])}
                                            onClose={() => handleClose(testSuite.idSuite)}
                                        >

                                            <MenuItem disabled={loading} onClick={() => handleDeleteTestSuite(testSuite.idSuite)}>{loading ? 'Excluindo...' : 'Excluir'}</MenuItem>

                                            <MenuItem
                                                disabled={testSuite.quantidadeCenarios === 0}
                                                onClick={() => handleViewTestCase(testSuite.idSuite)}
                                            >
                                                Visualizar cenários
                                            </MenuItem>
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
                    <IconButton onClick={fetchTestSuite} className="team-modal-button">
                        <WhiteRefreshIcon />
                    </IconButton>
                </div>

                <Toast
                    message="Operação realizada com sucesso!"
                    showToast={showToast}
                    setShowToast={setShowToast}
                />

                {
                    selectedTestSuiteId !== null && (
                        <TestCaseBySuiteModal
                            open={true}
                            testSuiteId={selectedTestSuiteId}
                            onClose={handleCloseModal}
                            fetchTestSuites={fetchTestSuite}
                        />
                    )
                }
            </div>

        </Modal>
    );
};

export default TestSuiteModal;