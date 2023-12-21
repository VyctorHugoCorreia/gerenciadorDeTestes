import React, { useEffect, useState } from 'react';
import AddTestPlanButton from './AddTestPlanButton';
import SearchBar from '../SearchBar';
import TestPlanTable, { testPlan } from './TestPlanTable';
import TestPlanService from '../../services/TestPlanService';

const TestPlanRegisteredTab: React.FC = () => {
  const [testPlans, setTestPlans] = useState<testPlan[]>([]);

  const fetchTestPlan = async () => {
    try {
      const testPlansData = await TestPlanService.getAllTestPlan();
      setTestPlans(testPlansData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTestPlan();
  }, []);

  const handleSearch = async (searchValue: string) => {
    try {
      const filteredTestPlans = await TestPlanService.searchTestPlan(searchValue);
      setTestPlans(filteredTestPlans);
    } catch (error) {
      console.error(error);
    }
  };

  const defaultTestPlansTableProps = {
    open: false,
    onClose: () => {},
    onEdit: (testPlan: testPlan) => {},
  };



  return (
    <div>
        <AddTestPlanButton fetchTestPlan={fetchTestPlan} />
      <SearchBar 
        placeholder="Buscar plano de teste" 
        onSearch={handleSearch}
      />
      <TestPlanTable 
        {...defaultTestPlansTableProps}
        testPlans={testPlans} 
        fetchTestPlans={fetchTestPlan} 
      />
    </div>
  );
};

export default TestPlanRegisteredTab;
