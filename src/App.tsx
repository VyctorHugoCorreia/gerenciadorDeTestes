import React, { useState, ChangeEvent } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TeamRegisteredTab from './components/Teams/TeamRegisteredTab';
import ProductRegisteredTab from './components/Products/ProductRegisteredTab';
import FeatureRegisteredTab from './components/Feature/FeatureRegisteredTab';
import TestPlanRegisteredTab from './components/TestPlan/TestPlanRegisteredTab';
import TestSuiteRegisteredTab from './components/TestSuite/TestSuiteRegisteredTab';

const App: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Router>
      <div>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Cenários de teste" component={Link} to="/cenarios-de-teste" />
          <Tab label="Plano de teste" component={Link} to="/plano-de-teste" />
          <Tab label="Suíte de teste" component={Link} to="/suite-de-teste" />
          <Tab label="Times cadastrados" component={Link} to="/times-cadastrados" />
          <Tab label="Produtos cadastrados" component={Link} to="/produtos-cadastrados" />
          <Tab label="Funcionalidades cadastradas" component={Link} to="/funcionalidades-cadastradas" />
        </Tabs>

        <Outlet />

        <Routes>
          <Route path="/plano-de-teste" element={<TestPlanRegisteredTab />} />
          <Route path="/suite-de-teste" element={<TestSuiteRegisteredTab />} />
          <Route path="/times-cadastrados" element={<TeamRegisteredTab />} />
          <Route path="/produtos-cadastrados" element={<ProductRegisteredTab />} />
          <Route path="/funcionalidades-cadastradas" element={<FeatureRegisteredTab />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
