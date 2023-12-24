// App.tsx

import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TeamRegisteredTab from './components/Teams/TeamRegisteredTab';
import ProductRegisteredTab from './components/Products/ProductRegisteredTab';
import FeatureRegisteredTab from './components/Feature/FeatureRegisteredTab';
import TestPlanRegisteredTab from './components/TestPlan/TestPlanRegisteredTab';
import TestSuiteRegisteredTab from './components/TestSuite/TestSuiteRegisteredTab';
import TestCaseRegisteredTab from './components/TestCase/TestCaseRegisteredTab';
import CreateTestCase from './components/TestCase/CreateTestCase';
import Header from './components/Header';
import './styles/GlobalStyles.css'
const App: React.FC = () => {
  return (
    
      <RouterContent />
  
  );
};

const RouterContent: React.FC = () => {
  return (
      <Routes>
        <Route
          path="/"
          element={
            <Tabs>
              <Tab label="Cenários de teste" component={Link} to="/cenarios-de-teste" />
              <Tab label="Plano de teste" component={Link} to="/plano-de-teste" />
              <Tab label="Suíte de teste" component={Link} to="/suite-de-teste" />
              <Tab label="Times cadastrados" component={Link} to="/times-cadastrados" />
              <Tab label="Produtos cadastrados" component={Link} to="/produtos-cadastrados" />
              <Tab label="Funcionalidades cadastradas" component={Link} to="/funcionalidades-cadastradas" />
            </Tabs>
          }
        />
        <Route path="/cenarios-de-teste" element={<TestCaseRegisteredTab />} />
        <Route path="/plano-de-teste" element={<TestPlanRegisteredTab />} />
        <Route path="/suite-de-teste" element={<TestSuiteRegisteredTab />} />
        <Route path="/times-cadastrados" element={<TeamRegisteredTab />} />
        <Route path="/produtos-cadastrados" element={<ProductRegisteredTab />} />
        <Route path="/funcionalidades-cadastradas" element={<FeatureRegisteredTab />} />
        <Route path="/criar-caso-de-teste" element={<CreateTestCase />} />
      </Routes>
  );

};

export default App;
