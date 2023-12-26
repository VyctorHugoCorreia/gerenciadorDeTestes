// App.tsx

import React from 'react';
import { Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';
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
import './styles/GlobalStyles.css';
import EditTestCase from './components/TestCase/EditTestCase';

const App: React.FC = () => {
  const location = useLocation();

  if (location.pathname === '/criar-caso-de-teste') {
    return <CreateTestCase />;
  }

  if (location.pathname.startsWith('/edit-test-case')) {
    const id = location.pathname.split('/').pop();
    return <EditTestCase testCaseId={id} />;
  }
  
  
  return (
    <>
      <Tabs value={location.pathname}>
        <Tab label="Cenários de teste" value="/cenarios-de-teste" component={Link} to="/cenarios-de-teste" />
        <Tab label="Plano de teste" value="/plano-de-teste" component={Link} to="/plano-de-teste" />
        <Tab label="Suíte de teste" value="/suite-de-teste" component={Link} to="/suite-de-teste" />
        <Tab label="Times cadastrados" value="/times-cadastrados" component={Link} to="/times-cadastrados" />
        <Tab label="Produtos cadastrados" value="/produtos-cadastrados" component={Link} to="/produtos-cadastrados" />
        <Tab label="Funcionalidades cadastradas" value="/funcionalidades-cadastradas" component={Link} to="/funcionalidades-cadastradas" />
      </Tabs>
      <RouterContent />
    </>
  );
};

const RouterContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/cenarios-de-teste" element={<TestCaseRegisteredTab />} />
      <Route path="/plano-de-teste" element={<TestPlanRegisteredTab />} />
      <Route path="/suite-de-teste" element={<TestSuiteRegisteredTab />} />
      <Route path="/times-cadastrados" element={<TeamRegisteredTab />} />
      <Route path="/produtos-cadastrados" element={<ProductRegisteredTab />} />
      <Route path="/funcionalidades-cadastradas" element={<FeatureRegisteredTab />} />
      <Route path="/criar-caso-de-teste" element={<CreateTestCase />} />
      <Route path="/edit-test-case/:id" element={<EditTestCase />} /> {/* Adicione a rota de edição aqui */}
    </Routes>
  );
};

export default App;
