import React, { useEffect, useState } from 'react';
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
import { getAuthentication } from './authentication/authentication';
import { getAcessProfile } from './authentication/token';

type PathToIndexMap = {
  [key: string]: number;
};

const App: React.FC = () => {
  const isLoggedIn = getAuthentication();
  const acessProfile = getAcessProfile();
  const location = useLocation();

  const [defaultTabIndex, setDefaultTabIndex] = useState(() => {
    const pathToIndex: PathToIndexMap = {
      '/cenarios-de-teste': 0,
      '/plano-de-teste': 1,
      '/suite-de-teste': 2,
      '/times-cadastrados': 3,
      '/produtos-cadastrados': 4,
      '/usuarios': 5,
      '/dashboard': 6
    };
    return pathToIndex[location.pathname] || 0;
  });

  useEffect(() => {
    const pathToIndex: PathToIndexMap = {
      '/cenarios-de-teste': 0,
      '/plano-de-teste': 1,
      '/suite-de-teste': 2,
      '/times-cadastrados': 3,
      '/produtos-cadastrados': 4,
      '/usuarios': 5,
      '/dashboard': 6
    };

    const newIndex = pathToIndex[location.pathname];

    if (newIndex !== undefined && defaultTabIndex !== newIndex) {
      setDefaultTabIndex(newIndex);
    }
  }, [location.pathname]);

  const AuthenticatedTabs = () => {
    const hideTabsForRoutes = ['/login', '/trocar-senha', '/dashboard', '/criar-caso-de-teste', '/edit-test-case', '/details-test-case'];
    if (hideTabsForRoutes.some(route => location.pathname.includes(route))) {
      return null;
    }

    return (
      <Tabs value={defaultTabIndex}>
        <Tab label="Cenários de teste" component={Link} to="/cenarios-de-teste" />
        <Tab label="Plano de teste" component={Link} to="/plano-de-teste" />
        <Tab label="Suíte de teste" component={Link} to="/suite-de-teste" />
        <Tab label="Times cadastrados" component={Link} to="/times-cadastrados" />
        <Tab label="Produtos cadastrados" component={Link} to="/produtos-cadastrados" />
      </Tabs>
    );
  };

  const RouterContent: React.FC = () => (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/dashboard/:idTime" element={requireAuth(<Dashboard />)} />
      <Route path="/criar-caso-de-teste" element={requireAuth(<CreateTestCase />)} />
      <Route path="/edit-test-case/:testCaseId" element={requireAuth(<EditTestCase />)} />
      <Route path="/details-test-case/:testCaseId" element={requireAuth(<DetailsTestCase />)} />
      <Route path="/cenarios-de-teste" element={requireAuth(<TestCaseRegisteredTab />)} />
      <Route path="/plano-de-teste" element={requireAuth(<TestPlanRegisteredTab />)} />
      <Route path="/suite-de-teste" element={requireAuth(<TestSuiteRegisteredTab />)} />
      <Route path="/times-cadastrados" element={requireAuth(<TeamRegisteredTab />)} />
      <Route path="/produtos-cadastrados" element={requireAuth(<ProductRegisteredTab />)} />
      <Route path="*" element={<Navigate to={isLoggedIn ? '/cenarios-de-teste' : '/login'} />} />
    </Routes>
  );

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
