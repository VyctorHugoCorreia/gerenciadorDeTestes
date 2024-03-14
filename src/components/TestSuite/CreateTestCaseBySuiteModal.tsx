import React, { useState, useEffect, useRef } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import '../../styles/AddModal.css';
import Toast from '../Toast';
import TestSuiteService from '../../services/TestSuiteService';
import ScenarioTypeDropDown from '../Dropdown/ScenarioTypeDropDown';
import ScenarioTypeInfo from '../TestCase/ScenarioTypeInfo';
import PlataformTypeDropDown from '../Dropdown/PlataformTypeDropDown';
import StatusAutomationTypeDropDown from '../Dropdown/StatusAutomationDropDown';
import DynamicList from '../DynamicList';
import ScenarioStatusDropDown from '../Dropdown/ScenarioStatusDropDown';
import TestCaseService from '../../services/TestCaseService';
import HistoryStatusScenarioService from '../../services/HistoryStatusScenarioService';
import DynamicChip from '../DynamicChip';
interface CreateTestCaseBySuiteModalProps {
    open: boolean;
    onClose?: () => void;
    testSuiteId?: number | null;
    fetchTestSuites: () => void;
}

const CreateTestCaseBySuiteModal: React.FC<CreateTestCaseBySuiteModalProps> = ({ open, onClose, testSuiteId, fetchTestSuites }) => {
    const [buttonCreatedDisabled, setButtonCreatedDisabled] = useState(true);
    const [showToast, setShowToast] = useState(false);
    const [testSuite, setTestSuite] = useState<any | null>(null);
    const [scenarioTitle, setScenarioTitle] = useState<string>('');
    const [scenarioDescription, setScenarioDescription] = useState<string>('');
    const [scenarioLink, setScenarioLink] = useState<string>('');
    const [selectedScenarioType, setSelectedScenarioType] = useState<number | null>(null);
    const [selectedPlataformType, setSelectedPlataformType] = useState<number | null>(null);
    const [selectedStatusAutomationType, setSelectedStatusAutomationType] = useState<number | null>(null);
    const [selectedScenarioStatusType, setSelectedScenarioStatusType] = useState<number | null>(null);
    const [tags, setTags] = useState<string[]>(['']);
    const [steps, setSteps] = useState<string[]>(['']);
    const [toastMessage, setToastMessage] = useState('');
    const modalRef = useRef<HTMLDivElement | null>(null); 

    const scrollToTop = () => {
        if (modalRef.current) {
            modalRef.current.scrollTop = 0;
        }
    };


    useEffect(() => {
        const isAnyFieldEmpty = () => {
            if (
                !selectedScenarioType ||
                !selectedPlataformType ||
                !selectedStatusAutomationType ||
                !selectedScenarioStatusType ||
                !scenarioTitle.trim()
            ) {
                return true;
            }
            return false;
        };
        setButtonCreatedDisabled(isAnyFieldEmpty());
    }, [
        selectedScenarioType,
        selectedPlataformType,
        selectedStatusAutomationType,
        selectedScenarioStatusType,
        scenarioTitle,
    ]);

    useEffect(() => {
        if (open && testSuiteId) {
            fetchTestSuiteById();
            clearFields();
            scrollToTop();
        }
    }, [open, testSuiteId]);

    const handleSelectScenarioType = (scenarioTypeId: number | null) => {
        setSelectedScenarioType(scenarioTypeId);
    };

    const handleSelectPlataformType = (plataformTypeId: number | null) => {
        setSelectedPlataformType(plataformTypeId);
    };

    const handleSelectStatusAutomationType = (StatusAutomationTypeId: number | null) => {
        setSelectedStatusAutomationType(StatusAutomationTypeId);
    };


    const handleSelectScenarioStatusType = (ScenarioStatusTypeId: number | null) => {
        setSelectedScenarioStatusType(ScenarioStatusTypeId);
    };

    const fetchTestSuiteById = async () => {
        try {
            const testSuiteData = await TestSuiteService.searchTestSuiteById(testSuiteId?.toString());
            setTestSuite(testSuiteData);
        } catch (error) {
            console.error('Erro ao buscar casos de teste:', error);
        }
    };

    const clearFields = () => {
        setSelectedScenarioType(null);
        setSelectedPlataformType(null);
        setSelectedStatusAutomationType(null);
        setSelectedScenarioStatusType(null);
        setScenarioTitle('');
        setScenarioDescription('');
        setScenarioLink('');
        setSteps(['']);
        setTags(['']);
    };

    const handleCadastro = async () => {
        try {
            const filteredSteps = steps.filter((step) => step.trim() !== '');
            const filteredTags = tags.filter((tag) => tag.trim() !== '');

            if (testSuite && testSuite.length > 0) {
                const data = {
                    idTime: testSuite[0]?.idTime?.idTime || 0,
                    idTproduto: testSuite[0]?.idTproduto?.idTproduto || 0,
                    idPlano: testSuite[0]?.idPlano?.idPlano || 0,
                    idSuite: testSuite[0]?.idSuite || 0,
                    idTpcenario: selectedScenarioType || 0,
                    idPlataforma: selectedPlataformType || 0,
                    idStatus: selectedScenarioStatusType || 0,
                    idAutomatizado: selectedStatusAutomationType || 0,
                    tituloCenario: scenarioTitle,
                    descCenario: scenarioDescription,
                    linkCenario: scenarioLink,
                    steps: filteredSteps.map((descricao, index) => ({
                        passo: index + 1,
                        descricao: descricao,
                    })),
                    tags: filteredTags
                };
                console.log("Dados:", data);

                const response = await TestCaseService.addTestCase(data);
                console.log(response);

                const dataHistory = {

                    idCenario: response.idCenario,
                    statusBefore: selectedScenarioStatusType || 0,
                    statusAfter: selectedScenarioStatusType || 0

                }

                const responseHistory = await HistoryStatusScenarioService.addHistoryStatusScenario(dataHistory);

                setToastMessage('Caso de teste cadastrado com sucesso!');
                setShowToast(true);
                clearFields();
                fetchTestSuites();
            }

        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateTestCase = async () => {
        try {
            await fetchTestSuiteById();
            scrollToTop();
            handleCadastro();
            setShowToast(true);
            // onClose && onClose();
        } catch (error) {
            console.error('Erro ao criar caso de teste:', error);
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
                <div className="team-modal"  ref={modalRef} >
                    <h2 id="team-modal-title">Adicionar cenário de teste</h2>

                    <div className='cardboard-style container' style={{ width: '915px', height: '100%' }}>

                        <div className="input-container">
                            <span className='span-label'>Status da execução:</span>
                            <ScenarioStatusDropDown
                                onSelectScenarioStatus={handleSelectScenarioStatusType}
                                disabled={true}
                                isEditing={false}
                                selectedScenarioStatusId={selectedScenarioStatusType}
                            />
                        </div>
                    </div>

                    <div className='cardboard-style cardboard-style-title-scenario container'>
                        <div className="text-field-container">
                            <span className='span-label'>Titulo do cenário:</span>
                            <TextField
                                value={scenarioTitle}
                                onChange={(e) => setScenarioTitle(e.target.value)}
                                placeholder="Digite o título do cenário"
                            />
                        </div>

                        <div className="text-field-container">
                            <span className='span-label'>Descrição do cenário: (Opcional)</span>
                            <TextField
                                value={scenarioDescription}
                                onChange={(e) => setScenarioDescription(e.target.value)}
                                placeholder="Digite a descrição do cenário"
                            />
                        </div>

                        <div className="text-field-container">
                            <span className='span-label'>Link do card a ser validado: (Opcional)</span>
                            <TextField
                                value={scenarioLink}
                                onChange={(e) => setScenarioLink(e.target.value)}
                                placeholder="Digite o link do card a ser validado"
                            />
                        </div>

                        <div className="text-field-container">
                            <span className='span-label'>Tags:</span>
                            <DynamicChip items={tags} setItems={setTags} />
                        </div>
                    </div>

                    <div className='cardboard-style container' style={{ width: '915px', height: '100%' }}>
                        <div className="text-field-container">
                            <span className='span-label'>Passo a passo:</span>
                            <DynamicList items={steps} setItems={setSteps} />
                        </div>
                    </div>




                    <div className='cardboard-style container'>
                        <div className="input-container">
                            <span className='span-label'>Selecione o tipo de cenário:</span>
                            <ScenarioTypeDropDown
                                onSelectScenarioType={handleSelectScenarioType}
                                disabled={false}
                                isEditing={false}
                                selectedScenarioTypeId={selectedScenarioType}
                            />
                            <ScenarioTypeInfo />
                        </div>

                        <div className="input-container">
                            <span className='span-label'>Selecione a plataforma a ser validada:</span>
                            <PlataformTypeDropDown
                                onSelectPlataformType={handleSelectPlataformType}
                                disabled={false}
                                isEditing={false}
                                selectedPlataformTypeId={selectedPlataformType}
                            />
                        </div>

                        <div className="input-container">
                            <span className='span-label'>Cenário automatizado?</span>
                            <StatusAutomationTypeDropDown
                                onSelectStatusAutomationType={handleSelectStatusAutomationType}
                                disabled={false}
                                isEditing={false}
                                selectedStatusAutomationTypeId={selectedStatusAutomationType}
                            />
                        </div>


                    </div>

                    <div className="button-container">
                        <Button
                            className="team-modal-button"
                            variant="contained"
                            color="primary"
                            onClick={handleCreateTestCase}
                            disabled={buttonCreatedDisabled}
                        >
                            Cadastrar
                        </Button>
                    </div>

                    {showToast && (
                        <div>
                            <Toast
                                message="Operação realizada com sucesso!"
                                showToast={showToast}
                                setShowToast={setShowToast}
                            />
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );

};

export default CreateTestCaseBySuiteModal;
