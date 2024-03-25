import React from 'react';
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LoginForm from './screens/LoginForm';
import Dashboard from './components/DashBoard/Dashboard';
import CreateTestCase from './screens/CreateTestCaseScreen';
import EditTestCase from './screens/EditTestCaseScreen';
import DetailsTestCase from './screens/DetailsTestCaseScreen';
import TestCaseRegisteredTab from './components/TestCase/TestCaseRegisteredTab';
import TestPlanRegisteredTab from './components/TestPlan/TestPlanRegisteredTab';
import TestSuiteRegisteredTab from './components/TestSuite/TestSuiteRegisteredTab';
import TeamRegisteredTab from './components/Teams/TeamRegisteredTab';
import ProductRegisteredTab from './components/Products/ProductRegisteredTab';
import UserRegisteredTab from './components/User/UserRegisteredTab';

import { getAuthentication } from './authentication/authentication';
import { getAcessProfile } from './authentication/token';
import ChangePasswordForm from './screens/ChangePasswordForm';


const App: React.FC = () => {
  const navigate = useNavigate();

  const isLoggedIn = getAuthentication();
  const acessProfile = getAcessProfile();

  const location = useLocation();

  if (location.pathname === '/criar-caso-de-teste') {
    return <CreateTestCase />;
  }

  if (location.pathname.startsWith('/edit-test-case')) {
    const id = location.pathname.split('/').pop();
    return <EditTestCase testCaseId={id} />;
  }

  if (location.pathname.startsWith('/details-test-case')) {
    const id = location.pathname.split('/').pop();
    return <DetailsTestCase testCaseId={id} />;
  }

  if (location.pathname.startsWith('/dashboard')) {
    const id = location.pathname.split('/').pop();
    return <Dashboard idTime={id}/>;
  }

  const AuthenticatedTabs = () => (
    <Tabs value={location.pathname}>
      <Tab label="Cenários de teste" component={Link} to="/cenarios-de-teste" />
      <Tab label="Plano de teste" component={Link} to="/plano-de-teste" />
      <Tab label="Suíte de teste" component={Link} to="/suite-de-teste" />
      <Tab label="Times cadastrados" component={Link} to="/times-cadastrados" />
      <Tab label="Produtos cadastrados" component={Link} to="/produtos-cadastrados" />
      {acessProfile === 'Administrador' && (
        <Tab label="Administração de usuários" component={Link} to="/usuarios" />
      )}
    </Tabs>
  );

  const RouterContent: React.FC = () => {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/trocar-senha" element={<ChangePasswordForm />} />
        <Route path="/dashboard" element={requireAuth(<Dashboard />)} />
        <Route path="/criar-caso-de-teste" element={requireAuth(<CreateTestCase />)} />
        <Route path="/edit-test-case/:id" element={requireAuth(<EditTestCase />)} />
        <Route path="/details-test-case/:id" element={requireAuth(<DetailsTestCase />)} />
        <Route path="/cenarios-de-teste" element={requireAuth(<TestCaseRegisteredTab />)} />
        <Route path="/plano-de-teste" element={requireAuth(<TestPlanRegisteredTab />)} />
        <Route path="/suite-de-teste" element={requireAuth(<TestSuiteRegisteredTab />)} />
        <Route path="/times-cadastrados" element={requireAuth(<TeamRegisteredTab />)} />
        <Route path="/produtos-cadastrados" element={requireAuth(<ProductRegisteredTab />)} />

        {acessProfile === 'Administrador' && (
          <Route path="/usuarios" element={requireAuth(<UserRegisteredTab />)} />
        )}
        <Route path="*" element={<Navigate to={!isLoggedIn ? '' : '/login'} />} />
      </Routes>
    );
  };

  const requireAuth = (element: React.ReactNode) => {
    if (isLoggedIn) {
      return element;
    } else {
      return <Navigate to="/login" />;
    }
  };

  return (
    <>
      {isLoggedIn && <AuthenticatedTabs />}
      <RouterContent />
    </>
  );
};

export default App;
