// SearchBar.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import TeamsDropDown from '../Dropdown/TeamsDropDown';
import ProductDropDown from '../Dropdown/ProductDropDown';
import '../../styles/SearchBarTeams.css';
import TestPlanDropDown from '../Dropdown/TestPlanDropDown';
import TestSuiteDropDown from '../Dropdown/TestSuiteDropDown';
import ScenarioStatusDropDown from '../Dropdown/ScenarioStatusDropDown';
import ScenarioTypeDropDown from '../Dropdown/ScenarioTypeDropDown';
import PlataformTypeDropDown from '../Dropdown/PlataformTypeDropDown';
import StatusAutomationTypeDropDown from '../Dropdown/StatusAutomationDropDown';

interface Team {
  idTime: number;
  nomeTime: string;
}

export interface Product {
  idTproduto: number;
}


export interface TestPlan {
  idPlano: number;
}

export interface TestSuite {
  idSuite: number;
}

export interface ScenarioStatus {
  idStatus: number;
}

export interface ScenarioType {
  idTpcenario: number;
}

export interface PlataformType {
  idPlataforma: number;
}

export interface StatusAutomation {
  idAutomatizado: number;
}




interface SearchParams {
  searchValue: string;
  team: Team | null;
  product: Product | null;
  testPlan: TestPlan | null;
  testSuite: TestSuite | null;
  scenarioStatus: ScenarioStatus | null;
  scenarioType: ScenarioType | null;
  plataformType: PlataformType | null;
  statusAutomation: StatusAutomation | null;
}

interface SearchBarProps {
  placeholder: string;
  onSearch: (searchParams: SearchParams) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedTestPlan, setSelectedTestPlan] = useState<TestPlan | null>(null);
  const [selectedTestSuite, setSelectedTestSuite] = useState<TestSuite | null>(null);
  const [selectedScenarioStatus, setSelectedScenarioStatus] = useState<ScenarioStatus | null>(null);
  const [selectedScenarioType, setSelectedScenarioType] = useState<ScenarioType | null>(null);
  const [selectedPlataformType, setSelectedPlataformType] = useState<PlataformType | null>(null);
  const [selectedStatusAutomationType, setSelectedStatusAutomationType] = useState<StatusAutomation | null>(null);




  const handleSearch = () => {
    onSearch({
      searchValue,
      team: selectedTeam,
      product: selectedProduct,
      testPlan: selectedTestPlan,
      testSuite: selectedTestSuite,
      scenarioStatus: selectedScenarioStatus,
      scenarioType: selectedScenarioType,
      plataformType: selectedPlataformType,
      statusAutomation: selectedStatusAutomationType
    });
  };


  useEffect(() => {
    if (selectedTeam === null) {
      setSelectedProduct(null);
      setSelectedTestPlan(null);
      setSelectedTestSuite(null);
    }

    if (selectedProduct === null) {
      setSelectedTestPlan(null);
      setSelectedTestSuite(null);
    }

    if (selectedTestPlan === null) {
      setSelectedTestSuite(null);
    }
  }, [selectedTeam, selectedProduct, selectedTestPlan]);



  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const handleSelectTeam = (team: Team | string) => {
    setSelectedTeam(typeof team === 'string' ? null : team);
  };

  const handleSelectProduct = (product: Product | string | null) => {
    setSelectedProduct(typeof product === 'string' ? null : product);
  };

  const handleSelectTestPlan = (testPlan: TestPlan | null) => {
    setSelectedTestPlan(testPlan);
  };

  const handleSelectTestSuite = (testSuite: TestSuite | null) => {
    setSelectedTestSuite(testSuite);
  };

  const handleSelectScenarioStatusType = (scenarioStatus: ScenarioStatus | null) => {
    setSelectedScenarioStatus(scenarioStatus);
  };

  const handleSelectScenarioType = (scenarioType: ScenarioType | null) => {
    setSelectedScenarioType(scenarioType);
  };

  const handleSelectPlataformType = (plataformType: PlataformType | null) => {
    setSelectedPlataformType(plataformType);
  };

  const handleSelectStatusAutomationType = (statusAutomation: StatusAutomation | null) => {
    setSelectedStatusAutomationType(statusAutomation);
  };

  return (
    <div>
      <div className="dropdown-container">
        <div className='dropdown'>
          <TeamsDropDown onSelectTeam={handleSelectTeam} selectedTeam={selectedTeam?.idTime || null} />
        </div>
        <div className='dropdown'>
          <ProductDropDown
            onSelectProduct={(selectedProductId) => {
              setSelectedProductId(selectedProductId);
              handleSelectProduct(selectedProductId !== null ? { idTproduto: selectedProductId } : null);
            }}
            selectedTeamId={selectedTeam?.idTime}
            disabled={!selectedTeam}
            isEditing={false}
            resetDropdown={!selectedTeam}
            selectedProductId={selectedProductId || null}
          />
        </div>

        <div className='dropdown'>
          <TestPlanDropDown
            selectedProductId={selectedProductId}
            onSelectTestPlan={(selectedTestPlan) => handleSelectTestPlan(selectedTestPlan !== null ? { idPlano: selectedTestPlan } : null)}
            disabled={!selectedProductId}
            isEditing={false}
            selectedTestPlanId={selectedTestPlan?.idPlano || null}
          />
        </div>

        <div className='dropdown'>
          <TestSuiteDropDown
            selectedTestPlanId={selectedTestPlan?.idPlano || null}
            onSelectTestSuite={(selectedTestSuite) => handleSelectTestSuite(selectedTestSuite !== null ? { idSuite: selectedTestSuite } : null)}
            disabled={!selectedTestPlan}
            isEditing={false}
            selectedTestSuiteId={selectedTestSuite?.idSuite || null}
          />
        </div>
      </div>

      <div className='dropdown-container'>


        <div className='dropdown'>
          <ScenarioStatusDropDown
            onSelectScenarioStatus={(selectedScenarioStatus) => handleSelectScenarioStatusType(selectedScenarioStatus !== null ? { idStatus: selectedScenarioStatus } : null)}
            disabled={false}
            isEditing={true}
            selectedScenarioStatusId={selectedScenarioStatus?.idStatus || null}
          />
        </div>

        <div className='dropdown'>
          <ScenarioTypeDropDown
            onSelectScenarioType={(selectedScenarioType) => handleSelectScenarioType(selectedScenarioType !== null ? { idTpcenario: selectedScenarioType } : null)}
            disabled={false}
            isEditing={false}
            selectedScenarioTypeId={selectedScenarioType?.idTpcenario || null}
          />
        </div>

        <div className='dropdown'>
          <PlataformTypeDropDown
            onSelectPlataformType={(selectedPlataformType) => handleSelectPlataformType(selectedPlataformType !== null ? { idPlataforma: selectedPlataformType } : null)}
            disabled={false}
            isEditing={false}
            selectedPlataformTypeId={selectedPlataformType?.idPlataforma || null}
          />
        </div>


        <div className="dropdown">
          <StatusAutomationTypeDropDown
            onSelectStatusAutomationType={(selectedStatusAutomationType) => handleSelectStatusAutomationType(selectedStatusAutomationType !== null ? { idAutomatizado: selectedStatusAutomationType } : null)}
            disabled={false}
            isEditing={false}
            selectedStatusAutomationTypeId={selectedStatusAutomationType?.idAutomatizado || null}
          />
        </div>


      </div>



      <div className="search-container">
        <TextField
          className="search-field"
          variant="outlined"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
        />
        <Button
          className="search-button"
          variant="contained"
          color="primary"
          onClick={handleSearch}
        >
          Pesquisar
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
