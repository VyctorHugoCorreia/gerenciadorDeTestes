import React, { useEffect, useState } from 'react';
import AddTestSuiteButton from './AddTestSuiteButton';
import SearchBar from '../searchBar/SearchBar';
import TestSuiteTable, { testSuite } from './TestSuiteTable';
import TestSuiteService from '../../services/TestSuiteService';

interface Team {
  idTeam: number;
  nameTeam: string;
}

export interface Product {
  idProduct: number;
}

export interface TestPlan {
  idPlano: number;
}

interface SearchParams {
  searchValue: string;
  team: Team | null;
  product: Product | null;
  testPlan: TestPlan | null;
}

const TestSuiteRegisteredTab: React.FC = () => {
  const [testSuites, setTestSuites] = useState<testSuite[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>(
    {
      searchValue: '',
      team: null,
      product: null,
      testPlan: null
    }
  );
  const fetchTestSuite = async () => {
    try {
      const testSuitesData = await TestSuiteService.getAllTestSuite();
      setTestSuites(testSuitesData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTestSuite();
  }, []);

  const handleSearch = async (searchParams: SearchParams) => {
    try {
      const filteredTestsSuites = await TestSuiteService.searchTestSuite({
        descSuite: searchParams.searchValue,
        idTeam: searchParams.team?.idTeam ?? undefined,
        idProduct: searchParams.product?.idProduct ?? undefined,
        idPlano: searchParams.testPlan?.idPlano ?? undefined,
      });

      setTestSuites(filteredTestsSuites);
      setSearchParams(searchParams);
    } catch (error) {
      console.error(error);
    }
  };


  const defaultTestSuitesTableProps = {
    open: false,
    onClose: () => { },
    onEdit: (testSuite: testSuite) => { },
  };



  return (
    <div>
      <AddTestSuiteButton fetchTestSuite={fetchTestSuite} />
      <SearchBar
        placeholder="Buscar suite de teste"
        onSearch={handleSearch}
        showTeamsDropdown
        showProductsDropdown
        showTestPlansDropdown
      />
      <TestSuiteTable
        {...defaultTestSuitesTableProps}
        testSuites={testSuites}
        fetchTestSuites={fetchTestSuite}
      />
    </div>
  );
};

export default TestSuiteRegisteredTab;
