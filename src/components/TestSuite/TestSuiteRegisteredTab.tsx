import React, { useEffect, useState } from 'react';
import AddTestSuiteButton from './AddTestSuiteButton';
import SearchBar from '../SearchBar';
import TestSuiteTable, { testSuite } from './TestSuiteTable';
import TestSuiteService from '../../services/TestSuiteService';

const TestSuiteRegisteredTab: React.FC = () => {
  const [testSuites, setTestSuites] = useState<testSuite[]>([]);

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

  const handleSearch = async (searchValue: string) => {
    try {
      const filteredTestSuites = await TestSuiteService.searchTestSuite(searchValue);
      setTestSuites(filteredTestSuites);
    } catch (error) {
      console.error(error);
    }
  };

  const defaultTestSuitesTableProps = {
    open: false,
    onClose: () => {},
    onEdit: (testSuite: testSuite) => {},
  };



  return (
    <div>
        <AddTestSuiteButton fetchTestSuite={fetchTestSuite} />
      <SearchBar 
        placeholder="Buscar suite de teste" 
        onSearch={handleSearch}
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
