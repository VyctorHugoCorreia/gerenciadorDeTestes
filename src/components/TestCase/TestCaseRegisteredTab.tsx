// TestCaseRegisteredTab.tsx
import React, { useEffect, useState } from 'react';
import AddTestCaseButton from './AddTestCaseButton';
import TestCaseTable from './TestCaseTable';
import TestCaseService from '../../services/TestCaseService';
import SearchBarTestCase from '../searchBar/SearchBarTestCase';

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
        tituloCenario: searchParams.searchValue,
        idTime: searchParams.team?.idTime ?? undefined,
        idTproduto: searchParams.product?.idTproduto ?? undefined,
        idPlano: searchParams.testPlan?.idPlano ?? undefined,
        idSuite: searchParams.testSuite?.idSuite ?? undefined,
        idStatus: searchParams.scenarioStatus?.idStatus ?? undefined,
        idTpcenario: searchParams.scenarioType?.idTpcenario ?? undefined,
        idPlataforma: searchParams.plataformType?.idPlataforma ?? undefined,
        idAutomatizado: searchParams.statusAutomation?.idAutomatizado ?? undefined
      });

      console.log(searchParams.scenarioStatus?.idStatus)
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
      <SearchBarTestCase
        placeholder="Buscar cenário de teste"
        onSearch={handleSearch}
      />
      <TestCaseTable testCases={testCases} fetchTestCases={fetchTestCases} />
    </div>
  );
};

export default TestCaseRegisteredTab;
