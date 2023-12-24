import React, { useState, useEffect, useCallback } from 'react';
import '../../styles/TestCase.css';
import TeamsDropDown from '../Dropdown/TeamsDropDown';
import ProductDropDown from '../Dropdown/ProductDropDown';
import FeatureDropDown from '../Dropdown/FeatureDropDown';
import TestPlanDropDown from '../Dropdown/TestPlanDropDown';
import TestSuiteDropDown from '../Dropdown/TestSuiteDropDown';
import ScenarioTypeDropDown from '../Dropdown/ScenarioTypeDropDown';
import PlataformTypeDropDown from '../Dropdown/PlataformTypeDropDown';
import StatusAutomationTypeDropDown from '../Dropdown/StatusAutomationDropDown';
import ScenarioStatusDropDown from '../Dropdown/ScenarioStatusDropDown';
import TextField from '@mui/material/TextField';

interface SelectedTeam {
  idTime: number;
  nomeTime: string;
}

const CreateTestCase: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [resetProductDropdown, setResetProductDropdown] = useState(false);
  const [selectedTestPlan, setSelectedTestPlan] = useState<number | null>(null);
  const [selectedTestSuite, setSelectedTestSuite] = useState<number | null>(null);
  const [selectedScenarioType, setSelectedScenarioType] = useState<number | null>(null); // Estado para o ID do tipo de cenário selecionado
  const [selectedPlataformType, setSelectedPlataformType] = useState<number | null>(null); // Estado para o ID do tipo de cenário selecionado
  const [selectedStatusAutomationType, setSelectedStatusAutomationType] = useState<number | null>(null); // Estado para o ID do tipo de cenário selecionado
  const [selectedScenarioStatusType, setSelectedScenarioStatusType] = useState<number | null>(null); // Estado para o ID do tipo de cenário selecionado
  const [jsonResult, setJsonResult] = useState<string>('');
  const [scenarioTitle, setScenarioTitle] = useState<string>(''); // Estado para o título do cenário
  const [scenarioDescription, setscenarioDescription] = useState<string>(''); // Estado para o título do cenário
  const [scenarioLink, setscenarioLink] = useState<string>(''); // Estado para o título do cenário



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


  const handleCadastro = () => {
    // Construindo o objeto com os estados atuais dos componentes
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
      scenarioTitle: scenarioTitle,
      scenarioDescription: scenarioDescription,
      scenarioLink: scenarioLink
    };

    // Atualizando o estado para exibir o JSON resultante
    setJsonResult(JSON.stringify(data, null, 2));
  };

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
            isEditing={false}
            selectedTestPlanId={selectedTestPlan}
          />
        </div>

        <div className="input-container">
          <span className='span-label'>Selecione a suíte de testes:</span>
          <TestSuiteDropDown
            selectedTestPlanId={selectedTestPlan}
            onSelectTestSuite={handleSelectTestSuite}
            disabled={!selectedTestPlan}
            isEditing={false}
            selectedTestSuiteId={selectedTestSuite}
          />
        </div>
        
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

      <div className='cardboard-style container'>

        <div className="text-field-container ">
          <span className='span-label'>Titulo do cenário:</span>
          <TextField
           className='text-field'
            value={scenarioTitle}
            onChange={(e) => setScenarioTitle(e.target.value)}
            placeholder="Digite o título do cenário"
          />
        </div>

        <div className="text-field-container ">
          <span className='span-label'>Descrição do cenário: (Opcional) </span>
          <TextField
          className='text-field'
            value={scenarioDescription}
            onChange={(e) => setscenarioDescription(e.target.value)}
            placeholder="Digite a descrição do cenário"
          />
        </div>

        <div className="text-field-container ">
          <span className='span-label'>Link do card a ser validado (opcional): </span>
          <TextField
          className='text-field'
            value={scenarioLink}
            onChange={(e) => setscenarioLink(e.target.value)}
            placeholder="Digite o link do card a ser validado"
          />
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
    </div>
  );
};

export default CreateTestCase;
