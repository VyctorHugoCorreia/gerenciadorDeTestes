import React, { useEffect, useState } from 'react';
import AddTestCaseButton from './AddTestCaseButton';
import SearchBar from '../SearchBar';
import TestCaseTable from './TestCaseTable';
import TestCaseService from '../../services/TestCaseService';
import Steps from '../Steps';
const TeamRegisteredTab: React.FC = () => {
  const [testCases, setTestCases] = useState<any[]>([]);

  const fetchTestCase = async () => {
    try {
      const testCaseData = await TestCaseService.getAllTestCase();
      setTestCases(testCaseData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTestCase();
  }, []);

  const handleSearch = async (searchValue: string) => {
    try {
      const filteredTimes = await TestCaseService.searchTestCase(searchValue);
      setTestCases(filteredTimes);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <AddTestCaseButton fetchTestCase={fetchTestCase} />
      <SearchBar 
      placeholder="Buscar cenário de teste" 
      onSearch={handleSearch}
       />
      <TestCaseTable testCases={testCases} fetchTestCases={fetchTestCase} />
    </div>
  );
};

export default TeamRegisteredTab;
