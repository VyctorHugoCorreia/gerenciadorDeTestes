import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TeamRegisteredTab from './components/Teams/TeamRegisteredTab';
import ProductRegisteredTab from './components/Products/ProductRegisteredTab';
import FeatureRegisteredTab from './components/Feature/FeatureRegisteredTab';
import TestPlanRegisteredTab from './components/TestPlan/TestPlanRegisteredTab';
import TestSuiteRegisteredTab from './components/TestSuite/TestSuiteRegisteredTab';

const App: React.FC = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Cenários de teste" />
        <Tab label="Plano de teste" />
        <Tab label="Suíte de teste" />
        <Tab label="Times cadastrados" />
        <Tab label="Produtos cadastrados" />
        <Tab label="Funcionalidades cadastradas" />
      </Tabs>
      {tabValue === 1 && <TestPlanRegisteredTab />}
      {tabValue === 2 && <TestSuiteRegisteredTab />}
      {tabValue === 3 && <TeamRegisteredTab />}
      {tabValue === 4 && <ProductRegisteredTab />}
      {tabValue === 5 && <FeatureRegisteredTab />}
    </div>
  );
};

export default App;
