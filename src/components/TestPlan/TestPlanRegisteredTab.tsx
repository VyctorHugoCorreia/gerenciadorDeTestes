import React, { useEffect, useState } from 'react';
import AddTestPlanButton from './AddTestPlanButton';
import SearchBar from '../searchBar/SearchBarWithTeam';
import TestPlanTable, { TestPlan } from './TestPlanTable';
import TestPlanService from '../../services/TestPlanService';

interface Team {
  idTime: number;
  nomeTime: string;
}

interface SearchParams {
  searchValue: string;
  team: Team | null;
}

const TestPlanRegisteredTab: React.FC = () => {
  const [testPlans, setTestPlans] = useState<TestPlan[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>(
    {
      searchValue: '',
      team: null,
    }
  );

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

  const handleSearch = async (searchParams: SearchParams) => {
    try {
      const filteredTestsPlans = await TestPlanService.searchTestPlan({
        descPlano: searchParams.searchValue,
        idTime: searchParams.team?.idTime ?? undefined,
      });


      setTestPlans(filteredTestsPlans);
      setSearchParams(searchParams);
    } catch (error) {
      console.error(error);
    }
  };

  const defaultTestPlansTableProps = {
    open: false,
    onClose: () => { },
    onEdit: (testPlan: TestPlan) => { },
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
