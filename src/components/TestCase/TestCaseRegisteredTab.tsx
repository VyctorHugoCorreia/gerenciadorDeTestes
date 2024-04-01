import React, { useEffect, useState } from 'react';
import AddTestCaseButton from './AddTestCaseButton';
import TestCaseTable from './TestCaseTable';
import TestCaseService from '../../services/TestCaseService';
import SearchBar from '../searchBar/SearchBar';

interface Team {
  idTeam: number;
  nameTeam: string;
}

export interface Product {
  idProduct: number;
}

export interface TestPlan {
  idTestPlan: number;
}

export interface TestSuite {
  idTestSuite: number;
}


export interface ScenarioStatus {
  idScenarioStatus: number;
}

export interface ScenarioType {
  idScenarioType: number;
}

export interface PlataformType {
  idPlatformType: number;
}

export interface StatusAutomation {
  idAutomationStatus: number;
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
  statusAutomation: StatusAutomation  | null;
}


const TestCaseRegisteredTab: React.FC = () => {
  const [testCases, setTestCases] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>(
    {
      searchValue: '',
      team: null,
      product: null,
      testPlan: null,
      testSuite: null,
      scenarioStatus: null,
      scenarioType: null,
      plataformType: null,
      statusAutomation: null
    }
  );

  const fetchTestCases = async () => {
    try {
      const testCaseData = await TestCaseService.getAllTestCase();
      setTestCases(testCaseData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (searchParams: SearchParams) => {
    try {
      const filteredTests = await TestCaseService.searchTestCase({
        titleScenario: searchParams.searchValue,
        idTeam: searchParams.team?.idTeam ?? undefined,
        idProduct: searchParams.product?.idProduct ?? undefined,
        idTestPlan: searchParams.testPlan?.idTestPlan ?? undefined,
        idTestSuite: searchParams.testSuite?.idTestSuite ?? undefined,
        idScenarioStatus: searchParams.scenarioStatus?.idScenarioStatus ?? undefined,
        idScenarioType: searchParams.scenarioType?.idScenarioType ?? undefined,
        idPlatformType: searchParams.plataformType?.idPlatformType ?? undefined,
        idAutomationStatus: searchParams.statusAutomation?.idAutomationStatus ?? undefined
      });

      console.log(searchParams.scenarioStatus?.idScenarioStatus)
      setTestCases(filteredTests);
      setSearchParams(searchParams);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTestCases();
  }, []);

  return (
    <div>
      <AddTestCaseButton />
      <SearchBar
        placeholder="Buscar cenário de teste"
        onSearch={handleSearch}
        showTeamsDropdown
        showProductsDropdown
        showTestPlansDropdown
        showTestSuitesDropdown
        showPlataformTypeDropdown
        showScenarioStatusDropdown
        showScenarioTypeDropdown
        showStatusAutomationDropdown
      />
      <TestCaseTable testCases={testCases} fetchTestCases={fetchTestCases} />
    </div>
  );
};

export default TestCaseRegisteredTab;
