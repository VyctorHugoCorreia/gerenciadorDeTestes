import React, { useEffect, useState } from 'react';
import AddTestPlanButton from './AddTestPlanButton';
import SearchBar from '../searchBar/SearchBar';
import TestPlanTable, { TestPlan } from './TestPlanTable';
import TestPlanService from '../../services/TestPlanService';

interface Team {
  idTeam: number;
  nameTeam: string;
}

export interface Product {
  idProduct: number;
}


interface SearchParams {
  searchValue: string;
  team: Team | null;
  product: Product | null;

}

const TestPlanRegisteredTab: React.FC = () => {
  const [testPlans, setTestPlans] = useState<TestPlan[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>(
    {
      searchValue: '',
      team: null,
      product: null
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
        idTeam: searchParams.team?.idTeam ?? undefined,
        idProduct: searchParams.product?.idProduct ?? undefined,
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
        showTeamsDropdown={true}
        showProductsDropdown={true}
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
