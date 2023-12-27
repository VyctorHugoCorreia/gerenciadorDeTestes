import React, { useState, useEffect, MouseEvent } from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import '../../styles/Table.css'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import TestCaseService from '../../services/TestCaseService'; // Certifique-se de importar o seu TestCaseService correto


interface TestCaseModalProps {
    open: boolean;
    onClose?: () => void;
    testSuiteId: number;
}

const TestCaseModal: React.FC<TestCaseModalProps> = ({ open, onClose, testSuiteId }) => {
    const [testCases, setTestCases] = useState<any[]>([]);
    const [anchorElMap, setAnchorElMap] = useState<{ [key: number]: HTMLElement | null }>({});

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

                                            <MenuItem onClick={() => console.log('Editar')}>Editar</MenuItem>
                                            <MenuItem onClick={() => console.log('Excluir')}>Excluir</MenuItem>
                                            <MenuItem onClick={() => console.log('Detalhes')}>Detalhes</MenuItem>
                                        </Menu>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Button variant="contained" color="primary" onClick={onClose}>
                    Fechar
                </Button>
            </div>
        </Modal>
    );
};

export default TestCaseModal;