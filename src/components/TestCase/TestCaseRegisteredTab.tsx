import React, { useEffect, useState } from 'react';
import AddTestCaseButton from './AddTestCaseButton';
import TestCaseTable from './TestCaseTable';
import TestCaseService from '../../services/TestCaseService';
import SearchBarTestCase from '../searchBar/SearchBarTestCase';

interface Team {
  idTime: number;
  nomeTime: string;
}

interface SearchParams {
  searchValue: string;
  team: Team | null;
}

const TestCaseRegisteredTab: React.FC = () => {
  const [testCases, setTestCases] = useState<any[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({ searchValue: '', team: null });

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
      });
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
      <TestCaseTable testCases={testCases} fetchTestCases={fetchTestCases}/>
    </div>
  );
};

export default TestCaseRegisteredTab;
