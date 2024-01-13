import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TestCase.css';
import TeamsDropDown from '../components/Dropdown/TeamsDropDown';
import ProductDropDown from '../components/Dropdown/ProductDropDown';
import FeatureDropDown from '../components/Dropdown/FeatureDropDown';
import TestPlanDropDown from '../components/Dropdown/TestPlanDropDown';
import TestSuiteDropDown from '../components/Dropdown/TestSuiteDropDown';
import ScenarioTypeDropDown from '../components/Dropdown/ScenarioTypeDropDown';
import PlataformTypeDropDown from '../components/Dropdown/PlataformTypeDropDown';
import StatusAutomationTypeDropDown from '../components/Dropdown/StatusAutomationDropDown';
import ScenarioStatusDropDown from '../components/Dropdown/ScenarioStatusDropDown';
import DynamicList from '../components/DynamicList';
import Toast from '../components/Toast';
import TextField from '@mui/material/TextField';
import TestCaseService from '../services/TestCaseService';
import ScenarioTypeInfo from '../components/TestCase/ScenarioTypeInfo';
import DynamicChip from '../components/DynamicChip';

interface SelectedTeam {
    idTime: number;
    nomeTime: string;
}

interface EditTestCaseProps {
    testCaseId?: string;
}


const EditTestCaseScreen: React.FC<EditTestCaseProps> = ({ testCaseId }) => {
    const [buttonCreatedDisabled, setButtonCreatedDisabled] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
    const [resetProductDropdown, setResetProductDropdown] = useState(false);
    const [selectedTestPlan, setSelectedTestPlan] = useState<number | null>(null);
    const [selectedTestSuite, setSelectedTestSuite] = useState<number | null>(null);
    const [selectedScenarioType, setSelectedScenarioType] = useState<number | null>(null);
    const [selectedPlataformType, setSelectedPlataformType] = useState<number | null>(null);
    const [selectedStatusAutomationType, setSelectedStatusAutomationType] = useState<number | null>(null);
    const [selectedScenarioStatusType, setSelectedScenarioStatusType] = useState<number | null>(null);
    const [jsonResult, setJsonResult] = useState<string>('');
    const [scenarioTitle, setScenarioTitle] = useState<string>('');
    const [scenarioDescription, setscenarioDescription] = useState<string>('');
    const [scenarioLink, setscenarioLink] = useState<string>('');
    const [steps, setSteps] = useState<string[]>(['']);
    const [tags, setTags] = useState<string[]>(['']);
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const idCenario = testCaseId ? parseInt(testCaseId, 10) : undefined; // Converta para número ou deixe como undefined


    const handleSelectTeam = (team: number | SelectedTeam | null | string) => {
        if (typeof team === 'string' || team === null) {
            setSelectedTeam(null);
            setResetProductDropdown(true);
            setSelectedProductId(null);
        } else if (typeof team !== 'number') {
            setSelectedTeam(team.idTime);
        }
    };

    const handleSelectProduct = (productId: number | null) => {
        setSelectedProductId(productId);
        setSelectedFeature(null);
        setSelectedTestSuite(null)
        setSelectedTestPlan(null)
    };

    const handleSelectFeature = (featureId: number | null) => {
        setSelectedFeature(featureId);
    };

    const handleSelectTestPlan = (testPlanId: number | null) => {
        setSelectedTestPlan(testPlanId);
    };

    const handleSelectTestSuite = (testSuiteId: number | null) => {
        setSelectedTestSuite(testSuiteId);
    };

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


    useEffect(() => {
        const fetchTestCase = async () => {
            try {
                const testCaseDetails = await TestCaseService.searchTestCase({ idCenario });
                console.log(testCaseDetails)
                if (testCaseDetails.length > 0) {
                    const firstTestCase = testCaseDetails[0];

                    setSelectedTeam(firstTestCase.idTime?.idTime || null);
                    setSelectedProductId(firstTestCase.idTproduto?.idTproduto || null);
                    setSelectedFeature(firstTestCase.idFuncionalidade?.idFuncionalidade || null);
                    setSelectedTestPlan(firstTestCase.idPlano?.idPlano || null);
                    setSelectedTestSuite(firstTestCase.idSuite?.idSuite || null);
                    setSelectedScenarioType(firstTestCase.idTpcenario?.idTpcenario || null);
                    setSelectedPlataformType(firstTestCase.idPlataforma?.idPlataforma || null);
                    setSelectedStatusAutomationType(firstTestCase.idAutomatizado?.idAutomatizado || null);
                    setSelectedScenarioStatusType(firstTestCase.idStatus?.idStatus || null);
                    setScenarioTitle(firstTestCase.tituloCenario || '');
                    setscenarioDescription(firstTestCase.descCenario || '');
                    setscenarioLink(firstTestCase.linkCenario || '');
                    setSteps(firstTestCase.steps && firstTestCase.steps.length > 0 ? firstTestCase.steps.map((step: { descricao: string }) => step.descricao) : ['']);
                    setTags(firstTestCase.tags && firstTestCase.tags.length > 0 ? firstTestCase.tags : ['']);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchTestCase();
    }, [idCenario]);


    const handleEdit = async () => {
        try {
            const filteredSteps = steps.filter((step) => step.trim() !== '');
            const filteredTags = tags.filter((tag) => tag.trim() !== '');

            const data = {
                idTime: selectedTeam || 0,
                idPlano: selectedTestPlan || 0,
                idSuite: selectedTestSuite || 0,
                idTproduto: selectedProductId || 0,
                idFuncionalidade: selectedFeature || 0,
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
                tags: filteredTags,
            };

            setJsonResult(JSON.stringify(data, null, 2));

            if (idCenario != null) {
                await TestCaseService.updateTestCase(idCenario, data);
                setToastMessage('Caso de teste editado com sucesso!');
                setShowToast(true);

            }

        } catch (error) {
            console.error(error);
            setToastMessage('Erro ao editar o caso de teste. Tente novamente mais tarde.');
            setShowToast(true);
        }
    };




    const handleVoltar = () => {
        const confirmation = window.confirm('Tem certeza que deseja sair? As alterações não salvas serão perdidas.');

        if (confirmation) {
            navigate('/cenarios-de-teste');
        }
    };

    useEffect(() => {
        const confirmExit = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';

            return 'Tem certeza que deseja sair? As alterações não salvas serão perdidas.';
        };

        window.addEventListener('beforeunload', confirmExit);

        return () => {
            window.removeEventListener('beforeunload', confirmExit);
        };
    }, []);

    useEffect(() => {
        const isAnyFieldEmpty = () => {
            if (
                !selectedTeam ||
                !selectedProductId ||
                !selectedTestPlan ||
                !selectedTestSuite ||
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
        selectedTeam,
        selectedProductId,
        selectedTestPlan,
        selectedTestSuite,
        selectedScenarioType,
        selectedPlataformType,
        selectedStatusAutomationType,
        selectedScenarioStatusType,
        scenarioTitle,
    ]);

    return (
        <div>
            <div className='cardboard-style container'>
                <div className="input-container">
                    <span className='span-label'>Selecione o time:</span>
                    <TeamsDropDown
                        onSelectTeam={handleSelectTeam}
                        selectedTeam={selectedTeam}
                        disabled={false}
                    />
                </div>

                <div className="input-container">
                    <span className='span-label'>Selecione o produto:</span>
                    <ProductDropDown
                        onSelectProduct={handleSelectProduct}
                        selectedTeamId={selectedTeam}
                        disabled={!selectedTeam}
                        isEditing={false}
                        resetDropdown={resetProductDropdown}
                        selectedProductId={selectedProductId}
                    />
                </div>

                <div className="input-container">
                    <span className='span-label'>Selecione a funcionalidade:</span>
                    <FeatureDropDown
                        selectedProductId={selectedProductId}
                        onSelectFeature={handleSelectFeature}
                        disabled={!selectedProductId}
                        isEditing={false}
                        selectedFeatureId={selectedFeature}
                    />
                </div>

                <div className="input-container">
                    <span className='span-label'>Selecione o plano de teste:</span>
                    <TestPlanDropDown
                        selectedProductId={selectedProductId}
                        onSelectTestPlan={handleSelectTestPlan}
                        disabled={!selectedProductId}
                        isEditing={true}
                        selectedTestPlanId={selectedTestPlan}
                    />
                </div>

                <div className="input-container">
                    <span className='span-label'>Selecione a suíte de testes:</span>
                    <TestSuiteDropDown
                        selectedTestPlanId={selectedTestPlan}
                        onSelectTestSuite={handleSelectTestSuite}
                        disabled={!selectedTestPlan}
                        isEditing={true}
                        selectedTestSuiteId={selectedTestSuite}
                    />
                </div>

                <div className="input-container">
                    <span className='span-label'>Status da execução:</span>
                    <ScenarioStatusDropDown
                        onSelectScenarioStatus={handleSelectScenarioStatusType}
                        disabled={true}
                        isEditing={true}
                        selectedScenarioStatusId={selectedScenarioStatusType}
                    />
                </div>
            </div>

            <div className='cardboard-style cardboard-style-title-scenario container'>

                <div className="text-field-container ">
                    <span className='span-label'>Titulo do cenário:</span>
                    <TextField
                        value={scenarioTitle}
                        onChange={(e) => setScenarioTitle(e.target.value)}
                        placeholder="Digite o título do cenário"
                    />
                </div>

                <div className="text-field-container">
                    <span className='span-label'>Descrição do cenário: (Opcional) </span>
                    <TextField
                        value={scenarioDescription}
                        onChange={(e) => setscenarioDescription(e.target.value)}
                        placeholder="Digite a descrição do cenário"
                    />
                </div>


                <div className="text-field-container ">
                    <span className='span-label'>Link do card a ser validado (opcional): </span>
                    <TextField
                        value={scenarioLink}
                        onChange={(e) => setscenarioLink(e.target.value)}
                        placeholder="Digite o link do card a ser validado"
                    />

                </div>

                <div className="text-field-container ">
                    <span className='span-label'>Tags:</span>
                    <DynamicChip items={tags} setItems={setTags} />
                </div>

            </div>

            <div className='cardboard-style container'>
                <div className="text-field-container ">
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
                <button className="voltar-button" onClick={handleVoltar}>Voltar</button>
                <button className="cadastrar-button" onClick={handleEdit} disabled={buttonCreatedDisabled} >
                    Editar
                </button>
            </div>

            <Toast message={toastMessage} showToast={showToast} setShowToast={setShowToast} />
        </div>
    );
};

export default EditTestCaseScreen;
