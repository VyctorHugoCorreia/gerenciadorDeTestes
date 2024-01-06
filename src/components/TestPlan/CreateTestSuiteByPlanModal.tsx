import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../../styles/AddModal.css';
import Toast from '../Toast';
import TestCaseService from '../../services/TestCaseService';
import TestPlanService from '../../services/TestPlanService';
import TestSuiteService from '../../services/TestSuiteService';
interface CreateTestSuiteByPlanModalProps {
    open: boolean;
    onClose?: () => void;
    testPlanId?: number | null;
    fetchTestPlans: () => void;
}

const CreateTestSuiteByPlanModal: React.FC<CreateTestSuiteByPlanModalProps> = ({ open, onClose, testPlanId, fetchTestPlans }) => {
    const [buttonCreatedDisabled, setButtonCreatedDisabled] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [testPlan, setTestPlan] = useState<any | null>(null);
    const [testSuiteTitle, setTestSuiteTitle] = useState<string>('');
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        const isAnyFieldEmpty = () => {
            if (
                !testSuiteTitle.trim()
            ) {
                return true;
            }
            return false;
        };
        setButtonCreatedDisabled(isAnyFieldEmpty());
    }, [
        testSuiteTitle
    ]);

    useEffect(() => {
        if (open && testPlanId) {
            fetchTestPlanById();
            clearFields();
        }
    }, [open, testPlanId]);


    const fetchTestPlanById = async () => {
        try {
            const testPlanData = await TestPlanService.getTestPlansById(testPlanId?.toString());
            setTestPlan(testPlanData);
        } catch (error) {
            console.error('Erro ao buscar casos de teste:', error);
        }
    };

    const clearFields = () => {
        setTestSuiteTitle('');
    };

    const handleCadastro = async () => {
        try {

            if (testPlan && testPlan.length > 0) {
                const data = {
                    idTime: testPlan[0]?.idTime.idTime || 0,
                    idTproduto: testPlan[0]?.idTproduto.idTproduto || 0,
                    idPlano: testPlanId,
                    descSuite: testSuiteTitle,
                };
                console.log("Dados:", data);

                const response = await TestSuiteService.addTestSuite(data);
                console.log(response);

                setToastMessage('suite de teste cadastrado com sucesso!');
                setShowToast(true);
                clearFields();
                fetchTestPlans();
            }

        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateTestSuite = async () => {
        try {
            await fetchTestPlanById();
            handleCadastro();
            setShowToast(true);
        } catch (error) {
            console.error('Erro ao criar suite de teste:', error);
        }
    };

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="team-modal-title"
                aria-describedby="team-modal-description"
            >
                <div className="team-modal">
                    <h2 id="team-modal-title">Adicionar suite de teste</h2>

                    <TextField
                        className="team-modal-input"
                        value={testSuiteTitle}
                        onChange={(e) => setTestSuiteTitle(e.target.value)}
                        placeholder="Digite o nome da suite de testes"
                    />

                    <div className="button-container">
                        <Button
                            className="team-modal-button"
                            variant="contained"
                            color="primary"
                            onClick={onClose}
                        >
                            Voltar
                        </Button>
                        <Button
                            className="team-modal-button"
                            variant="contained"
                            color="primary"
                            onClick={handleCreateTestSuite}
                            disabled={buttonCreatedDisabled}
                        >
                            Cadastrar
                        </Button>
                    </div>

                </div>
            </Modal>

            {showToast && (
                <div>
                    <Toast
                        message="Operação realizada com sucesso!"
                        showToast={showToast}
                        setShowToast={setShowToast}
                    />
                </div>
            )}
        </>
    );

};

export default CreateTestSuiteByPlanModal;
